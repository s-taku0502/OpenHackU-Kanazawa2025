'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TravelCard from '@/components/TravelCard';
import GiftRequestForm from '@/components/GiftRequestForm';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trips, setTrips] = useState([]);
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>
        {trips.length > 0 ? (
          trips.map(trip => (
            <TravelCard key={trip.id} trip={trip} onOpenModal={handleOpenModal} />
          ))
        ) : (
          <p className="text-center mt-8 text-gray-500">登録されている旅行の予定はありません。</p>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={handleCloseModal}
          ></div>
          <div className="relative w-full h-auto max-w-lg bg-white rounded-t-3xl shadow-lg transform transition-transform duration-300 ease-out translate-y-0">
            <GiftRequestForm onCloseModal={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
}
