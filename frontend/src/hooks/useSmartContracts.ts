import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction } from '@mysten/sui/transactions';

// Deployed contract addresses
const PACKAGE_ID = '0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae';
const UPGRADE_CAP_ID = '0x5bc2be0185e8274511f8229bb5d05d3eab8aa3b13e6069e8fb1c8235d4cb8133';

// Module names
const CARBON_CREDIT_MODULE = 'carbon_credit';

// Types based on the smart contract
export interface CarbonProject {
  id: string;
  name: string;
  description: string;
  location: string;
  project_type: string;
  total_credits: number;
  available_credits: number;
  price_per_credit: number;
  developer: string;
  verified: boolean;
  created_at: number;
}

export interface CreditListing {
  id: string;
  project_id: string;
  seller: string;
  amount: number;
  price_per_credit: number;
  created_at: number;
}

export interface MarketplaceStats {
  total_projects: number;
  total_credits_available: number;
  total_volume_traded: number;
  average_price: number;
}

export const useSmartContracts = () => {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  // Initialize developer capability
  const initializeDeveloperCap = useMutation({
    mutationFn: async () => {
      if (!account?.address) throw new Error('Wallet not connected');
      const tx = new Transaction();
      tx.moveCall({
        package: PACKAGE_ID,
        module: CARBON_CREDIT_MODULE,
        function: 'initialize_developer_cap',
        arguments: []
      });
      return signAndExecute({ transaction: tx });
    }
  });

  // Initialize verifier capability
  const initializeVerifierCap = useMutation({
    mutationFn: async () => {
      if (!account?.address) throw new Error('Wallet not connected');
      const tx = new Transaction();
      tx.moveCall({
        package: PACKAGE_ID,
        module: CARBON_CREDIT_MODULE,
        function: 'initialize_verifier_cap',
        arguments: []
      });
      return signAndExecute({ transaction: tx });
    }
  });

  // Create carbon project
  const createProject = useMutation({
    mutationFn: async ({ 
      name, 
      description, 
      location, 
      projectType, 
      totalCredits, 
      pricePerCredit,
      coBenefits,
      sdgGoals,
      fundingGoal,
      metadata
    }: {
      name: string;
      description: string;
      location: string;
      projectType: string;
      totalCredits: number;
      pricePerCredit: number;
      coBenefits: string[];
      sdgGoals: number[];
      fundingGoal: number;
      metadata: string;
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::create_project`,
        arguments: [
          tx.pure.string(name),
          tx.pure.string(location),
          tx.pure.string(projectType),
          tx.pure.string(description),
          tx.pure.u64(totalCredits),
          tx.pure.u64(Math.floor(pricePerCredit * 1000000000)), // Convert SUI to MIST (9 decimal places)
          tx.pure.string(JSON.stringify(coBenefits)), // Convert array to JSON string
          tx.pure.string(JSON.stringify(sdgGoals)), // Convert array to JSON string
          tx.pure.u64(Math.floor(fundingGoal * 1000000000)), // Convert SUI to MIST
          tx.pure.string(metadata)
        ]
      });
      return signAndExecute({ transaction: tx });
    }
  });

  // Mint credits for a project
  const mintCredits = useMutation({
    mutationFn: async ({ 
      projectId, 
      co2Kg, 
      metadata 
    }: {
      projectId: string;
      co2Kg: number;
      metadata: string;
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      
      // Get the developer cap ID from the onchain config
      const developerCapId = '0x2680f9f98247dcab1f4214bff86ac50cd76f017240cb872dfcf85d5c8001817e';
      
      console.log('Minting credits with:', { projectId, co2Kg, metadata, developerCapId });
      
      // Use the same pattern as the working buy_credits function
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::mint_credits`,
        arguments: [
          tx.object(developerCapId), // ProjectDeveloperCap object
          tx.object(projectId), // Project object (mutable reference)
          tx.pure.u64(co2Kg),
          tx.pure.string(metadata || 'minted_via_frontend') // Use simple string, not JSON
        ]
      });
      
      console.log('Transaction created:', tx);
      
      try {
        const result = await signAndExecute({ transaction: tx });
        console.log('Mint credits result:', result);
        return result;
      } catch (error: any) {
        console.error('Mint credits transaction failed:', error);
        // Log more details about the error
        if (error?.message) {
          console.error('Error message:', error.message);
        }
        if (error?.code) {
          console.error('Error code:', error.code);
        }
        if (error?.data) {
          console.error('Error data:', error.data);
        }
        throw error;
      }
    },
    onError: (error) => {
      console.error('Mint credits error:', error);
      // Check if it's a permission error
      if (error.message?.includes('ENOT_PROJECT_DEVELOPER')) {
        throw new Error('You do not have permission to mint credits for this project. Only the project developer can mint credits.');
      }
      throw error;
    }
  });

  // Create listing for credits
  const createListing = useMutation({
    mutationFn: async ({ 
      creditId, 
      price
    }: {
      creditId: string;
      price: number; // Price in MIST (1 SUI = 1_000_000_000 MIST)
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::create_listing`,
        arguments: [
          tx.object(creditId), // CarbonCredit object
          tx.pure.u64(price)   // Price per credit in MIST
        ]
      });
      return signAndExecute({ transaction: tx });
    }
  });

  // Buy credits from a listing
  const buyCredits = useMutation({
    mutationFn: async ({ 
      listingId, 
      payment 
    }: {
      listingId: string;
      payment: number; // Amount in MIST (1 SUI = 1_000_000_000 MIST)
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      
      console.log('Executing buy_credits transaction:', { listingId, payment });
      
      // Use the Transaction class like in Flight Insurance v2
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::buy_credits`,
        arguments: [
          tx.object(listingId),
          tx.splitCoins(tx.gas, [payment]) // Split coins from gas for payment
        ]
      });
      
      try {
        const result = await signAndExecute({ transaction: tx });
        console.log('Buy credits transaction result:', result);
        return result;
      } catch (error: any) {
        console.error('Buy credits transaction failed:', error);
        // Log more details about the error
        if (error?.message) {
          console.error('Error message:', error.message);
        }
        if (error?.code) {
          console.error('Error code:', error.code);
        }
        if (error?.data) {
          console.error('Error data:', error.data);
        }
        throw error;
      }
    }
  });

  // Retire credits
  const retireCredit = useMutation({
    mutationFn: async ({ 
      creditId, 
      reason 
    }: {
      creditId: string;
      reason: string;
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::retire_credit`,
        arguments: [
          tx.object(creditId),
          tx.pure.string(reason)
        ]
      });
      return signAndExecute({ transaction: tx });
    }
  });

  // Fund project
  const fundProject = useMutation({
    mutationFn: async ({ 
      projectId, 
      amount 
    }: {
      projectId: string;
      amount: number; // Amount in MIST (1 SUI = 1_000_000_000 MIST)
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::fund_project`,
        arguments: [
          tx.object(projectId),
          tx.splitCoins(tx.gas, [amount]) // Split coins from gas for funding
        ]
      });
      return signAndExecute({ transaction: tx });
    }
  });

  // Query functions (mocked)
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<CarbonProject[]> => {
      // This would query the blockchain for projects
      // For now, return mock data
      return [
        {
          id: '1',
          name: 'Amazon Rainforest Conservation',
          description: 'Protecting 10,000 hectares of Amazon rainforest from deforestation',
          location: 'Brazil',
          project_type: 'Forest Conservation',
          total_credits: 100000,
          available_credits: 75000,
          price_per_credit: 15.50,
          developer: '0x123...abc',
          verified: true,
          created_at: Date.now() - 86400000
        },
        {
          id: '2',
          name: 'Solar Farm Development',
          description: 'Building a 50MW solar farm in rural India',
          location: 'India',
          project_type: 'Renewable Energy',
          total_credits: 50000,
          available_credits: 30000,
          price_per_credit: 12.75,
          developer: '0x456...def',
          verified: false,
          created_at: Date.now() - 172800000
        }
      ];
    }
  });

  const { data: listings, isLoading: listingsLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: async (): Promise<CreditListing[]> => {
      // This would query the blockchain for credit listings
      // For now, return mock data
      return [
        {
          id: '1',
          project_id: '1',
          seller: '0x123...abc',
          amount: 1000,
          price_per_credit: 16.00,
          created_at: Date.now() - 3600000
        },
        {
          id: '2',
          project_id: '2',
          seller: '0x456...def',
          amount: 500,
          price_per_credit: 13.00,
          created_at: Date.now() - 7200000
        }
      ];
    }
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: async (): Promise<MarketplaceStats> => {
      // This would query the blockchain for marketplace statistics
      // For now, return mock data
      return {
        total_projects: 2,
        total_credits_available: 105000,
        total_volume_traded: 2500000,
        average_price: 14.25
      };
    }
  });

  return {
    // Mutations
    initializeDeveloperCap,
    initializeVerifierCap,
    createProject,
    mintCredits,
    createListing,
    buyCredits,
    retireCredit,
    fundProject,
    
    // Queries
    projects,
    projectsLoading,
    listings,
    listingsLoading,
    stats,
    statsLoading,
    
    // Contract addresses
    PACKAGE_ID,
    UPGRADE_CAP_ID
  };
}; 