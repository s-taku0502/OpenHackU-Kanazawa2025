// Header.jsはsouvenir/page.jsで作成済み

// 'use client';

// import { useState } from 'react';
// import { FaCog } from 'react-icons/fa';

// export default function Header() {
//   const [activeTab, setActiveTab] = useState('予定');

//   return (
//     <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
//       <div className="flex-1 flex justify-center">
//         <nav className="flex space-x-4">
//           {['予定', 'お土産'].map(tab => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}
//             >
//               {tab}
//             </button>
//           ))}
//         </nav>
//       </div>
//       <button type="button" aria-label="設定"><FaCog className="text-xl text-orange-500" /></button>
//     </header>
//   );
// }