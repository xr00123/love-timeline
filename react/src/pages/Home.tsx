import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4 md:p-8 font-sans">
        {/* Main Interface Container - Fixed Width 1440px as requested */}
        <div className="w-full max-w-[1440px] bg-gradient-to-br from-warm-bg-start via-warm-bg-middle to-warm-bg-end shadow-2xl rounded-[30px] overflow-hidden relative flex flex-col min-h-[850px]">
            
            {/* Top decorative gradient overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 pointer-events-none z-0"></div>
            
            {/* Header */}
            <Header />
            
            {/* Main Content */}
            <main className="flex-1 flex flex-col relative z-10">
                <Hero />
            </main>
        </div>
    </div>
  );
};

export default Home;