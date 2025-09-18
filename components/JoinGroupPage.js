import { useState } from 'react';

const JoinGroupPage = ({ onBack, onSearch, message, setMessage }) => {
  const [searchId, setSearchId] = useState("");

  const handleSearchClick = () => {
    if (!searchId.trim()) {
      setMessage("グループIDを入力してください。");
      return;
    }
    setMessage(""); 
    onSearch(searchId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      <div className="flex-grow flex flex-col items-center justify-center p-4 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">グループに参加</h2>
        <div className="mb-4 w-full">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="グループIDを入力"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
        
        {message && (
          <p className="text-red-500 text-center mb-4">{message}</p>
        )}

        <button
          onClick={handleSearchClick}
          className="w-full py-3 px-6 rounded-full text-black font-bold bg-orange-500 hover:bg-orange-600 focus:outline-none"
        >
          検索
        </button>
      </div>

      <div className="w-full max-w-sm p-4">
        <button
          onClick={onBack}
          className="w-full py-3 px-6 rounded-full text-black font-bold bg-gray-500 hover:bg-gray-600 focus:outline-none"
        >
          戻る
        </button>
      </div>
    </div>
  );
};

export default JoinGroupPage;