'use client';

import { useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

export default function SouvenirAddForm({ onCloseModal }) {
  const [photo, setPhoto] = useState(null);
  const [souvenirName, setSouvenirName] = useState('');
  const [expiration, setExpiration] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ photo, souvenirName, expiration, quantity, location, comment });
    onCloseModal();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white">
      {/* 戻るボタンとタイトルを配置するヘッダー */}
      <div className="w-full px-4 py-6">
        <button
          onClick={onCloseModal}
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition duration-300"
          aria-label="戻る"
        >
          <MdOutlineKeyboardArrowLeft className="h-6 w-6" />
          <span>戻る</span>
        </button>
      </div>

      {/* フォームのコンテナ */}
      <div className="w-full p-4">
        <h2 className="text-xl font-bold text-center mb-6 text-gray-800">お土産の追加</h2>
        
        <form onSubmit={handleSubmit} className="space-y-1">
          {/* 写真アップロード */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">写真をアップロードする</label>
            <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition duration-300">
              <span className="flex items-center space-x-2 text-gray-500">
                <IoCloudUploadOutline className="w-6 h-6" />
                <span>ファイルから選択する</span>
              </span>
              <input 
                type="file" 
                onChange={(e) => setPhoto(e.target.files[0])}
                className="sr-only"
              />
            </div>
          </div>
          
          {/* お土産名 */}
          <div>
            <label htmlFor="souvenirName" className="text-sm font-medium text-gray-700 block mb-1">お土産名</label>
            <input
              id="souvenirName"
              type="text"
              value={souvenirName}
              onChange={(e) => setSouvenirName(e.target.value)}
              placeholder=""
              required
              className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 caret-black text-black"
            />
          </div>

          {/* 賞味期限 */}
          <div>
            <label htmlFor="expiration" className="text-sm font-medium text-gray-700 block mb-1">賞味期限</label>
            <input
              id="expiration"
              type="date"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              placeholder=""
              required
              className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 caret-black text-black"
            />
          </div>

          {/* 個数 */}
          <div>
            <label htmlFor="quantity" className="text-sm font-medium text-gray-700 block mb-1">個数</label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder=""
              required
              className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 caret-black text-black"
            />
          </div>

          {/* 設置場所 */}
          <div>
            <label htmlFor="location" className="text-sm font-medium text-gray-700 block mb-1">設置場所</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder=""
              className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 caret-black text-black"
            />
          </div>

          {/* コメント */}
          <div>
            <label htmlFor="comment" className="text-sm font-medium text-gray-700 block mb-1">コメント</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder=""
              className="px-4 py-2 border border-gray-300 rounded-lg w-full h-20 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 resize-none caret-black text-black"
            />
          </div>

          {/* 登録ボタン */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-orange-600 transition duration-300 transform focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          >
            登録
          </button>
        </form>
      </div>
    </div>
  );
}