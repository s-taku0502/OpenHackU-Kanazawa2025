import React from 'react';
import { MdDelete } from "react-icons/md";
import Image from 'next/image';


import { useState } from 'react';

// userUid: 現在ログイン中のユーザーのUIDをpropsで受け取る
export default function SouvenirPhoto({ userUid }) {
  const [souvenirs, setSouvenirs] = useState([
    {
      id: 'souvenir_01',
      image: 'https://images.unsplash.com/photo-1549488344-935108424072',
      name: '温泉まんじゅう',
      expiration: '2025/12/31',
      quantity: '10個',
      location: '箱根のお土産屋さん',
      comment: '定番のお土産です。',
      postDate: '2025/9/18',
      travelerName: 'ナタデココ',
      travelerImage: '/file.svg',
      travelerUid: 'uid_01',
    },
    {
      id: 'souvenir_02',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      name: '金沢の和菓子',
      expiration: '2025/10/10',
      quantity: '5個',
      location: '金沢駅',
      comment: '上品な甘さが特徴です。',
      postDate: '2025/9/17',
      travelerName: 'たくみ',
      travelerImage: '/globe.svg',
      travelerUid: 'uid_02',
    },
    {
      id: 'souvenir_03',
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      name: '北海道チーズケーキ',
      expiration: '2025/11/05',
      quantity: '3個',
      location: '新千歳空港',
      comment: '濃厚で美味しい！',
      postDate: '2025/9/16',
      travelerName: 'さくら',
      travelerImage: '/window.svg',
      travelerUid: 'uid_01',
    }
  ]);

  const handleDelete = (id) => {
    if (window.confirm('本当に削除してよろしいですか？')) {
      setSouvenirs((prev) => prev.filter((souvenir) => souvenir.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {souvenirs.map((souvenir) => (
        <div key={souvenir.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col font-sans">
          <div className="flex justify-between items-center mb-4 text-gray-500 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 relative rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={souvenir.travelerImage}
                  alt="旅行者アイコン"
                  fill
                  className="rounded-full"
                  sizes="35px"
                  priority
                />
              </div>
              <p className='text-black'>{souvenir.travelerName}</p>
            </div>
            <span className="text-sm text-gray-500">投稿日時: {souvenir.postDate}</span>
          </div>
          <div className="text-gray-700 space-y-4">
            <div>
              <span className="font-semibold block text-lg">お土産の写真</span>
              <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mt-2">
                <img src={souvenir.image} alt="Souvenir" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <span className="font-semibold block text-lg">お土産名</span>
              <p className="text-base">{souvenir.name}</p>
            </div>
            <div>
              <span className="font-semibold block text-lg">賞味期限</span>
              <p className="text-base">{souvenir.expiration}</p>
            </div>
            <div>
              <span className="font-semibold block text-lg">個数</span>
              <p className="text-base">{souvenir.quantity}</p>
            </div>
            <div>
              <span className="font-semibold block text-lg">設置場所</span>
              <p className="text-base">{souvenir.location}</p>
            </div>
            <div>
              <span className="font-semibold block text-lg">コメント</span>
              <p className="text-base">{souvenir.comment}</p>
            </div>
          </div>

          {/* 誰でも削除ボタンを表示 */}
          {/* <div className="flex justify-end mt-4">
            <button
              onClick={() => handleDelete(souvenir.id)}
              className="flex items-center space-x-1 px-4 py-2 bg-orange-500 text-black rounded-full text-sm hover:bg-orange-600 transition-colors"
            >
              <span>削除</span>
              <span><MdDelete className="text-xl text-black" /></span>
            </button>
          </div> */}
          {/* 投稿者のみ削除ボタンを表示 */}
          {userUid === souvenir.travelerUid && (
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleDelete(souvenir.id)}
                className="flex items-center space-x-1 px-4 py-2 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 transition-colors"
              >
                <span>削除</span>
                <span><MdDelete className="text-xl text-white" /></span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}