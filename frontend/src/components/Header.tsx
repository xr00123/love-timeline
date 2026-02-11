import React from 'react';

export type TabKey = 'home' | 'timeline' | 'record' | 'search' | 'settings';

interface HeaderProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const navItems: { label: string; value: TabKey }[] = [
    { label: '首页', value: 'home' },
    { label: '时间线', value: 'timeline' },
    { label: '找回记忆', value: 'search' },
    { label: '设置', value: 'settings' },
  ];

  return (
    <header className="w-full py-6 px-12 flex items-center justify-between z-10 relative">
      <div className="flex items-center">
        {/* Logo */}
        <div 
          className="text-3xl font-bold tracking-tight text-foreground mr-12 cursor-pointer" 
          style={{ fontFamily: 'Futura, sans-serif' }}
          onClick={() => onTabChange('home')}
        >
          LOVE-TIME
        </div>
      </div>

      {/* Navigation */}
      <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
        <ul className="flex items-center space-x-10">
          {navItems.map((item) => (
            <li 
              key={item.value} 
              className="relative group cursor-pointer"
              onClick={() => onTabChange(item.value)}
            >
              <span 
                className={`text-base font-medium transition-colors duration-200 ${
                  activeTab === item.value ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'
                }`}
              >
                {item.label}
              </span>
              {activeTab === item.value && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-[#4A4A4A] rounded-full"></div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
      </div>
    </header>
  );
};

export default Header;
