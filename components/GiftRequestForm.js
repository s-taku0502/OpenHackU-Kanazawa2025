'use client';

import { useState, useEffect } from 'react';
import { db, model } from '../app/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { MdClose } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import Image from 'next/image';

export default function GiftRequestForm({ onCloseModal, tripId }) {
  const [souvenirName, setSouvenirName] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [destination, setDestination] = useState('');
  const [location, setLocation] = useState('');
  const [travelerIcon, setTravelerIcon] = useState(null);
  const auth = getAuth();
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) return;
      const tripDoc = await getDoc(doc(db, "trips", tripId));
      if (tripDoc.exists()) {
        const tripData = tripDoc.data();
        setDestination(tripData.destination || '');
        setLocation(tripData.location || '');
        if (tripData.travelerUid) {
          const userDoc = await getDoc(doc(db, "users", tripData.travelerUid));
          if (userDoc.exists()) {
            setTravelerIcon(userDoc.data().personal_image || null);
          }
        }
      }
    };
    fetchTrip();
  }, [tripId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!tripId) {
      setMessage('旅行情報が取得できません。');
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
      setMessage('登録に失敗しました。');
    }
  };

  const handleShowAiSuggestion = async () => {
    setShowAiSuggestion(true);
    setShowButton(false);
    setLoading(true);
    
    const prompt = "行き先：" + destination + "（訪れる予定地：" + location + ")のオススメのお土産を5つ教えてください。";
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const aiText = response.text();
      setOutput(aiText);
    } catch (error) {
      setOutput("AIの提案の取得に失敗しました。");
    } finally {
      setLoading(false);
    }
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
          <div className="w-20 h-20 relative rounded-full overflow-hidden">
            <img
              src={travelerIcon || "/file.svg"}
              alt="User Icon"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">行先（旅行予定地）</label>
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-black">
              {destination
                ? location
                  ? `${destination}（${location}）`
                  : destination
                : '取得中...'}
            </div>
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
              <div className="bg-white border border-orange-400 text-sm p-4 rounded-lg shadow-md relative h-48 overflow-y-scroll">
                {loading ? <p>生成中...</p> : <ReactMarkdown>{output}</ReactMarkdown>}
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