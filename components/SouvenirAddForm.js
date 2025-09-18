'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/app/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

export default function SouvenirAddForm({ onCloseModal }) {
  const [name, setName] = useState('');
  const [expiration, setExpiration] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setPreviewUrl('');
    }
  }, [selectedImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    } else {
      setSelectedImage(null);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return null;

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `souvenirs/${file.name}_${new Date().getTime()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("画像のアップロードに失敗しました:", error);
      setMessage("画像のアップロードに失敗しました。");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const user = auth.currentUser;
    if (!user) {
      setMessage('ログインしていません。');
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists() || !userDocSnap.data().applying_groupId) {
        setMessage('ユーザーまたはグループ情報が見つかりません。');
        return;
      }
      const groupId = userDocSnap.data().applying_groupId;

      const imageUrl = await handleUpload(selectedImage);

      if (selectedImage && !imageUrl) {
        return;
      }

      await addDoc(collection(db, 'souvenirs'), {
        name,
        expiration,
        quantity,
        location,
        comment,
        image: imageUrl,
        groupId,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      onCloseModal();
      router.refresh();
    } catch (error) {
      console.error("お土産登録エラー:", error);
      setMessage('お土産の登録に失敗しました。');
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white">
      <div className="w-full px-4 py-6">
        <div className="items-center justify-between">
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
          <h2 className="text-xl font-bold text-center text-gray-800">お土産を追加</h2>
        </div>
      </div>

      <div className="w-full p-4">
        {message && <p className="text-red-500 text-sm mt-2 text-center">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="souvenirPhoto" className="text-sm font-medium text-gray-700 block mb-1">お土産の写真</label>
            <div className="flex items-center space-x-4">
              <label htmlFor="fileInput" className="cursor-pointer bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-gray-300 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4.5-4.5 2.5 2.5 3-3L16 13V5h-4v6a1 1 0 01-1 1h-2a1 1 0 01-1-1V5H4v10l4.5-4.5z" clipRule="evenodd" />
                </svg>
                <span>ファイルを選択</span>
              </label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              {selectedImage && (
                <span className="text-sm text-gray-600 truncate max-w-[150px]">{selectedImage.name}</span>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1">お土産名</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 caret-black text-black"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="expiration" className="text-sm font-medium text-gray-700 block mb-1">賞味期限</label>
              <input
                id="expiration"
                type="date"
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 caret-black text-black"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700 block mb-1">個数</label>
              <input
                id="quantity"
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 caret-black text-black"
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="text-sm font-medium text-gray-700 block mb-1">設置場所</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 caret-black text-black"
            />
          </div>
          <div>
            <label htmlFor="comment" className="text-sm font-medium text-gray-700 block mb-1">コメント</label>
            <textarea
              id="comment"
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