'use client';

import { useState } from 'react';
import { db } from '../app/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

export default function TripCreateForm({ onCloseModal, user, onTripCreated }) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const groupId = userDocSnap.data().applying_groupId;
      const travelerName = userDocSnap.data().name;
      await addDoc(collection(db, 'trips'), {
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
    <div>
      <h2>旅行の予定を追加</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="旅先"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
        <input 
          type="date" 
          placeholder="開始日"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input 
          type="date" 
          placeholder="終了日"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="訪れる予定地"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="date"
          placeholder="お土産募集期間"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
        <textarea
          placeholder="コメント"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">追加する</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}