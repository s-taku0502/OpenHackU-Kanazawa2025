'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import TravelCard from '@/components/TravelCard';
import GiftRequestForm from '@/components/GiftRequestForm';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <TravelCard onOpenModal={handleOpenModal} key={1} />
        <TravelCard onOpenModal={handleOpenModal} key={2} />
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