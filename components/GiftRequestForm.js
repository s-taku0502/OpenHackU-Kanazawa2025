'use client';

import { useState } from 'react';
import { db } from '../app/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function GiftRequestForm({ onCloseModal, tripId }) {
  const [souvenirName, setSouvenirName] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
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

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
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
              value={souvenirName}
              onChange={(e) => setSouvenirName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="comment" className="block text-gray-700 font-semibold mb-2">コメント</label>
            <textarea 
              id="comment" 
              className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-black" 
              placeholder="お土産に関するコメントがあればどうぞ"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-6">
              <div className="relative top-[-10px] left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-orange-400 text-white text-xs px-4 py-2 rounded-full shadow-md relative bubble-top">
                      AIにお土産を提案してもらう
                  </div>
              </div>
          </div>
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