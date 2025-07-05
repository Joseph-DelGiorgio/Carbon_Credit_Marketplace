import React, { useState } from 'react';
import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';

const ConnectWallet: React.FC = () => {
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const currentAccount = useCurrentAccount();

  return (
    <>
      {currentAccount ? (
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
        </button>
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