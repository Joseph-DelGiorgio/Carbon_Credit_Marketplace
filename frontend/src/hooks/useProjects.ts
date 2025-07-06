import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import type { SuiObjectResponse } from '@mysten/sui/client';

// Deployed contract addresses
const PACKAGE_ID = '0x56ed4d2202dfa0af48f7fd226f7212a043dad81cde369eb208cff339d5689d9e';

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
  co_benefits: string[];
  sdg_goals: number[];
  funding_goal: number;
  funding_raised: number;
  metadata: string;
}

export interface CreditListing {
  id: string;
  credit_id: string;
  seller: string;
  price: number;
  quantity: number;
  active: boolean;
  created_at: number;
}

export const useProjects = () => {
  const client = useSuiClient();
  const account = useCurrentAccount();

  // Fetch all projects
  const { data: allProjects, isLoading: isLoadingProjects, error: projectsError } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: async (): Promise<CarbonProject[]> => {
      try {
        // For now, we'll use a simpler approach to get all projects
        // In a real implementation, you might need to track project IDs or use events
        // For demonstration, we'll return an empty array and let users create projects
        console.log('Fetching all projects...');
        return [];
      } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch user's projects
  const { data: userProjects, isLoading: isLoadingUserProjects, error: userProjectsError } = useQuery({
    queryKey: ['projects', 'user', account?.address],
    queryFn: async (): Promise<CarbonProject[]> => {
      if (!account?.address) return [];

      try {
        // For now, we'll use a simpler approach to get user projects
        // In a real implementation, you would query owned objects
        console.log('Fetching user projects for:', account.address);
        return [];
      } catch (error) {
        console.error('Error fetching user projects:', error);
        return [];
      }
    },
    enabled: !!account?.address,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch all credit listings
  const { data: allListings, isLoading: isLoadingListings, error: listingsError } = useQuery({
    queryKey: ['listings', 'all'],
    queryFn: async (): Promise<CreditListing[]> => {
      try {
        // For now, we'll use a simpler approach to get listings
        // In a real implementation, you would query CreditListing objects
        console.log('Fetching all listings...');
        return [];
      } catch (error) {
        console.error('Error fetching listings:', error);
        return [];
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    allProjects: allProjects || [],
    userProjects: userProjects || [],
    allListings: allListings || [],
    isLoadingProjects,
    isLoadingUserProjects,
    isLoadingListings,
    projectsError,
    userProjectsError,
    listingsError,
  };
}; 