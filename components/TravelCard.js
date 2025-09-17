import Image from 'next/image';

export default function TravelCard({ onOpenModal, trip }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return '未設定';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-4 my-6">
      <div className="flex justify-between items-center mb-4">
        <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
          {/* personalImageUrlは親から渡す or 取得しておく必要あり */}
          <Image
            src={'/file.svg'}
            alt="旅行者アイコン"
            fill
            className="rounded-full"
            sizes="35px"
            priority
          />
        </div>
        <p>旅行者名：{trip.travelerName}</p>
        <span className="text-sm text-gray-500">{formatDate(trip.createdAt)}</span>
      </div>
      <div className="space-y-4 text-gray-700">
        <div>
          <span className="font-semibold block">行先</span>
          <p>{trip.destination}</p>
        </div>
        <div>
          <span className="font-semibold block">期間</span>
          <p>{formatDate(trip.startDate)} ~ {formatDate(trip.endDate)}</p>
        </div>
        <div>
          <span className="font-semibold block">訪れる予定地</span>
          <p>{trip.location}</p>
        </div>
        <div>
          <span className="font-semibold block">お土産募集期間</span>
          <p>~ {formatDate(trip.deadline)}</p>
        </div>
        <div>
          <span className="font-semibold block">コメント</span>
          <p>{trip.comment}</p>
        </div>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={onOpenModal}
          className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
        >
          お願いする
        </button>
      </div>
    </div>
  );
}