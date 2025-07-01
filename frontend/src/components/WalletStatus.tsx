import React from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

export const WalletStatus: React.FC = () => {
  const currentAccount = useCurrentAccount();

  if (!currentAccount) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
          <span className="text-yellow-800 text-sm">Wallet not connected</span>
        </div>
        <p className="text-yellow-700 text-xs mt-1">
          Connect your wallet to interact with the marketplace
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          <span className="text-green-800 text-sm font-medium">Wallet Connected</span>
        </div>
        <span className="text-green-700 text-xs">
          {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
        </span>
      </div>
      <p className="text-green-700 text-xs mt-1">
        Ready to interact with carbon credit projects
      </p>
    </div>
  );
}; 