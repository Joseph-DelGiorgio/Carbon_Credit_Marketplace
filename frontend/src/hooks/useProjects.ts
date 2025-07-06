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

export interface CarbonCredit {
  id: string;
  project_id: string;
  project_name: string;
  co2_kg: number;
  verification_hash: string;
  dMRV_data: string;
  retired: boolean;
  retirement_certificate: string;
  created_at: number;
  metadata: string;
}

export interface ProjectFilters {
  project_type?: string;
  location?: string;
  verified?: boolean;
  min_price?: number;
  max_price?: number;
  min_credits?: number;
  max_credits?: number;
}

export const useProjects = (filters?: ProjectFilters) => {
  const client = useSuiClient();
  const account = useCurrentAccount();

  // Fetch all projects from blockchain
  const { data: allProjects, isLoading: isLoadingProjects, error: projectsError } = useQuery({
    queryKey: ['projects', 'all', filters],
    queryFn: async (): Promise<CarbonProject[]> => {
      try {
        console.log('Fetching all projects from blockchain...');
        
        // For now, return mock data since RPC calls are not working properly
        // In a real implementation, you would query the blockchain
        console.log('Returning mock project data for testing...');
        const mockProjects: CarbonProject[] = [
          {
            id: '1',
            name: 'Amazon Rainforest Conservation',
            description: 'Protecting 10,000 hectares of primary rainforest in the Brazilian Amazon through sustainable land management and community engagement.',
            location: 'Brazil',
            project_type: 'reforestation',
            total_credits: 50000,
            available_credits: 25000,
            price_per_credit: 25.50,
            developer: '0x1234...5678',
            verified: true,
            created_at: Date.now() - 86400000 * 30,
            co_benefits: ['Biodiversity protection', 'Community development'],
            sdg_goals: [13, 15],
            funding_goal: 1000000,
            funding_raised: 750000,
            metadata: '{"image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"}'
          },
          {
            id: '2',
            name: 'Solar Farm Development',
            description: 'Large-scale solar energy project providing clean electricity to 50,000 households while reducing carbon emissions.',
            location: 'India',
            project_type: 'renewable_energy',
            total_credits: 75000,
            available_credits: 40000,
            price_per_credit: 18.75,
            developer: '0x8765...4321',
            verified: false,
            created_at: Date.now() - 86400000 * 15,
            co_benefits: ['Energy access', 'Job creation'],
            sdg_goals: [7, 8],
            funding_goal: 2000000,
            funding_raised: 1200000,
            metadata: '{"image": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop"}'
          }
        ];

        const projects = mockProjects.filter(project => {
          if (!filters) return true;
          
          if (filters.project_type && project.project_type !== filters.project_type) return false;
          if (filters.location && !project.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
          if (filters.verified !== undefined && project.verified !== filters.verified) return false;
          if (filters.min_price && project.price_per_credit < filters.min_price) return false;
          if (filters.max_price && project.price_per_credit > filters.max_price) return false;
          if (filters.min_credits && project.available_credits < filters.min_credits) return false;
          if (filters.max_credits && project.available_credits > filters.max_credits) return false;
          
          return true;
        });

        console.log(`Found ${projects.length} projects`);
        return projects;
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
        console.log('Fetching user projects for:', account.address);
        
        // Query for owned Project objects
        const ownedObjects = await client.getOwnedObjects({
          owner: account.address,
          options: {
            showContent: true,
            showDisplay: true,
          }
        });

        const userProjects: CarbonProject[] = [];

        for (const obj of ownedObjects.data) {
          if (obj.data?.content && 'fields' in obj.data.content) {
            const fields = obj.data.content.fields as any;
            
            // Check if this is a Project object
            if (obj.data.content.type === `${PACKAGE_ID}::carbon_credit::Project`) {
              const project: CarbonProject = {
                id: obj.data.objectId,
                name: fields.name || '',
                description: fields.description || '',
                location: fields.location || '',
                project_type: fields.project_type || '',
                total_credits: Number(fields.total_credits) || 0,
                available_credits: Number(fields.total_credits) - Number(fields.credits_issued) || 0,
                price_per_credit: Number(fields.price_per_credit) / 1000000000 || 0,
                developer: fields.developer || '',
                verified: Number(fields.verification_status) === 1,
                created_at: Number(fields.created_at) || 0,
                co_benefits: fields.co_benefits || [],
                sdg_goals: fields.sdg_goals || [],
                funding_goal: Number(fields.funding_goal) / 1000000000 || 0,
                funding_raised: Number(fields.funding_raised) / 1000000000 || 0,
                metadata: fields.metadata || ''
              };
              userProjects.push(project);
            }
          }
        }

        console.log(`Found ${userProjects.length} user projects`);
        return userProjects;
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
        console.log('Fetching all credit listings...');
        
        // For now, return mock data since RPC calls are not working properly
        console.log('Returning mock listing data for testing...');
        const mockListings: CreditListing[] = [
          {
            id: '1',
            credit_id: 'credit_1',
            seller: '0x1234...5678',
            price: 25.50,
            quantity: 1000,
            active: true,
            created_at: Date.now() - 86400000 * 5
          },
          {
            id: '2',
            credit_id: 'credit_2',
            seller: '0x8765...4321',
            price: 18.75,
            quantity: 500,
            active: true,
            created_at: Date.now() - 86400000 * 2
          }
        ];

        const listings = mockListings.filter(listing => listing.active);

        console.log(`Found ${listings.length} active listings`);
        return listings;
      } catch (error) {
        console.error('Error fetching listings:', error);
        return [];
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch carbon credits
  const { data: carbonCredits, isLoading: isLoadingCredits, error: creditsError } = useQuery({
    queryKey: ['credits', 'all'],
    queryFn: async (): Promise<CarbonCredit[]> => {
      try {
        console.log('Fetching all carbon credits...');
        
        // For now, return mock data since RPC calls are not working properly
        console.log('Returning mock credit data for testing...');
        const mockCredits: CarbonCredit[] = [
          {
            id: 'credit_1',
            project_id: '1',
            project_name: 'Amazon Rainforest Conservation',
            co2_kg: 1000,
            verification_hash: 'hash_123',
            dMRV_data: '{"sensor_data": "verified"}',
            retired: false,
            retirement_certificate: '',
            created_at: Date.now() - 86400000 * 5,
            metadata: '{"verification_date": "2024-01-15"}'
          },
          {
            id: 'credit_2',
            project_id: '2',
            project_name: 'Solar Farm Development',
            co2_kg: 500,
            verification_hash: 'hash_456',
            dMRV_data: '{"satellite_data": "verified"}',
            retired: false,
            retirement_certificate: '',
            created_at: Date.now() - 86400000 * 2,
            metadata: '{"verification_date": "2024-01-20"}'
          }
        ];

        const credits = mockCredits.filter(credit => !credit.retired);

        console.log(`Found ${credits.length} active credits`);
        return credits;
      } catch (error) {
        console.error('Error fetching credits:', error);
        return [];
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    allProjects: allProjects || [],
    userProjects: userProjects || [],
    allListings: allListings || [],
    carbonCredits: carbonCredits || [],
    isLoadingProjects,
    isLoadingUserProjects,
    isLoadingListings,
    isLoadingCredits,
    projectsError,
    userProjectsError,
    listingsError,
    creditsError,
  };
}; 