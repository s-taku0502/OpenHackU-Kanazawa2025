'use client';

import { useState, useEffect } from 'react';
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
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
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
  const [isSouvenirModalOpen, setIsSouvenirModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().applying_groupId) {
          const groupId = userDocSnap.data().applying_groupId;
          const q = query(collection(db, "trips"), where("groupId", "==", groupId));
          const querySnapshot = await getDocs(q);
          const tripsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const tripsWithTravelerNames = await Promise.all(
            tripsData.map(async (trip) => {
              if (trip.travelerUid) {
                const travelerDocRef = doc(db, "users", trip.travelerUid);
                const travelerDocSnap = await getDoc(travelerDocRef);
                if (travelerDocSnap.exists()) {
                  return { ...trip, travelerName: travelerDocSnap.data().name };
                }
              }
              return { ...trip, travelerName: '不明なユーザー' };
            })
          );
          setTrips(tripsWithTravelerNames);
        }
      } else {
        router.push("/signin");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

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

  const handleTripCreated = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists() && userDocSnap.data().applying_groupId) {
      const groupId = userDocSnap.data().applying_groupId;
      const q = query(collection(db, "trips"), where("groupId", "==", groupId));
      const querySnapshot = await getDocs(q);
      const tripsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const tripsWithTravelerNames = await Promise.all(
        tripsData.map(async (trip) => {
          if (trip.travelerUid) {
            const travelerDocRef = doc(db, "users", trip.travelerUid);
            const travelerDocSnap = await getDoc(travelerDocRef);
            if (travelerDocSnap.exists()) {
              return { ...trip, travelerName: travelerDocSnap.data().name };
            }
          }
          return { ...trip, travelerName: '不明なユーザー' };
        })
      );
      setTrips(tripsWithTravelerNames);
    }
  };

  return (
    <div className="min-h-screen bg-orange-100 relative">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
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
          <button type="button" aria-label="グループ変更"><FaUserFriends className="text-xl text-orange-500" /></button>
          <button type="button" aria-label="お問い合わせ"><CiMail className="text-xl text-orange-500" /></button>
          <button type="button" aria-label="設定"><FaCog className="text-xl text-orange-500" /></button>
        </div>
      </header>
      <main className="p-4">
        {activeTab === '予定' && (
          <div className="space-y-6">
            {trips.length > 0 ? (
              trips.map(trip => (
                <TravelCard key={trip.id} trip={trip} onOpenModal={() => handleOpenModal(trip.id)} />
              ))
            ) : (
              <p className="text-center mt-8 text-gray-500">登録されている旅行の予定はありません。</p>
            )}
          </div>
        )}
        {activeTab === 'お土産' && (
          <div className="space-y-6">
            <SouvenirPhoto />
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