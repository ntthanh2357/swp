import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Briefcase, 
  Award, 
  DollarSign, 
  Mail, 
  Phone, 
  Globe, 
  Save, 
  Eye,
  CheckCircle,
  AlertCircle,
  Star,
  Upload,
  Plus,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AvatarUpload from '../components/AvatarUpload';

const AdvisorProfileSetup: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

  const [profileData, setProfileData] = useState({
    // Basic Information
    fullName: user?.name || '',
    currentPosition: '',
    yearsExperience: '',
    professionalSummary: '',
    
    // Expertise
    specializations: [''],
    certifications: [''],
    skills: [''],
    
    // Work Experience  
    typicalProjects: [''],
    achievements: [''],
    clientsWorkedWith: [''],
    
    // Services
    servicesOffered: [''],
    consultingMethods: {
      inPerson: false,
      online: false,
      hybrid: false
    },
    hourlyRate: '',
    packagePricing: {
      basic: { name: '', price: '', duration: '', description: '' },
      standard: { name: '', price: '', duration: '', description: '' },
      premium: { name: '', price: '', duration: '', description: '' }
    },
    
    // Contact Information
    professionalEmail: user?.email || '',
    phone: '',
    linkedIn: '',
    personalWebsite: '',
    otherSocialMedia: ['']
  });

  const [completionScore, setCompletionScore] = useState(0);

  const sections = [
    { id: 'basic', name: 'Basic Information', icon: <User className="h-5 w-5" /> },
    { id: 'expertise', name: 'Expertise', icon: <Award className="h-5 w-5" /> },
    { id: 'experience', name: 'Work Experience', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'services', name: 'Services & Pricing', icon: <DollarSign className="h-5 w-5" /> },
    { id: 'contact', name: 'Contact Information', icon: <Mail className="h-5 w-5" /> }
  ];

  React.useEffect(() => {
    calculateCompletionScore();
  }, [profileData]);

  const calculateCompletionScore = () => {
    let score = 0;
    let totalFields = 0;

    // Basic info (25%)
    const basicFields = [profileData.fullName, profileData.currentPosition, profileData.yearsExperience, profileData.professionalSummary];
    score += (basicFields.filter(field => field.trim()).length / basicFields.length) * 25;

    // Expertise (20%)
    const expertiseFields = profileData.specializations.filter(s => s.trim()).length + 
                           profileData.certifications.filter(c => c.trim()).length + 
                           profileData.skills.filter(sk => sk.trim()).length;
    score += Math.min(expertiseFields / 6, 1) * 20;

    // Experience (20%)
    const experienceFields = profileData.typicalProjects.filter(p => p.trim()).length + 
                            profileData.achievements.filter(a => a.trim()).length + 
                            profileData.clientsWorkedWith.filter(c => c.trim()).length;
    score += Math.min(experienceFields / 6, 1) * 20;

    // Services (25%)
    const servicesFields = profileData.servicesOffered.filter(s => s.trim()).length +
                          (Object.values(profileData.consultingMethods).some(Boolean) ? 1 : 0) +
                          (profileData.hourlyRate ? 1 : 0) +
                          (profileData.packagePricing.basic.name ? 1 : 0);
    score += Math.min(servicesFields / 4, 1) * 25;

    // Contact (10%)
    const contactFields = [profileData.professionalEmail, profileData.phone, profileData.linkedIn];
    score += (contactFields.filter(field => field.trim()).length / contactFields.length) * 10;

    setCompletionScore(Math.round(score));
  };

  const addArrayField = (field: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: string, index: number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayField = (field: string, index: number, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In real app, this would save to backend
      console.log('Saving advisor profile:', profileData);
      
      // Update user context with new profile data
      if (user) {
        await updateProfile({
          ...user,
          ...profileData,
          profileComplete: completionScore >= 80
        });
      }
      
      navigate('/advisor-dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Profile Optimization Tips</h4>
            <p className="text-blue-700 text-sm mt-1">
              Complete, professional profiles get 3x more student inquiries. Include a professional photo, detailed experience, and specific expertise areas.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Photo
          </label>
          <div className="flex items-center space-x-4">
            <AvatarUpload
              currentAvatar={user?.avatar}
              userName={profileData.fullName}
              userId={user?.id || ''}
              onAvatarChange={() => {}}
              size="lg"
              editable={true}
            />
            <div className="text-sm text-gray-600">
              <p className="font-medium">Photo Guidelines:</p>
              <ul className="mt-1 space-y-1">
                <li>• Professional headshot recommended</li>
                <li>• High resolution (min 300x300px)</li>
                <li>• Clear, well-lit face photo</li>
                <li>• Professional attire preferred</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Dr. Sarah Johnson"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Position *
          </label>
          <input
            type="text"
            value={profileData.currentPosition}
            onChange={(e) => setProfileData(prev => ({ ...prev, currentPosition: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Senior Academic Advisor at MIT"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience *
          </label>
          <select
            value={profileData.yearsExperience}
            onChange={(e) => setProfileData(prev => ({ ...prev, yearsExperience: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select experience level</option>
            <option value="1-2">1-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="10+">10+ years</option>
            <option value="15+">15+ years</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Summary *
          </label>
          <textarea
            rows={4}
            value={profileData.professionalSummary}
            onChange={(e) => setProfileData(prev => ({ ...prev, professionalSummary: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Experienced academic advisor specializing in STEM scholarships with a proven track record of helping students secure over $2M in funding..."
          />
          <p className="text-sm text-gray-500 mt-1">
            Write a compelling summary highlighting your expertise, achievements, and what makes you unique. Aim for 100-200 words.
          </p>
        </div>
      </div>
    </div>
  );

  const renderExpertise = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900">Expertise Best Practices</h4>
            <p className="text-green-700 text-sm mt-1">
              Be specific about your areas of expertise. Students search for advisors by field and specialization. Include relevant certifications and unique skills.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Main Specialization Areas *
        </label>
        {profileData.specializations.map((spec, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={spec}
              onChange={(e) => updateArrayField('specializations', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Computer Science, STEM, Business Administration"
            />
            {profileData.specializations.length > 1 && (
              <button
                onClick={() => removeArrayField('specializations', index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayField('specializations')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Specialization</span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Certifications & Qualifications
        </label>
        {profileData.certifications.map((cert, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={cert}
              onChange={(e) => updateArrayField('certifications', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="PhD in Computer Science, Certified College Advisor"
            />
            {profileData.certifications.length > 1 && (
              <button
                onClick={() => removeArrayField('certifications', index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayField('certifications')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Certification</span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notable Skills
        </label>
        {profileData.skills.map((skill, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={skill}
              onChange={(e) => updateArrayField('skills', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Scholarship application review, Interview coaching"
            />
            {profileData.skills.length > 1 && (
              <button
                onClick={() => removeArrayField('skills', index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayField('skills')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </button>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Typical Projects Completed
        </label>
        {profileData.typicalProjects.map((project, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={project}
              onChange={(e) => updateArrayField('typicalProjects', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Helped 50+ students secure STEM scholarships worth $500K+"
            />
            {profileData.typicalProjects.length > 1 && (
              <button
                onClick={() => removeArrayField('typicalProjects', index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayField('typicalProjects')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notable Achievements
        </label>
        {profileData.achievements.map((achievement, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={achievement}
              onChange={(e) => updateArrayField('achievements', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="95% scholarship application success rate, Featured advisor of the year"
            />
            {profileData.achievements.length > 1 && (
              <button
                onClick={() => removeArrayField('achievements', index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayField('achievements')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Organizations/Companies Worked With
        </label>
        {profileData.clientsWorkedWith.map((client, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={client}
              onChange={(e) => updateArrayField('clientsWorkedWith', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="MIT Admissions Office, Harvard Extension School"
            />
            {profileData.clientsWorkedWith.length > 1 && (
              <button
                onClick={() => removeArrayField('clientsWorkedWith', index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayField('clientsWorkedWith')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Organization</span>
        </button>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Services Offered *
        </label>
        {profileData.servicesOffered.map((service, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={service}
              onChange={(e) => updateArrayField('servicesOffered', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Scholarship application review, Personal statement coaching"
            />
            {profileData.servicesOffered.length > 1 && (
              <button
                onClick={() => removeArrayField('servicesOffered', index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayField('servicesOffered')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Consulting Methods *
        </label>
        <div className="space-y-2">
          {Object.entries(profileData.consultingMethods).map(([method, checked]) => (
            <label key={method} className="flex items-center">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  consultingMethods: { ...prev.consultingMethods, [method]: e.target.checked }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {method === 'inPerson' ? 'In-Person Meetings' :
                 method === 'online' ? 'Online/Video Consultations' :
                 'Hybrid (Both Online & In-Person)'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hourly Rate (USD) *
        </label>
        <div className="flex items-center">
          <span className="text-gray-500 mr-2">$</span>
          <input
            type="number"
            value={profileData.hourlyRate}
            onChange={(e) => setProfileData(prev => ({ ...prev, hourlyRate: e.target.value }))}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="80"
          />
          <span className="text-gray-500 ml-2">per hour</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Package Pricing (Optional)
        </label>
        <div className="grid gap-4">
          {Object.entries(profileData.packagePricing).map(([tier, pkg]) => (
            <div key={tier} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 capitalize">{tier} Package</h4>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Package name"
                  value={pkg.name}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    packagePricing: {
                      ...prev.packagePricing,
                      [tier]: { ...pkg, name: e.target.value }
                    }
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Price ($)"
                  value={pkg.price}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    packagePricing: {
                      ...prev.packagePricing,
                      [tier]: { ...pkg, price: e.target.value }
                    }
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., 60 min)"
                  value={pkg.duration}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    packagePricing: {
                      ...prev.packagePricing,
                      [tier]: { ...pkg, duration: e.target.value }
                    }
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Package description"
                  value={pkg.description}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    packagePricing: {
                      ...prev.packagePricing,
                      [tier]: { ...pkg, description: e.target.value }
                    }
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Globe className="h-5 w-5 text-purple-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-purple-900">Professional Contact Guidelines</h4>
            <p className="text-purple-700 text-sm mt-1">
              Use professional contact methods. Students prefer multiple ways to reach you. LinkedIn profiles get 40% more trust.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Email *
          </label>
          <input
            type="email"
            value={profileData.professionalEmail}
            onChange={(e) => setProfileData(prev => ({ ...prev, professionalEmail: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="sarah.johnson@university.edu"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={profileData.linkedIn}
            onChange={(e) => setProfileData(prev => ({ ...prev, linkedIn: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://linkedin.com/in/your-profile"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personal Website
          </label>
          <input
            type="url"
            value={profileData.personalWebsite}
            onChange={(e) => setProfileData(prev => ({ ...prev, personalWebsite: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://yourname.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Other Professional Social Media
        </label>
        {profileData.otherSocialMedia.map((social, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="url"
              value={social}
              onChange={(e) => updateArrayField('otherSocialMedia', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://twitter.com/yourhandle"
            />
            {profileData.otherSocialMedia.length > 1 && (
              <button
                onClick={() => removeArrayField('otherSocialMedia', index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayField('otherSocialMedia')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Social Media</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Advisor Profile</h1>
          <p className="text-gray-600">Create a compelling profile to attract more students and boost your visibility</p>
        </div>

        {/* Completion Score */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Profile Completion</h2>
            <span className={`text-2xl font-bold ${
              completionScore >= 80 ? 'text-green-600' : 
              completionScore >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {completionScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                completionScore >= 80 ? 'bg-green-500' : 
                completionScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${completionScore}%` }}
            ></div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              {completionScore >= 80 ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
              <span className="text-gray-600">
                {completionScore >= 80 
                  ? 'Excellent! Your profile is optimized for maximum visibility'
                  : 'Complete more sections to improve your profile visibility'
                }
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-gray-600">
                {completionScore >= 80 ? 'Featured advisor eligible' : `${80 - completionScore}% away from featured status`}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Profile Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {section.icon}
                    <span className="text-sm font-medium">{section.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {sections.find(s => s.id === activeSection)?.name}
                </h2>
                <p className="text-gray-600">
                  {activeSection === 'basic' && 'Create a strong first impression with professional information and photo'}
                  {activeSection === 'expertise' && 'Highlight your specializations, certifications, and unique skills'}
                  {activeSection === 'experience' && 'Showcase your track record and notable achievements'}
                  {activeSection === 'services' && 'Define your consulting offerings and pricing structure'}
                  {activeSection === 'contact' && 'Provide professional contact methods for student inquiries'}
                </p>
              </div>

              {activeSection === 'basic' && renderBasicInfo()}
              {activeSection === 'expertise' && renderExpertise()}
              {activeSection === 'experience' && renderExperience()}
              {activeSection === 'services' && renderServices()}
              {activeSection === 'contact' && renderContact()}

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <div className="flex space-x-4">
                  {sections.findIndex(s => s.id === activeSection) > 0 && (
                    <button
                      onClick={() => setActiveSection(sections[sections.findIndex(s => s.id === activeSection) - 1].id)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  {sections.findIndex(s => s.id === activeSection) < sections.length - 1 && (
                    <button
                      onClick={() => setActiveSection(sections[sections.findIndex(s => s.id === activeSection) + 1].id)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next Section
                    </button>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate('/advisor-dashboard')}
                    className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Saving...' : 'Save Profile'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorProfileSetup;