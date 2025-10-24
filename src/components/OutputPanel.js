import React from 'react';
import { renderMarkdown } from '../utils/markdownRenderer';

const OutputPanel = ({ output, error, isLoading }) => {
  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">
        Code Analysis
      </h2>
      
      <div className="w-full p-5 border border-indigo-200 rounded-xl shadow-inner bg-white custom-scrollbar overflow-y-auto text-gray-800 transition duration-300 output-panel">
        {isLoading ? (
          <p className="text-indigo-600 italic animate-pulse">Analyzing code, please wait...</p>
        ) : output ? (
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(output) }} />
        ) : (
          <p className="text-gray-500 italic">
            Select a mode and paste your code to receive an expert analysis. The analysis will be formatted for optimal readability.
          </p>
        )}
      </div>

      {/* Error Message Box */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative shadow-md" role="alert">
          <strong className="font-bold">Execution Failed:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </section>
  );
};

export default OutputPanel;
