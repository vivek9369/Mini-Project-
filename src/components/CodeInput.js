import React from 'react';

const CodeInput = ({ 
  code, 
  setCode, 
  language, 
  setLanguage, 
  mode, 
  setMode, 
  onProcess, 
  isLoading 
}) => {
  const getButtonText = () => {
    if (isLoading) {
      switch (mode) {
        case 'explain': return 'Explaining...';
        case 'debug': return 'Debugging...';
        case 'refactor': return 'Refactoring...';
        default: return 'Analyzing...';
      }
    }
    return 'Analyze Code...';
  };

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">
        Input & Configuration
      </h2>

      {/* Control Panel */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Language Selector */}
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="flex-1 p-3 border border-indigo-300 rounded-xl shadow-md focus:ring-purple-500 focus:border-purple-500 text-gray-700 bg-white transition duration-150"
        >
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="TypeScript">TypeScript</option>
          <option value="Go">Go</option>
          <option value="C++">C++</option>
          <option value="Rust">Rust</option>
          <option value="General">General/Other</option>
        </select>

        {/* Mode Selector */}
        <select 
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="flex-1 p-3 border border-indigo-300 rounded-xl shadow-md focus:ring-purple-500 focus:border-purple-500 text-gray-700 bg-white transition duration-150"
        >
          <option value="explain">📝 Explain Code</option>
          <option value="debug">🐛 Find & Fix Bug</option>
          <option value="refactor">✨ Refactor/Improve</option>
        </select>
      </div>
      
      {/* Code Input Area */}
      <textarea 
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code snippet here..." 
        className="w-full p-5 border border-gray-300 rounded-xl shadow-inner focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-sm font-mono bg-gray-50 resize-none transition duration-200"
      />

      {/* Submit Button */}
      <button 
        onClick={onProcess}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        <span className="text-lg">{getButtonText()}</span>
        {isLoading && (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
      </button>
    </section>
  );
};

export default CodeInput;
