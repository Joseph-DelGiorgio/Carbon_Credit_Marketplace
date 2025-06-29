import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connect = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual wallet connection
      const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
      setAddress(mockAddress);
      setIsConnected(true);
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
  };

  const value = {
    isConnected,
    address,
    connect,
    disconnect,
    isLoading
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 