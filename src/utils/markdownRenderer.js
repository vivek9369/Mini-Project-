/**
 * Renders Markdown content as proper HTML, focusing on reliability for code blocks, lists, and headings.
 * This function has been significantly improved for better visual output based on the user's feedback.
 * @param {string} markdownText - The Markdown text to render.
 * @returns {string} The rendered HTML
 */
export const renderMarkdown = (markdownText) => {
  // Normalize newline characters
  let htmlText = markdownText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 1. Handle Code Blocks (must be done first to protect content)
  // Replace ```[lang]\ncode\n``` with <pre><code>...</code></pre>
  htmlText = htmlText.replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
    const language = lang || 'text';
    return `<pre><code class="language-${language}">${code.trim()}</code></pre>\n`;
  });

  // 2. Headings (H1 and H2 - the most common)
  htmlText = htmlText.replace(/^##\s*(.*)$/gm, '<h2>$1</h2>');
  htmlText = htmlText.replace(/^#\s*(.*)$/gm, '<h1>$1</h1>');

  // 3. Horizontal Rule
  htmlText = htmlText.replace(/^-{3,}$/gm, '<hr>');

  // 4. Strong/Bold
  htmlText = htmlText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  htmlText = htmlText.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  
  // 5. Unordered Lists (Must be done before paragraph wrapping)
  // Find list items starting with '*' or '-' at the start of a line (or after a newline)
  // Look for * or - followed by a space at the beginning of a line
  htmlText = htmlText.replace(/(^|\n)[\*\-]\s+(.*)$/gm, '$1<li>$2</li>');
  
  // Wrap consecutive <li> tags in <ul> tags
  htmlText = htmlText.replace(/(<li>[\s\S]*?<\/li>)/g, (match, content) => {
    if (content.trim().startsWith('<li>')) {
      // Check if the previous content was NOT the end of a list
      let before = htmlText.substring(0, htmlText.indexOf(match));
      if (!before.trim().endsWith('</ul>') && !before.trim().endsWith('</li>') && !before.trim().endsWith('<br>')) {
        return `<ul>${match}</ul>`;
      }
    }
    return match;
  });

  // Second pass for lists, replacing contiguous list items
  htmlText = htmlText.replace(/<\/ul>\s*<ul>/g, '');

  // 6. Paragraphs and Line Breaks
  // Replace two or more consecutive newlines with a paragraph closer/opener.
  htmlText = htmlText.replace(/\n{2,}/g, '</p><p>');
  // Replace single newlines with a <br>
  htmlText = htmlText.replace(/\n/g, '<br>');

  // 7. Final cleanup and wrapping
  // Remove leading/trailing <br> tags.
  htmlText = htmlText.replace(/<br>$/, '').replace(/^<br>/, '');

  // Wrap non-block content in a starting paragraph tag
  if (!htmlText.startsWith('<h1>') && !htmlText.startsWith('<h2>') && !htmlText.startsWith('<pre>') && !htmlText.startsWith('<ul>') && htmlText.length > 0) {
    htmlText = `<p>${htmlText}`;
  }

  // Ensure we close any opened paragraph tag
  if (htmlText.includes('<p>') && !htmlText.endsWith('</p>') && !htmlText.endsWith('</ul>') && !htmlText.endsWith('</pre>')) {
    htmlText += '</p>';
  }

  // Final cleanup of extra tags
  htmlText = htmlText.replace(/<p><\/p>/g, '');
  htmlText = htmlText.replace(/<p><br>/g, '<p>');
  htmlText = htmlText.replace(/<br><\/p>/g, '</p>');
  
  return htmlText.trim();
};
