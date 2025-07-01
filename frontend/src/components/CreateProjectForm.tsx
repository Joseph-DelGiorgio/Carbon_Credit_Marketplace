import React, { useState } from 'react';
import { useSmartContracts } from '../hooks/useSmartContracts';
import { useCapabilities } from '../hooks/useCapabilities';

export const CreateProjectForm: React.FC = () => {
  const { createProject, loading, error } = useSmartContracts();
  const { capabilities } = useCapabilities();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    projectType: 'Afforestation',
    description: '',
    totalCredits: 1000,
    pricePerCredit: 10,
    fundingGoal: 10000,
    metadata: '',
  });
  const [coBenefits, setCoBenefits] = useState<string[]>([]);
  const [sdgGoals, setSdgGoals] = useState<number[]>([]);

  const coBenefitsOptions = [
    'Biodiversity', 'Community', 'Soil Health', 'Women Empowerment',
    'Coastal Protection', 'Fisheries', 'Water Quality', 'Air Quality'
  ];

  const sdgGoalsOptions = [
    { value: 1, label: 'No Poverty' },
    { value: 2, label: 'Zero Hunger' },
    { value: 3, label: 'Good Health' },
    { value: 4, label: 'Quality Education' },
    { value: 5, label: 'Gender Equality' },
    { value: 6, label: 'Clean Water' },
    { value: 7, label: 'Affordable Energy' },
    { value: 8, label: 'Decent Work' },
    { value: 13, label: 'Climate Action' },
    { value: 15, label: 'Life on Land' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!capabilities.hasDeveloperCap) {
      alert('You need to initialize your developer capability first!');
      return;
    }

    try {
      await createProject({
        ...formData,
        coBenefits,
        sdgGoals,
      });
      
      // Reset form
      setFormData({
        name: '',
        location: '',
        projectType: 'Afforestation',
        description: '',
        totalCredits: 1000,
        pricePerCredit: 10,
        fundingGoal: 10000,
        metadata: '',
      });
      setCoBenefits([]);
      setSdgGoals([]);
      
      console.log('Project created successfully!');
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const toggleCoBenefit = (benefit: string) => {
    setCoBenefits(prev => 
      prev.includes(benefit) 
        ? prev.filter(b => b !== benefit)
        : [...prev, benefit]
    );
  };

  const toggleSdgGoal = (goal: number) => {
    setSdgGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  if (!capabilities.hasDeveloperCap) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          You need to initialize your developer capability to create projects.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Create New Project</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Project Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Project Type</label>
          <select
            value={formData.projectType}
            onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
            className="w-full border rounded px-3 py-2"
          >
            <option>Afforestation</option>
            <option>Reforestation</option>
            <option>Biochar</option>
            <option>Soil Carbon</option>
            <option>Blue Carbon</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full border rounded px-3 py-2"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Total Credits</label>
            <input
              type="number"
              value={formData.totalCredits}
              onChange={(e) => setFormData(prev => ({ ...prev, totalCredits: parseInt(e.target.value) }))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price per Credit (SUI)</label>
            <input
              type="number"
              step="0.1"
              value={formData.pricePerCredit}
              onChange={(e) => setFormData(prev => ({ ...prev, pricePerCredit: parseFloat(e.target.value) }))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Funding Goal (SUI)</label>
            <input
              type="number"
              value={formData.fundingGoal}
              onChange={(e) => setFormData(prev => ({ ...prev, fundingGoal: parseInt(e.target.value) }))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Co-benefits</label>
          <div className="flex flex-wrap gap-2">
            {coBenefitsOptions.map((benefit) => (
              <button
                key={benefit}
                type="button"
                onClick={() => toggleCoBenefit(benefit)}
                className={`px-3 py-1 rounded-full text-sm ${
                  coBenefits.includes(benefit)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {benefit}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">SDG Goals</label>
          <div className="grid grid-cols-2 gap-2">
            {sdgGoalsOptions.map((goal) => (
              <button
                key={goal.value}
                type="button"
                onClick={() => toggleSdgGoal(goal.value)}
                className={`px-3 py-1 rounded text-sm text-left ${
                  sdgGoals.includes(goal.value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {goal.value}. {goal.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Creating Project...' : 'Create Project'}
        </button>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </form>
    </div>
  );
}; 