'use client';

export default function GiftRequestForm({ onCloseModal }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
        </div>

        <div className="mb-4">
          <label htmlFor="item" className="block text-gray-700 font-semibold mb-2">希望の物</label>
          <input 
            type="text" 
            id="item" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black" 
            placeholder="例：〇〇のチーズケーキ"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="comment" className="block text-gray-700 font-semibold mb-2">コメント</label>
          <textarea 
            id="comment" 
            className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-black" 
            placeholder="お土産に関するコメントがあればどうぞ"
          ></textarea>
        </div>
        
        <div className="mb-6">
            <div className="relative top-[-10px] left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-orange-400 text-white text-xs px-4 py-2 rounded-full shadow-md relative bubble-top">
                    AIにお土産を提案してもらう
                </div>
            </div>
        </div>

        <button 
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
        >
          登録
        </button>
      </div>
    </div>
  );
}