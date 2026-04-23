import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AnnouncementBanner from './AnnouncementBanner';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <AnnouncementBanner />
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
