'use client';

import { useState } from 'react';
import { FaCog } from 'react-icons/fa';

export default function Header() {
  const [activeTab, setActiveTab] = useState('予定');

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex-1 flex justify-center">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('予定')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === '予定' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}
          >
            予定
          </button>
          <button
            onClick={() => setActiveTab('お土産')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'お土産' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}
          >
            お土産
          </button>
        </nav>
      </div>
      <FaCog className="text-xl text-gray-500" />
    </header>
  );
}