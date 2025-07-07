import React from "react";

const DashboardPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
      {/* Wallet Info */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Wallet Overview</h2>
        <div className="bg-white rounded shadow p-4">Wallet address and SUI balance here</div>
      </section>
      {/* Owned Credits */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Owned Carbon Credits</h2>
        <div className="bg-white rounded shadow p-4">List of owned credits here</div>
      </section>
      {/* Transaction History */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Transaction History</h2>
        <div className="bg-white rounded shadow p-4">Transaction history here</div>
      </section>
      {/* Retirement Certificates */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Retirement Certificates</h2>
        <div className="bg-white rounded shadow p-4">Retired credits/certificates here</div>
      </section>
    </div>
  );
};

export default DashboardPage; 