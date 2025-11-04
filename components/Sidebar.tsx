
import React from 'react';
import type { View } from '../types';
import { ExplorerIcon, PlayIcon, SecretIcon, MarketplaceIcon, GithubIcon } from '../constants';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    title={label}
    className={`w-full flex justify-center items-center py-4 px-2 transition-colors duration-200 ${
      isActive ? 'text-white border-l-2 border-white' : 'text-gray-400 hover:text-white'
    }`}
  >
    {icon}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="w-16 bg-gray-900 flex flex-col items-center justify-between py-4">
      <div>
        <div className="h-8 w-8 text-white mb-8">{GithubIcon}</div>
        <NavItem
          label="Explorer"
          icon={ExplorerIcon}
          isActive={activeView === 'explorer'}
          onClick={() => setActiveView('explorer')}
        />
        <NavItem
          label="Runs"
          icon={PlayIcon}
          isActive={activeView === 'runs'}
          onClick={() => setActiveView('runs')}
        />
        <NavItem
          label="Secrets"
          icon={SecretIcon}
          isActive={activeView === 'secrets'}
          onClick={() => setActiveView('secrets')}
        />
        <NavItem
          label="Marketplace"
          icon={MarketplaceIcon}
          isActive={activeView === 'marketplace'}
          onClick={() => setActiveView('marketplace')}
        />
      </div>
    </nav>
  );
};
