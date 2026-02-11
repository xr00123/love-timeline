import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Star } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative flex flex-1 w-full h-full min-h-[700px] px-8 pl-16 grid grid-cols-12 gap-4 items-center">
      {/* Decorative background elements can go here if using absolute positioning */}
      
      {/* Left Content Area */}
      <div className="col-span-5 flex flex-col justify-center z-10 pl-8">
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-[#C4A484] uppercase tracking-[0.2em] text-sm font-bold ml-1">
              Wordding
            </p>
            <h3 className="text-[#D3C0B0] font-serif text-3xl tracking-wide opacity-60">
              BUBUZELESTATION
            </h3>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-serif font-medium text-[#2C2C2C] tracking-tight leading-tight">
            爱情时间线
          </h1>
          
          <div className="pt-8 relative inline-block">
             <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 opacity-40">
                <div className="w-1 h-8 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 border border-gray-400 rounded-full"></div>
             </div>
             
             <Button 
              className="bg-jom-brown hover:bg-jom-brown-hover text-white rounded-full h-14 px-10 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              立即背念
            </Button>
            
            {/* Decorative particles near button */}
            <div className="absolute -bottom-10 left-10 flex space-x-2">
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <div className="w-3 h-3 bg-[#A08870] rounded-full"></div>
                <div className="w-3 h-3 bg-[#E0D0C0] rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Subtle decorative stars */}
        <div className="absolute left-[20%] bottom-[20%] text-white/80 opacity-50">
          <Sparkles size={24} className="text-[#F0E0D0]" />
        </div>
      </div>

      {/* Right Image Area */}
      <div className="col-span-7 h-full relative flex items-end justify-center">
        {/* Abstract Background Blurs */}
        <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[30%] w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        
        {/* Character Image */}
        <div className="relative z-10 mt-10 transform translate-x-10 h-[90%] w-full flex items-end justify-center">
          <img 
            src="https://images.unsplash.com/photo-1596245195341-b33a7f275fdb?q=80&w=1200&auto=format&fit=crop" 
            alt="Young couple back to back" 
            className="object-contain max-h-[700px] w-auto drop-shadow-2xl"
            style={{ maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)' }}
          />
          
          {/* Floating UI Elements */}
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-20">
             <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-jom-brown cursor-pointer hover:scale-110 transition-transform">
                <Sparkles size={18} />
             </div>
             <div className="w-3 h-3 bg-white/50 rounded-full mx-auto"></div>
             <div className="w-3 h-3 bg-white/50 rounded-full mx-auto"></div>
          </div>
           
           <div className="absolute top-1/3 right-1/4 text-white opacity-80 animate-pulse">
              <Star fill="white" size={24} />
           </div>
        </div>
        
        {/* Page Number */}
        <div className="absolute bottom-10 right-10 text-gray-400 font-serif tracking-widest text-sm z-20">
            222 // 29
        </div>
      </div>
    </div>
  );
};

export default Hero;