import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-700 to-purple-600 p-6 shadow-xl">
      <h1 className="text-3xl font-extrabold text-white flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-pink-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
        Code Assistant
      </h1>
      <p className="text-indigo-200 text-sm mt-1">
        Intelligent assistant for code explanation, debugging, and quality refactoring.
      </p>
    </header>
  );
};

export default Header;
