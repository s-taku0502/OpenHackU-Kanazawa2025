"use client";

import { useState, useEffect, useCallback } from 'react';
import TravelCard from '@/components/TravelCard';
import GiftRequestForm from '@/components/GiftRequestForm';
import TripCreateForm from '@/components/TripCreateForm';
import SouvenirPhoto from '@/components/SouvenirPhoto';
import SouvenirAddForm from '@/components/SouvenirAddForm';
import { db } from '@/app/firebase'
import { FaCog } from 'react-icons/fa';
import { CiMail } from "react-icons/ci";
import { FaUserFriends } from "react-icons/fa";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [trips, setTrips] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [activeTab, setActiveTab] = useState('予定');
  const auth = getAuth();
  const router = useRouter();
  const [isHeaderLoading, setIsHeaderLoading] = useState(false);
  const [isSouvenirModalOpen, setIsSouvenirModalOpen] = useState(false);


  // 旅行データ取得ロジックを共通化
  const fetchTrips = useCallback(async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists() && userDocSnap.data().applying_groupId) {
        const groupId = userDocSnap.data().applying_groupId;
        const q = query(collection(db, "trips"), where("groupId", "==", groupId), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const tripsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const tripsWithTravelerInfo = await Promise.all(
          tripsData.map(async (trip) => {
            if (trip.travelerUid) {
              const travelerDocRef = doc(db, "users", trip.travelerUid);
              const travelerDocSnap = await getDoc(travelerDocRef);
              if (travelerDocSnap.exists()) {
                const travelerData = travelerDocSnap.data();
                return { 
                  ...trip, 
                  travelerName: travelerData.name,
                  travelerIcon: travelerData.personal_image || null
                };
              }
            }
            return { ...trip, travelerName: '不明なユーザー', travelerIcon: null };
          })
        );
        setTrips(tripsWithTravelerInfo);
      }
    } catch (error) {
      console.error("旅行データの取得に失敗しました:", error);
    }
  }, [user]);

  // 認証状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      if (!currentUser) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  // userが確定したらデータ取得
  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user, fetchTrips]);

  const handleOpenModal = (tripId) => {
    setSelectedTripId(tripId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTripId(null);
  };

  const handleOpenTripModal = () => {
    setIsTripModalOpen(true);
  };

  const handleCloseTripModal = () => {
    setIsTripModalOpen(false);
  };

  const handleOpenSouvenirModal = () => {
    setIsSouvenirModalOpen(true);
  };

  const handleCloseSouvenirModal = () => {
    setIsSouvenirModalOpen(false);
  };

  // 旅行作成後のリスト再取得も共通関数で
  const handleTripCreated = () => {
    fetchTrips();
  };

  const handleGoGroup = () => {
    setIsHeaderLoading(true);
    router.push('/group');
  };
  const handleGoContact = () => {
    setIsHeaderLoading(true);
    router.push('/contact');
  };
  const handleGoSetting = () => {
    setIsHeaderLoading(true);
    router.push('/setting');
  };

  // ページ遷移完了時にローディング解除
  useEffect(() => {
    const handleRouteChangeComplete = () => setIsHeaderLoading(false);
    // next/navigationのrouter.eventsは使えないため、windowのpopstateで最低限対応
    window.addEventListener('popstate', handleRouteChangeComplete);
    return () => {
      window.removeEventListener('popstate', handleRouteChangeComplete);
    };
  }, []);

  return (
    <div className="min-h-screen bg-orange-100 relative">
  <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 relative">
        <div className="w-10 h-10 relative">
          <Image
            src={'/file.svg'}
            alt="グループアイコン"
            fill
            className="rounded-full"
            sizes="35px"
            priority
          />
        </div>
        <div className="flex-1 flex justify-center">
          <nav className="flex space-x-4">
            {['予定', 'お土産'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex space-x-4">
          <button type="button" aria-label="グループ変更" onClick={handleGoGroup} disabled={isHeaderLoading}><FaUserFriends className="text-xl text-orange-500" /></button>
          <button type="button" aria-label="お問い合わせ" onClick={handleGoContact} disabled={isHeaderLoading}><CiMail className="text-xl text-orange-500" /></button>
          <button type="button" aria-label="設定" onClick={handleGoSetting} disabled={isHeaderLoading}><FaCog className="text-xl text-orange-500" /></button>
        </div>
        {isHeaderLoading && (
          <div className="absolute right-0 top-full mt-2 flex justify-end w-full z-50">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded shadow border border-orange-200 animate-pulse">
              <svg className="animate-spin h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span className="text-orange-500 text-sm">ページ遷移中...</span>
            </div>
          </div>
        )}
      </header>
      <main className="p-4">
        {activeTab === '予定' && (
          <div className="space-y-6">
            {trips.length > 0 ? (
              trips.map(trip => (
                <TravelCard key={trip.id} trip={trip} onOpenModal={() => handleOpenModal(trip.id)} userUid={user?.uid} />
              ))
            ) : (
              <p className="text-center mt-8 text-gray-500">登録されている旅行の予定はありません。</p>
            )}
          </div>
        )}
        {activeTab === 'お土産' && (
          <div className="space-y-6">
            <SouvenirPhoto userUid={user?.uid} />
          </div>
        )}
      </main>

      {activeTab === '予定' && (
        <div className="fixed bottom-6 right-6 z-10">
          <button
            onClick={handleOpenTripModal}
            className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          >
            <span>旅行予定を追加</span>
          </button>
        </div>
      )}

      {activeTab === 'お土産' && (
        <div className="fixed bottom-6 right-6 z-10">
          <button
            onClick={handleOpenSouvenirModal}
            className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          >
            <span>お土産の追加</span>
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={handleCloseModal}
          ></div>
          <div className="relative w-full h-auto max-w-lg bg-white rounded-t-3xl shadow-lg transform transition-transform duration-300 ease-out translate-y-0">
            <GiftRequestForm onCloseModal={handleCloseModal} tripId={selectedTripId} />
          </div>
        </div>
      )}

      {isTripModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={handleCloseTripModal}
          ></div>
          <div className="relative w-full h-auto max-w-lg bg-white rounded-t-3xl shadow-lg transform transition-transform duration-300 ease-out translate-y-0">
            <TripCreateForm
              onCloseModal={handleCloseTripModal}
              user={user}
              onTripCreated={handleTripCreated}
            />
          </div>
        </div>
      )}

      {isSouvenirModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={handleCloseSouvenirModal}
          ></div>
          <div className="relative w-full h-auto max-w-lg bg-white rounded-b-3xl shadow-lg transform transition-transform duration-300 ease-out translate-y-0">
            <SouvenirAddForm onCloseModal={handleCloseSouvenirModal} />
          </div>
        </div>
      )}
    </div>
  );
}