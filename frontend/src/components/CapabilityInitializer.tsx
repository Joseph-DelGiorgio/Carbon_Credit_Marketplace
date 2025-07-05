import React, { useState } from 'react';
import { useSmartContracts } from '../hooks/useSmartContracts';
import { useCurrentAccount } from '@mysten/dapp-kit';

const CapabilityInitializer: React.FC = () => {
  const account = useCurrentAccount();
  const { initializeMarketplace } = useSmartContracts();
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleInitialize = async () => {
    if (!account?.address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsInitializing(true);
    try {
      await initializeMarketplace.mutateAsync();
      setIsInitialized(true);
      alert('Marketplace initialized successfully!');
    } catch (error) {
      console.error('Failed to initialize marketplace:', error);
      alert('Failed to initialize marketplace. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  if (!account?.address) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      {!isInitialized ? (
        <button
          onClick={handleInitialize}
          disabled={isInitializing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isInitializing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Initializing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Initialize Marketplace
            </>
          )}
        </button>
      ) : (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Marketplace Ready
        </div>
      )}
    </div>
  );
};

export default CapabilityInitializer; 