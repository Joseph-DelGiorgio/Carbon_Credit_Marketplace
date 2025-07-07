import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider, createNetworkConfig } from "@mysten/dapp-kit";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MarketplacePage from "./pages/MarketplacePage";
import DashboardPage from "./pages/DashboardPage";
import "./styles/index.css";

const queryClient = new QueryClient();
const { networkConfig } = createNetworkConfig({
  testnet: {
    url: "https://fullnode.testnet.sui.io:443",
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Navbar />
            <Routes>
              <Route path="/" element={<MarketplacePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects" element={<MarketplacePage />} />
              <Route path="/about" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold mb-4">About Carbon Credit Marketplace</h1><p>This is a decentralized marketplace for trading verified carbon credits on the Sui blockchain.</p></div>} />
            </Routes>
          </Router>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
