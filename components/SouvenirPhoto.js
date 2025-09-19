import React, { useEffect, useState } from 'react';
import { MdDelete } from "react-icons/md";
import { db } from '@/app/firebase';
import { collection, query, where, onSnapshot, doc, getDoc, deleteDoc, orderBy } from 'firebase/firestore';

export default function SouvenirPhoto({ userUid }) {
  const [souvenirs, setSouvenirs] = useState([]);
  const [groupId, setGroupId] = useState(null);

  useEffect(() => {
    if (!userUid) return;
    const fetchGroupId = async () => {
      const userDoc = await getDoc(doc(db, "users", userUid));
      if (userDoc.exists() && userDoc.data().applying_groupId) {
        setGroupId(userDoc.data().applying_groupId);
      }
    };
    fetchGroupId();
  }, [userUid]);

  useEffect(() => {
    if (!groupId) return;

    const q = query(collection(db, "souvenirs"), where("groupId", "==", groupId), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const souvenirsData = await Promise.all(
        querySnapshot.docs.map(async docSnap => {
          const data = docSnap.data();
          let userName = '';
          let userIcon = null;
          if (data.userId) {
            const userDoc = await getDoc(doc(db, "users", data.userId));
            if (userDoc.exists()) {
              userName = userDoc.data().name || '';
              userIcon = userDoc.data().personal_image || null;
            }
          }
          return {
            id: docSnap.id,
            ...data,
            userName,
            userIcon,
          };
        })
      );
      setSouvenirs(souvenirsData);
    });

    return () => unsubscribe();
  }, [groupId]);

  const handleDelete = async (id) => {
    if (!window.confirm('本当に削除してよろしいですか？')) return;
    await deleteDoc(doc(db, "souvenirs", id));
  };

  return (
    <div className="space-y-6">
      {souvenirs.length === 0 ? (
        <p className="text-center mt-8 text-gray-500">登録されているお土産はありません。</p>
      ) : (
        souvenirs.map((souvenir) => (
          <div key={souvenir.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col font-sans">
            <div className="flex justify-between items-center mb-4 text-gray-500 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 relative rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={souvenir.userIcon || '/file.svg'}
                    alt="投稿者アイコン"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className='text-black'>{souvenir.userName}</p>
              </div>
              <span className="text-sm text-gray-500">
                {souvenir.createdAt?.toDate
                  ? `${souvenir.createdAt.toDate().toLocaleDateString()}`
                  : ''}
              </span>
            </div>
            <div className="text-gray-700 space-y-4">
              <div>
                <span className="font-semibold block text-lg">お土産の写真</span>
                <div className="w-full mt-2">
                  <img 
                    src={souvenir.image} 
                    alt="Souvenir" 
                    className="h-48 w-auto object-contain rounded-lg" 
                  />
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
            {userUid === souvenir.userId && (
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
        ))
      )}
    </div>
  );
}