import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CarbonCredit {
  id: string;
  projectName: string;
  location: string;
  amount: number;
  pricePerTon: number;
  vintageYear: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

interface MarketplaceContextType {
  credits: CarbonCredit[];
  isLoading: boolean;
  fetchCredits: () => Promise<void>;
  purchaseCredit: (creditId: string, amount: number) => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};

interface MarketplaceProviderProps {
  children: ReactNode;
}

export const MarketplaceProvider: React.FC<MarketplaceProviderProps> = ({ children }) => {
  const [credits, setCredits] = useState<CarbonCredit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCredits = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual API call
      const mockCredits: CarbonCredit[] = [
        {
          id: '1',
          projectName: 'Amazon Reforestation Project',
          location: 'Brazil',
          amount: 5000,
          pricePerTon: 25,
          vintageYear: 2024,
          verificationStatus: 'verified'
        },
        {
          id: '2',
          projectName: 'Solar Energy Initiative',
          location: 'India',
          amount: 3000,
          pricePerTon: 30,
          vintageYear: 2024,
          verificationStatus: 'verified'
        }
      ];
      setCredits(mockCredits);
    } catch (error) {
      console.error('Fetch credits error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseCredit = async (creditId: string, amount: number) => {
    try {
      // TODO: Implement actual purchase logic
      console.log(`Purchasing ${amount} kg CO2 from credit ${creditId}`);
    } catch (error) {
      console.error('Purchase error:', error);
      throw error;
    }
  };

  const value = {
    credits,
    isLoading,
    fetchCredits,
    purchaseCredit
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}; 