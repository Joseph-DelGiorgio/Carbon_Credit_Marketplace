import React from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

const WalletStatus: React.FC = () => {
  const account = useCurrentAccount();

  if (!account?.address) {
    return null;
  }

  const shortAddress = `${account.address.slice(0, 6)}...${account.address.slice(-4)}`;

  return (
    <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-sm font-medium text-gray-700">{shortAddress}</span>
    </div>
  );
};

export default WalletStatus; 