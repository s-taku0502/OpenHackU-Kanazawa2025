'use client';

import { useState } from 'react';
import { db } from '../app/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { MdClose } from "react-icons/md";
import Image from 'next/image'; // 1. next/imageをインポート

export default function GiftRequestForm({ onCloseModal, tripId }) {
  const [souvenirName, setSouvenirName] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!tripId) {
      setMessage('旅行情報が取得できません');
      return;
    }
    try {
      await addDoc(collection(db, 'souvenir_requests'), {
        tripId: tripId,
        requesterUid: user.uid,
        souvenirName: souvenirName,
        comment: comment,
        createdAt: serverTimestamp(),
      });
      setSouvenirName('');
      setComment('');
      onCloseModal();
    } catch (error) {
      setMessage('登録に失敗しました');
    }
  };

  const handleShowAiSuggestion = () => {
    setShowAiSuggestion(true);
    setShowButton(false);
  };

  const handleHideAiSuggestion = () => {
    setShowAiSuggestion(false);
    setShowButton(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 relative">
        <button
          onClick={onCloseModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300"
          aria-label="Close"
        >
          <span><MdClose className="h-6 w-6" /></span>
        </button>
        <div className="flex justify-center mb-6">
          {/* 2. divをImageコンポーネントに置き換えます */}
          <div className="w-20 h-20 relative rounded-full overflow-hidden">
            <Image
              src="/file.svg" // アイコンのパスを指定
              alt="User Icon"
              fill // 親要素に合わせてサイズを自動調整
              className="rounded-full" // スタイルを適用
              sizes="80px"
              priority
            />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="item" className="block text-gray-700 font-semibold mb-2">旅行予定地</label>
            <input 
              type="text" 
              id="tripLocation" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black" 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="item" className="block text-gray-700 font-semibold mb-2">希望の物</label>
            <input
              type="text"
              id="item"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
              placeholder="例：〇〇のチーズケーキ"
              value={souvenirName}
              onChange={(e) => setSouvenirName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="comment" className="block text-gray-700 font-semibold mb-2">コメント</label>
            <textarea
              id="comment"
              className="w-full h-20 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-black"
              placeholder="お土産に関するコメントがあればどうぞ"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          
          {showButton && (
            <div className="flex justify-start mb-6">
              <button
                type="button"
                onClick={handleShowAiSuggestion}
                className="bg-orange-400 text-white text-xs px-4 py-2 rounded-lg shadow-md relative bubble"
              >
                AIにお土産を提案してもらう
              </button>
            </div>
          )}

          {showAiSuggestion && (
            <div className="relative mb-6" onClick={handleHideAiSuggestion}>
              <div className="bg-white border border-orange-400 text-sm p-4 rounded-lg shadow-md relative bubble-bottom-left">
                <p>お土産A</p>
                <p>お土産B</p>
              </div>
            </div>
          )}

          {message && <p>{message}</p>}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
          >
            登録
          </button>
        </form>
      </div>
    </div>
  );
}