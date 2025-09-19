
import { useState } from 'react';
import { MdDelete } from "react-icons/md";
import Image from 'next/image';

export default function TravelCard({ onOpenModal, trip, userUid }) {
  const [visible, setVisible] = useState(true);
  const formatDate = (timestamp) => {
    if (!timestamp) return '未設定';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  if (!visible) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-4 my-6 font-sans">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 relative rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={'/file.svg'}
              alt="旅行者アイコン"
              fill
              className="rounded-full"
              sizes="35px"
              priority
            />
          </div>
          <p className='text-black'>{trip.travelerName}</p>
        </div>

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
      <div className="mt-6 flex flex-col items-center space-y-2">
        <button
          onClick={onOpenModal}
          className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
        >
          お願いする
        </button>
        {userUid === trip.travelerUid && (
          <div className="flex justify-end w-full mt-4">
            <button
              onClick={() => {
                if (window.confirm('本当に削除してよろしいですか？')) setVisible(false);
              }}
              className="flex items-center space-x-1 px-4 py-2 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 transition-colors"
            >
              <span>削除</span>
              <span><MdDelete className="text-xl text-white" /></span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}