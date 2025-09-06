'use client';

import SharedMenu from '../../components/SharedMenu';
import ContactSection from '../../components/ContactSection';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black animate-in fade-in duration-1000 relative">
      {/* Staggered Menu - Positioned absolutely to overlay content */}
      <SharedMenu />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Contact Section */}
        <div className="animate-in slide-in-from-bottom duration-700 delay-200">
          <ContactSection />
        </div>

        {/* Footer */}
        <div className="animate-in slide-in-from-bottom duration-700 delay-800">
        <Footer />
        </div>

      </main>
    </div>
  );
}
