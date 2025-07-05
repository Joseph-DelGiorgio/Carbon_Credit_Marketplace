import React, { useState } from 'react';
import { ConnectModal, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';

const ConnectWallet: React.FC = () => {
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const currentAccount = useCurrentAccount();
  const { mutateAsync: disconnect } = useDisconnectWallet();

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return (
    <>
      {currentAccount ? (
        <div className="flex items-center space-x-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
          </button>
          <button
            onClick={handleDisconnect}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            title="Disconnect Wallet"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          onClick={() => setConnectModalOpen(true)}
        >
          Connect Wallet
        </button>
      )}
      
      <ConnectModal
        trigger={<></>}
        open={connectModalOpen}
        onOpenChange={(open) => setConnectModalOpen(open)}
      />
    </>
  );
};

export default ConnectWallet; 