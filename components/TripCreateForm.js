'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';

export default function TripCreateForm({ onCloseModal, onTripCreated, user }) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('認証情報がありません。');
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        setMessage('ユーザーデータが見つかりません。');
        return;
      }
      const groupId = userDocSnap.data().applying_groupId;
      const travelerName = userDocSnap.data().name;

      const tripsCollectionRef = collection(db, 'trips');
      await addDoc(tripsCollectionRef, {
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location: location,
        deadline: new Date(deadline),
        comment: comment,
        travelerUid: user.uid,
        travelerName: travelerName,
        groupId: groupId,
        createdAt: serverTimestamp(),
      });

      onTripCreated();
      onCloseModal();
    } catch (error) {
      console.error("旅行登録エラー:", error);
      setMessage('登録に失敗しました。時間をおいて再度お試しください。');
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white">
      <div className="w-full px-4 py-6">
        <button
          onClick={onCloseModal}
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition duration-300"
          aria-label="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" fill="currentColor" className="h-4 w-4">
            <path d="M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l139.1 139.1c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448z" />
          </svg>
          <span>戻る</span>
        </button>
      </div>

      <div className="w-full p-4">
        <h2 className="text-xl font-bold text-center mb-6 text-gray-800">旅行予定を追加</h2>

        {message && <p className="text-red-500 text-sm mt-2 text-center">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="destination" className="text-sm font-medium text-gray-700 block mb-1">旅行先</label>
            <input
              id="destination"
              type="text"
              placeholder=""
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 caret-black text-black"
            />
          </div>
          <div>
            <label htmlFor="startDate" className="text-sm font-medium text-gray-700 block mb-1">旅行日程</label>
            <div className="flex items-center space-x-2">
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 caret-black text-black"
              />
              <span className="text-gray-500">〜</span>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 caret-black text-black"
              />
            </div>
          </div>
          <div>
            <label htmlFor="deadline" className="text-sm font-medium text-gray-700 block mb-1">お土産募集期間</label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 caret-black text-black"
            />
          </div>
          <div>
            <label htmlFor="location" className="text-sm font-medium text-gray-700 block mb-1">訪れる予定地</label>
            <input
              id="location"
              type="text"
              placeholder=""
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 caret-black text-black"
            />
          </div>
          <div>
            <label htmlFor="comment" className="text-sm font-medium text-gray-700 block mb-1">コメント</label>
            <textarea
              id="comment"
              placeholder=""
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full h-24 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 resize-none caret-black text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-orange-600 transition duration-300 transform focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          >
            登録
          </button>
        </form>
      </div>
    </div>
  );
}