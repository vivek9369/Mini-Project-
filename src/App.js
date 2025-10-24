import React, { useState, useEffect } from 'react';
import CodeInput from './components/CodeInput';
import OutputPanel from './components/OutputPanel';
import Header from './components/Header';
import { processCodeWithGemini } from './services/geminiService';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [mode, setMode] = useState('explain');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Populate example code on load
  useEffect(() => {
    setCode(`function calculateTotal(items) {
    let total = 0;
    for (let i = 0; i <= items.length; i++) {
        total += items[i].price;
    }
    return total;
}
// Example call: calculateTotal([{price: 10}, {price: 20}])`);
  }, []);

  const handleProcessCode = async () => {
    if (code.trim().length < 10) {
      setError("Please paste a valid code snippet (at least 10 characters long).");
      return;
    }

    setIsLoading(true);
    setError('');
    setOutput('');

    try {
      const result = await processCodeWithGemini(code, language, mode);
      setOutput(result);
    } catch (err) {
      setError(err.message);
      setOutput(`<p class="text-red-500 font-semibold">Failed to get analysis. Please check the console for details.</p>`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-10">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300">
        <Header />
        
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
          <CodeInput
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            mode={mode}
            setMode={setMode}
            onProcess={handleProcessCode}
            isLoading={isLoading}
          />
          
          <OutputPanel
            output={output}
            error={error}
            isLoading={isLoading}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
