import Header from '@/components/Header';
import TravelCard from '@/components/TravelCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>
        <TravelCard />
        <TravelCard />
      </main>
    </div>
  );
}