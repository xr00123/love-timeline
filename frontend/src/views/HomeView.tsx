import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HomeView: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center justify-between px-12 md:px-24 pt-10 pb-20 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-gray-300"></div>
      <div className="absolute top-20 left-14 w-2 h-2 rounded-full bg-[#9C6C53]"></div>
      <div className="absolute top-20 left-18 w-2 h-2 rounded-full bg-gray-300"></div>
      
      {/* Left Content */}
      <div className="w-full md:w-5/12 z-10 flex flex-col items-start text-left space-y-6">
        <div className="space-y-1">
          <p className="text-sm tracking-[0.2em] text-[#C4A484] uppercase font-medium">WORODING</p>
          <p className="text-sm tracking-[0.2em] text-gray-400 uppercase font-medium">RURUZEL STATION</p>
        </div>
        
        <div className="relative">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-800 tracking-tight font-serif leading-tight">
            爱情时间线
          </h1>
          {/* Decorative line */}
          <div className="absolute -left-8 top-2 h-16 w-0.5 bg-gray-300 hidden md:block"></div>
          <div className="absolute -left-8 bottom-0 w-2 h-2 rounded-full border border-gray-400 hidden md:block"></div>
        </div>
        
        <div className="pt-4">
          <Button 
            className="bg-[#8D6E63] hover:bg-[#795548] text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            立即背念
          </Button>
        </div>

        {/* Bottom indicators */}
        <div className="flex gap-2 mt-12 pt-12">
           <div className="w-2 h-2 rounded-full bg-gray-600"></div>
           <div className="w-2 h-2 rounded-full bg-[#9C6C53]"></div>
           <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        </div>
      </div>

      {/* Right Content - Hero Image */}
      <div className="w-full md:w-6/12 relative h-[500px] md:h-[600px] mt-10 md:mt-0">
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
          {/* Placeholder for Couple Image - Using a gradient placeholder since we don't have the asset */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#fdfbf7] to-[#e6e9f0] flex items-center justify-center">
             <div className="text-center p-10">
               <div className="w-48 h-48 mx-auto bg-gray-200 rounded-full mb-4 flex items-center justify-center text-gray-400">
                  <span className="text-xs">Couple Image</span>
               </div>
               <p className="text-gray-400 italic">"The best thing to hold onto in life is each other."</p>
             </div>
          </div>
          
          {/* Sparkles/Stars */}
          <Sparkles className="absolute top-10 right-10 text-white w-8 h-8 opacity-80" />
          <Sparkles className="absolute bottom-20 left-10 text-white w-6 h-6 opacity-60" />
          
          {/* Right side slider/controls */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
            <div className="w-8 h-1.5 bg-white rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
          </div>

          {/* Date/Number at bottom right */}
          <div className="absolute bottom-8 right-8 text-white/80 font-mono text-lg tracking-widest">
            222//29
          </div>
        </div>
      </div>
    </div>
  );
};
