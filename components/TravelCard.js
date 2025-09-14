export default function TravelCard() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-4 my-6">
      <div className="flex justify-between items-center mb-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <span className="text-sm text-gray-500">投稿日時</span>
      </div>
      <div className="space-y-4 text-gray-700">
        <div>
          <span className="font-semibold block">行先</span>
        </div>
        <div>
          <span className="font-semibold block">期間</span>
        </div>
        <div>
          <span className="font-semibold block">訪れる予定地</span>
        </div>
        <div>
          <span className="font-semibold block">お土産募集期間</span>
        </div>
        <div>
          <span className="font-semibold block">コメント</span>
        </div>
      </div>
      <div className="mt-6 text-center">
        <button className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-orange-600 transition-colors">
          お願いする
        </button>
      </div>
    </div>
  );
}