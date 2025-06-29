import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProjectForm {
  name: string;
  description: string;
  projectType: string;
  location: string;
  latitude: string;
  longitude: string;
  methodology: string;
  expectedLifetime: string;
  monitoringFrequency: string;
  expectedCredits: string;
  pricePerTon: string;
  images: File[];
  documents: File[];
}

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProjectForm>({
    name: '',
    description: '',
    projectType: '',
    location: '',
    latitude: '',
    longitude: '',
    methodology: '',
    expectedLifetime: '',
    monitoringFrequency: '',
    expectedCredits: '',
    pricePerTon: '',
    images: [],
    documents: []
  });

  const projectTypes = [
    'Reforestation',
    'Afforestation',
    'Renewable Energy',
    'Energy Efficiency',
    'Methane Capture',
    'Soil Carbon',
    'Blue Carbon',
    'Community Forest Management'
  ];

  const methodologies = [
    'AR-ACM0003: Afforestation and reforestation of lands other than wetlands',
    'AMS-I.C: Grid connected renewable electricity generation',
    'AMS-I.D: Grid connected electricity generation from renewable sources',
    'AR-ACM0002: Afforestation and reforestation project activities implemented for the purpose of promoting sustainable forest management',
    'AMS-III.AK: Methane recovery in animal waste management systems',
    'AMS-III.BE: Energy efficiency and fuel switching measures for agricultural facilities and activities'
  ];

  const handleInputChange = (field: keyof ProjectForm, value: string | File[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field: 'images' | 'documents', files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], ...fileArray]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to create project
    console.log('Project data:', formData);
    navigate('/dashboard');
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter project name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Type *
            </label>
            <select
              value={formData.projectType}
              onChange={(e) => handleInputChange('projectType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select project type</option>
              {projectTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Describe your project, its goals, and expected impact..."
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Location & Technical Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="City, Country"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Methodology *
            </label>
            <select
              value={formData.methodology}
              onChange={(e) => handleInputChange('methodology', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select methodology</option>
              {methodologies.map(methodology => (
                <option key={methodology} value={methodology}>{methodology}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => handleInputChange('latitude', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 40.7128"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => handleInputChange('longitude', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., -74.0060"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Lifetime (years) *
            </label>
            <input
              type="number"
              value={formData.expectedLifetime}
              onChange={(e) => handleInputChange('expectedLifetime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 20"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monitoring Frequency (days) *
            </label>
            <input
              type="number"
              value={formData.monitoringFrequency}
              onChange={(e) => handleInputChange('monitoringFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 30"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Credits (kg CO2) *
            </label>
            <input
              type="number"
              value={formData.expectedCredits}
              onChange={(e) => handleInputChange('expectedCredits', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 10000"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Ton (SUI) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.pricePerTon}
              onChange={(e) => handleInputChange('pricePerTon', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 25.00"
              required
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload('images', e.target.files)}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="text-gray-600">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2">Click to upload images</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
              </div>
            </label>
          </div>
          {formData.images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</p>
              <div className="flex flex-wrap gap-2">
                {formData.images.map((file, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supporting Documents
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileUpload('documents', e.target.files)}
              className="hidden"
              id="document-upload"
            />
            <label htmlFor="document-upload" className="cursor-pointer">
              <div className="text-gray-600">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2">Click to upload documents</p>
                <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 10MB each</p>
              </div>
            </label>
          </div>
          {formData.documents.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents:</p>
              <div className="flex flex-wrap gap-2">
                {formData.documents.map((file, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-600 mt-1">Set up your carbon credit project and start generating verified credits</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep >= step 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {step}
              </div>
              {step < 3 && (
                <div className={`
                  w-16 h-1 mx-2
                  ${currentStep > step ? 'bg-green-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Basic Info</span>
          <span>Location & Technical</span>
          <span>Pricing & Docs</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg
              ${currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900'
              }
            `}
          >
            Previous
          </button>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Project
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectPage; 