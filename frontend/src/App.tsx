import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getFullnodeUrl } from '@mysten/sui/client';
import Navbar from './components/Navbar';
import MarketplacePage from './pages/MarketplacePage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SuiClientProvider networks={{
      mainnet: { url: getFullnodeUrl('mainnet') },
      testnet: { url: getFullnodeUrl('testnet') },
      devnet: { url: getFullnodeUrl('devnet') },
      localnet: { url: getFullnodeUrl('localnet') },
    }} defaultNetwork="testnet">
      <WalletProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <Routes>
              <Route path="/" element={<MarketplacePage />} />
            </Routes>
          </div>
        </Router>
      </WalletProvider>
    </SuiClientProvider>
  </QueryClientProvider>
);

export default App;
