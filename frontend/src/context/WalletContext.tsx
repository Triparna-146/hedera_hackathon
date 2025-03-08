import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WalletState } from '../types/wallet';

interface WalletContextType {
  wallet: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
  });

  const connectWallet = async () => {
    // Simulate wallet connection
    setWallet({
      isConnected: true,
      address: '0x' + Math.random().toString(36).substring(2, 15),
    });
  };

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: null,
    });
  };

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}