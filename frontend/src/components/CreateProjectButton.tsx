import React, { useState } from 'react';
import { useProjects } from '../hooks/useProjects';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject, isCreatingProject } = useProjects();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    projectType: '',
    totalCredits: '',
    pricePerCredit: '',
    coBenefits: [] as string[],
    sdgGoals: [] as number[],
    fundingGoal: '',
    metadata: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCreating = isCreatingProject || isSubmitting;
  const [coBenefitInput, setCoBenefitInput] = useState('');
  const [sdgGoalInput, setSdgGoalInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createProject({
        name: formData.name,
        description: formData.description,
        location: formData.location,
        projectType: formData.projectType,
        totalCredits: parseInt(formData.totalCredits) || 0,
        pricePerCredit: parseFloat(formData.pricePerCredit) || 0, // Keep as SUI, convert to MIST in hook
        coBenefits: formData.coBenefits,
        sdgGoals: formData.sdgGoals,
        fundingGoal: parseFloat(formData.fundingGoal) || 0, // Keep as SUI, convert to MIST in hook
        metadata: formData.metadata
      });
      
      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        location: '',
        projectType: '',
        totalCredits: '',
        pricePerCredit: '',
        coBenefits: [],
        sdgGoals: [],
        fundingGoal: '',
        metadata: ''
      });
      setCoBenefitInput('');
      setSdgGoalInput('');
      onClose();
      alert('Project created successfully!');
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCoBenefit = () => {
    if (coBenefitInput.trim()) {
      setFormData({
        ...formData,
        coBenefits: [...formData.coBenefits, coBenefitInput.trim()]
      });
      setCoBenefitInput('');
    }
  };

  const removeCoBenefit = (index: number) => {
    setFormData({
      ...formData,
      coBenefits: formData.coBenefits.filter((_, i) => i !== index)
    });
  };

  const addSdgGoal = () => {
    const goal = parseInt(sdgGoalInput);
    if (!isNaN(goal) && goal >= 1 && goal <= 17) {
      setFormData({
        ...formData,
        sdgGoals: [...formData.sdgGoals, goal]
      });
      setSdgGoalInput('');
    }
  };

  const removeSdgGoal = (index: number) => {
    setFormData({
      ...formData,
      sdgGoals: formData.sdgGoals.filter((_, i) => i !== index)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Create New Carbon Project</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Type *
              </label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select project type</option>
                <option value="reforestation">Reforestation</option>
                <option value="renewable_energy">Renewable Energy</option>
                <option value="energy_efficiency">Energy Efficiency</option>
                <option value="methane_capture">Methane Capture</option>
                <option value="ocean_conservation">Ocean Conservation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Funding Goal (SUI) *
              </label>
              <input
                type="number"
                value={formData.fundingGoal}
                onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                min="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Credits (tons CO2) *
              </label>
              <input
                type="number"
                value={formData.totalCredits}
                onChange={(e) => setFormData({ ...formData, totalCredits: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Credit (SUI) *
              </label>
              <input
                type="number"
                value={formData.pricePerCredit}
                onChange={(e) => setFormData({ ...formData, pricePerCredit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Co-Benefits
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={coBenefitInput}
                onChange={(e) => setCoBenefitInput(e.target.value)}
                placeholder="Add a co-benefit"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={addCoBenefit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {formData.coBenefits.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.coBenefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm flex items-center gap-1"
                  >
                    {benefit}
                    <button
                      type="button"
                      onClick={() => removeCoBenefit(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SDG Goals (1-17)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                value={sdgGoalInput}
                onChange={(e) => setSdgGoalInput(e.target.value)}
                placeholder="SDG goal number (1-17)"
                min="1"
                max="17"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={addSdgGoal}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Add
              </button>
            </div>
            {formData.sdgGoals.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.sdgGoals.map((goal, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm flex items-center gap-1"
                  >
                    SDG {goal}
                    <button
                      type="button"
                      onClick={() => removeSdgGoal(index)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Metadata
            </label>
            <textarea
              value={formData.metadata}
              onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
              placeholder="Any additional project information..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={2}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateProjectButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        Create Project
      </button>
      
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CreateProjectButton; 