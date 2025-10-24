const MAX_RETRIES = 5;

/**
 * Gets the Gemini API key from environment variables
 */
const getApiKey = () => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error("Gemini API key is not configured. Please set REACT_APP_GEMINI_API_KEY in your .env file.");
  }
  return apiKey;
};

/**
 * Gets the API URL for Gemini
 */
const getApiUrl = () => {
  const apiKey = getApiKey();
  return `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
};

/**
 * Helper function to get system instruction based on mode and language
 */
const getSystemInstruction = (mode, language) => {
  switch (mode) {
    case 'explain':
      return `You are a professional code explainer. Your task is to provide a comprehensive, step-by-step breakdown of the provided ${language} code snippet.`;
    case 'debug':
      return `You are an expert debugger and static analysis tool. Your task is to rigorously analyze the provided ${language} code, identify any bugs, logical errors, or potential security vulnerabilities, and provide the definitive fix.`;
    case 'refactor':
      return `You are a world-class software architect. Your task is to review and refactor the provided ${language} code snippet for modern practices, performance, readability, and maintainability.`;
    default:
      return "You are a helpful coding assistant.";
  }
};

/**
 * Helper function to get user query based on mode and code
 */
const getUserQuery = (mode, code) => {
  switch (mode) {
    case 'explain':
      return `Provide a concise summary, followed by a detailed, line-by-line explanation of the following code. Format your entire response strictly in clean, runnable Markdown.
---
${code}`;
    case 'debug':
      return `Identify the bug, explain the solution, and provide the complete, fixed code block (using markdown code fences) for the following snippet. Format your entire response strictly in clean, runnable Markdown.
---
${code}`;
    case 'refactor':
      return `Suggest modern refactoring changes to the following code. Explain your reasoning and provide the complete, clean, refactored code block (using markdown code fences). Format your entire response strictly in clean, runnable Markdown.
---
${code}`;
    default:
      return `Analyze the following code: ${code}`;
  }
};

/**
 * Calls the Gemini API with exponential backoff for resilience
 * @param {object} payload - The request payload
 * @param {number} attempt - Current retry attempt (starts at 1)
 * @returns {Promise<object>} The API response JSON
 */
const callGeminiAPI = async (payload, attempt = 1) => {
  const apiUrl = getApiUrl();

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      if (response.status === 429 && attempt < MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        console.log(`Rate limit exceeded (429). Retrying in ${delay.toFixed(0)}ms (Attempt ${attempt + 1}/${MAX_RETRIES}).`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return callGeminiAPI(payload, attempt + 1);
      }
      const errorJson = await response.json();
      throw new Error(`API Error: ${response.status} - ${errorJson.error?.message || response.statusText}`);
    }

    return response.json();

  } catch (error) {
    throw new Error(`Fetch failed: ${error.message}`);
  }
};

/**
 * Main function to process code with Gemini API
 * @param {string} code - The code to analyze
 * @param {string} language - The programming language
 * @param {string} mode - The analysis mode (explain, debug, refactor)
 * @returns {Promise<string>} The generated analysis
 */
export const processCodeWithGemini = async (code, language, mode) => {
  try {
    const systemInstruction = getSystemInstruction(mode, language);
    const userQuery = getUserQuery(mode, code);

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
    };

    const result = await callGeminiAPI(payload);
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("Gemini did not return a valid response. Check API usage or prompt.");
    }

    return generatedText;

  } catch (error) {
    console.error("Gemini Code Assistant Error:", error);
    throw error;
  }
};
