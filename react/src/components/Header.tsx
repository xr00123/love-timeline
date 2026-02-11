import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const navItems = [
    { label: '首页', active: true },
    { label: '全屏背景', active: false },
    { label: '孩子杂类', active: false },
    { label: '关于我们', active: false },
  ];

  return (
    <header className="w-full py-6 px-12 flex items-center justify-between z-10 relative">
      <div className="flex items-center">
        {/* Logo */}
        <div className="text-3xl font-bold tracking-tight text-foreground mr-12">
          JOM
        </div>
      </div>

      {/* Navigation */}
      <nav className="absolute left-1/2 transform -translate-x-1/2">
        <ul className="flex items-center space-x-10">
          {navItems.map((item, index) => (
            <li key={index} className="relative group cursor-pointer">
              <span 
                className={`text-base font-medium transition-colors duration-200 ${
                  item.active ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'
                }`}
              >
                {item.label}
              </span>
              {item.active && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-[#4A4A4A] rounded-full"></div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center space-x-6">
        <button className="text-gray-600 hover:text-black transition-colors">
          <Search size={22} strokeWidth={2} />
        </button>
        <button className="text-gray-600 hover:text-black transition-colors relative">
           <RotateCcw size={20} strokeWidth={2} />
           <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></span>
        </button>
        <Button 
          className="bg-jom-brown hover:bg-jom-brown-hover text-white rounded-full px-6 py-5 text-base font-medium transition-transform active:scale-95 shadow-custom"
        >
          换壁纸
        </Button>
      </div>
    </header>
  );
};

export default Header;