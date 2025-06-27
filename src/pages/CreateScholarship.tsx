import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Globe, 
  BookOpen, 
  GraduationCap,
  FileText,
  Tag,
  Building,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CreateScholarship: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    provider: user?.role === 'advisor' ? `${user.name} Foundation` : '',
    amount: '',
    currency: 'USD',
    deadline: '',
    country: '',
    fieldOfStudy: [''],
    academicLevel: [''],
    requirements: [''],
    description: '',
    applicationUrl: '',
    tags: [''],
    featured: false,
    eligibilityNote: '',
    applicationFee: '',
    documentsRequired: [''],
    contactEmail: user?.email || '',
    contactPhone: '',
    additionalInfo: ''
  });

  const currencies = [
    'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'CHF', 'SGD', 'HKD'
  ];

  const countries = [
    'USA', 'UK', 'Germany', 'Australia', 'Canada', 'France', 'Japan', 
    'Switzerland', 'China', 'New Zealand', 'Netherlands', 'Sweden', 
    'Norway', 'Denmark', 'Singapore', 'South Korea', 'Spain', 'Italy'
  ];

  const fields = [
    'Computer Science', 'Engineering', 'Business', 'Medicine', 'Arts', 
    'Social Sciences', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Psychology', 'Economics', 'Law', 'Education', 'Architecture',
    'Environmental Science', 'Agriculture', 'All Fields'
  ];

  const levels = [
    'High School', 'Bachelor', 'Master', 'PhD', 'Postdoc', 'Professional'
  ];

  const documentTypes = [
    'Academic Transcripts', 'Personal Statement', 'Letters of Recommendation',
    'CV/Resume', 'Portfolio', 'Language Proficiency Certificate', 
    'Financial Documents', 'Research Proposal', 'Passport Copy'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleArrayFieldChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayField = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev], '']
    }));
  };

  const removeArrayField = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].filter((_: string, i: number) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Scholarship title is required';
    if (!formData.provider.trim()) return 'Provider/Organization is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) return 'Valid amount is required';
    if (!formData.deadline) return 'Application deadline is required';
    if (!formData.country) return 'Country is required';
    if (!formData.fieldOfStudy.some(field => field.trim())) return 'At least one field of study is required';
    if (!formData.academicLevel.some(level => level.trim())) return 'At least one academic level is required';
    if (!formData.requirements.some(req => req.trim())) return 'At least one requirement is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.applicationUrl.trim()) return 'Application URL is required';

    // Validate deadline is in the future
    const deadlineDate = new Date(formData.deadline);
    if (deadlineDate <= new Date()) return 'Deadline must be in the future';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Prepare scholarship data
      const scholarshipData = {
        ...formData,
        amount: parseFloat(formData.amount),
        fieldOfStudy: formData.fieldOfStudy.filter(field => field.trim()),
        academicLevel: formData.academicLevel.filter(level => level.trim()),
        requirements: formData.requirements.filter(req => req.trim()),
        tags: formData.tags.filter(tag => tag.trim()),
        documentsRequired: formData.documentsRequired.filter(doc => doc.trim()),
        createdBy: user?.id,
        createdAt: new Date(),
        id: Date.now().toString() // In real app, this would be generated by backend
      };

      console.log('Creating scholarship:', scholarshipData);

      // In real app, this would be an API call
      // await fetch('/api/scholarships', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(scholarshipData)
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccess('Scholarship created successfully! It will be reviewed and published soon.');
      
      // Redirect after success
      setTimeout(() => {
        if (user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/advisor-scholarships');
        }
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to create scholarship. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/advisor-scholarships');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Scholarship</h1>
              <p className="text-gray-600 mt-2">
                Fill out the form below to create a new scholarship opportunity
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scholarship Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Microsoft Technology Excellence Scholarship"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider/Organization *
                </label>
                <input
                  type="text"
                  name="provider"
                  value={formData.provider}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Microsoft Corporation"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Financial Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Fee (Optional)
                </label>
                <input
                  type="number"
                  name="applicationFee"
                  value={formData.applicationFee}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Location & Timing */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-purple-600" />
              Location & Timing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline *
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Academic Requirements */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-orange-600" />
              Academic Requirements
            </h2>

            {/* Fields of Study */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Fields of Study *
              </label>
              {formData.fieldOfStudy.map((field, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <select
                    value={field}
                    onChange={(e) => handleArrayFieldChange('fieldOfStudy', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Field</option>
                    {fields.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  {formData.fieldOfStudy.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('fieldOfStudy', index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('fieldOfStudy')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm mt-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Field</span>
              </button>
            </div>

            {/* Academic Levels */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Academic Levels *
              </label>
              {formData.academicLevel.map((level, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <select
                    value={level}
                    onChange={(e) => handleArrayFieldChange('academicLevel', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Level</option>
                    {levels.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  {formData.academicLevel.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('academicLevel', index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('academicLevel')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm mt-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Level</span>
              </button>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Eligibility Requirements *
              </label>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., GPA 3.0+, Financial need"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('requirements', index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('requirements')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm mt-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Requirement</span>
              </button>
            </div>
          </div>

          {/* Description & Details */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
              Description & Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scholarship Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide a detailed description of the scholarship, its purpose, and what it covers..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application URL *
                </label>
                <input
                  type="url"
                  name="applicationUrl"
                  value={formData.applicationUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/apply"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional notes or special instructions..."
                />
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-red-600" />
              Required Documents
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Documents Required for Application
              </label>
              {formData.documentsRequired.map((document, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <select
                    value={document}
                    onChange={(e) => handleArrayFieldChange('documentsRequired', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Document Type</option>
                    {documentTypes.map(doc => (
                      <option key={doc} value={doc}>{doc}</option>
                    ))}
                  </select>
                  {formData.documentsRequired.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('documentsRequired', index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('documentsRequired')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm mt-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Document</span>
              </button>
            </div>
          </div>

          {/* Tags & Classification */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Tag className="h-5 w-5 mr-2 text-pink-600" />
              Tags & Classification
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tags (for better searchability)
                </label>
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayFieldChange('tags', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Technology, Diversity, STEM"
                    />
                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('tags', index)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('tags')}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm mt-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Tag</span>
                </button>
              </div>

              {user?.role === 'admin' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Mark as Featured Scholarship
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                * Required fields
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Create Scholarship</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScholarship;