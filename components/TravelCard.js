import { useState, useEffect } from 'react';
import { MdDelete } from "react-icons/md";
import { doc, deleteDoc, collection, query, where, getDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/app/firebase';

export default function TravelCard({ onOpenModal, trip, userUid, onDeleted }) {
  const [visible, setVisible] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!trip.id) return;

    const requestsQuery = query(
      collection(db, 'souvenir_requests'), 
      where('tripId', '==', trip.id),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(requestsQuery, async (querySnapshot) => {
      const requestsData = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const request = docSnap.data();
          let requesterName = '不明';
          let requesterIcon = null;
          if (request.requesterUid) {
            const userDoc = await getDoc(doc(db, 'users', request.requesterUid));
            if (userDoc.exists()) {
              requesterName = userDoc.data().name;
              requesterIcon = userDoc.data().personal_image;
            }
          }
          return {
            id: docSnap.id,
            ...request,
            requesterName,
            requesterIcon,
          };
        })
      );
      setRequests(requestsData);
    });

    return () => unsubscribe();
  }, [trip.id]);


  const formatDate = (timestamp) => {
    if (!timestamp) return '未設定';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  const handleDelete = async () => {
    if (!window.confirm('本当に削除してよろしいですか？')) return;
    try {
      await deleteDoc(doc(db, 'trips', trip.id));
      setVisible(false);
      if (onDeleted) onDeleted(trip.id);
    } catch (error) {
      alert('削除に失敗しました');
    }
  };

  if (!visible) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-4 my-6 font-sans">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 relative rounded-full overflow-hidden flex-shrink-0">
            <img
              src={trip.travelerIcon || '/file.svg'}
              alt="旅行者アイコン"
              className="w-full h-full object-cover"
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

      {requests.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">みんなからのお願い</h3>
          <div className="space-y-4 max-h-48 overflow-y-auto">
            {requests.map(req => (
              <div key={req.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 relative rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={req.requesterIcon || '/file.svg'}
                    alt={`${req.requesterName}のアイコン`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">{req.requesterName}</p>
                  <p className="text-sm text-gray-600">{req.souvenirName}</p>
                  {req.comment && <p className="text-xs text-gray-500 mt-1">{req.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
            onClick={handleDelete}
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