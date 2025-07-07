import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui/client';

interface CarbonCredit {
  id: string;
  projectId: string;
  amount: number;
  metadata: string;
  owner: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  totalCredits: number;
  creditsIssued: number;
  owner: string;
}

interface Transaction {
  digest: string;
  timestamp: number;
  type: 'mint' | 'buy' | 'sell' | 'transfer';
  amount: number;
  projectName?: string;
}

interface PortfolioData {
  carbonCredits: CarbonCredit[];
  projects: Project[];
  transactions: Transaction[];
  totalCreditsOwned: number;
  totalProjectsOwned: number;
}

export const usePortfolio = () => {
  const account = useCurrentAccount();
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    carbonCredits: [],
    projects: [],
    transactions: [],
    totalCreditsOwned: 0,
    totalProjectsOwned: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suiClient = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' });

  const fetchPortfolioData = async () => {
    if (!account?.address) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [credits, projects, transactions] = await Promise.all([
        fetchCarbonCredits(),
        fetchProjects(),
        fetchTransactionHistory()
      ]);

      const totalCreditsOwned = credits.reduce((sum, credit) => sum + credit.amount, 0);
      const totalProjectsOwned = projects.length;

      setPortfolioData({
        carbonCredits: credits,
        projects,
        transactions,
        totalCreditsOwned,
        totalProjectsOwned
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data');
      console.error('Error fetching portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCarbonCredits = async (): Promise<CarbonCredit[]> => {
    if (!account?.address) return [];

    try {
      const response = await suiClient.getOwnedObjects({
        owner: account.address,
        filter: {
          Package: '0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae'
        },
        options: {
          showContent: true,
          showDisplay: true
        }
      });

      const credits: CarbonCredit[] = [];
      
      for (const obj of response.data) {
        if (obj.data?.type?.includes('CarbonCredit')) {
          const content = obj.data.content as any;
          if (content) {
            credits.push({
              id: obj.data.objectId,
              projectId: content.fields?.project_id || 'Unknown',
              amount: content.fields?.amount || 0,
              metadata: content.fields?.metadata || '',
              owner: account.address!
            });
          }
        }
      }

      return credits;
    } catch (error) {
      console.error('Error fetching carbon credits:', error);
      return [];
    }
  };

  const fetchProjects = async (): Promise<Project[]> => {
    if (!account?.address) return [];

    try {
      const response = await suiClient.getOwnedObjects({
        owner: account.address,
        filter: {
          Package: '0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae'
        },
        options: {
          showContent: true,
          showDisplay: true
        }
      });

      const userProjects: Project[] = [];
      
      for (const obj of response.data) {
        if (obj.data?.type?.includes('Project')) {
          const content = obj.data.content as any;
          if (content) {
            userProjects.push({
              id: obj.data.objectId,
              name: content.fields?.name || 'Unnamed Project',
              description: content.fields?.description || 'No description',
              totalCredits: content.fields?.total_credits || 0,
              creditsIssued: content.fields?.credits_issued || 0,
              owner: account.address!
            });
          }
        }
      }

      return userProjects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  };

  const fetchTransactionHistory = async (): Promise<Transaction[]> => {
    if (!account?.address) return [];

    try {
      const response = await suiClient.queryTransactionBlocks({
        filter: {
          FromAddress: account.address
        },
        options: {
          showEffects: true,
          showInput: true
        },
        limit: 20
      });

      const userTransactions: Transaction[] = [];
      
      for (const tx of response.data) {
        if (tx.transaction?.data?.sender === account.address) {
          const effects = tx.effects;
          if (effects) {
            const created = effects.created || [];
            const mutated = effects.mutated || [];
            
            for (const obj of [...created, ...mutated]) {
              if (obj.reference.objectId.includes('CarbonCredit') || 
                  obj.reference.objectId.includes('Project')) {
                userTransactions.push({
                  digest: tx.digest,
                  timestamp: typeof tx.timestampMs === 'number' ? tx.timestampMs : Date.now(),
                  type: 'mint',
                  amount: 1,
                  projectName: 'Carbon Credit Project'
                });
                break;
              }
            }
          }
        }
      }

      return userTransactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  };

  useEffect(() => {
    if (account?.address) {
      fetchPortfolioData();
    } else {
      // Reset data when wallet disconnects
      setPortfolioData({
        carbonCredits: [],
        projects: [],
        transactions: [],
        totalCreditsOwned: 0,
        totalProjectsOwned: 0
      });
    }
  }, [account?.address]);

  return {
    ...portfolioData,
    loading,
    error,
    refetch: fetchPortfolioData
  };
}; 