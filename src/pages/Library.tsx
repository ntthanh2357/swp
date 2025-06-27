import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Award, 
  Users, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Star,
  Clock,
  Book,
  GraduationCap,
  Trash2,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Scholarship, Advisor } from '../types';

const Library: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'scholarships' | 'advisors'>('scholarships');
  const [savedScholarships, setSavedScholarships] = useState<Scholarship[]>([]);
  const [savedAdvisors, setSavedAdvisors] = useState<Advisor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data (in real app, fetch from API)
  const allScholarships: Scholarship[] = [
    {
      id: '1',
      title: 'Microsoft Scholarship Program',
      provider: 'Microsoft Corporation',
      amount: 5000,
      currency: 'USD',
      deadline: new Date('2024-03-15'),
      country: 'USA',
      fieldOfStudy: ['Computer Science', 'Engineering', 'Technology'],
      academicLevel: ['Bachelor', 'Master'],
      requirements: ['GPA 3.0+', 'STEM field', 'Leadership experience', 'Financial need'],
      description: 'Supporting diversity in technology through education.',
      applicationUrl: 'https://microsoft.com/scholarships',
      tags: ['Technology', 'Diversity', 'STEM'],
      featured: true,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      title: 'Google Developer Scholarship',
      provider: 'Google',
      amount: 10000,
      currency: 'USD',
      deadline: new Date('2024-02-28'),
      country: 'USA',
      fieldOfStudy: ['Computer Science', 'Software Engineering', 'Web Development'],
      academicLevel: ['Bachelor', 'Master', 'PhD'],
      requirements: ['Programming skills', 'Open source contributions', 'Portfolio projects'],
      description: 'Supporting the next generation of developers and innovators.',
      applicationUrl: 'https://developers.google.com/scholarships',
      tags: ['Programming', 'Open Source', 'Innovation'],
      featured: true,
      createdAt: new Date('2024-01-01'),
    },
  ];

  const allAdvisors: Advisor[] = [
    {
      id: '2',
      email: 'sarah.johnson@example.com',
      name: 'Dr. Sarah Johnson',
      role: 'advisor',
      status: 'approved',
      specializations: ['Computer Science', 'Engineering', 'Technology'],
      countries: ['USA', 'Canada', 'UK'],
      languages: ['English', 'Spanish'],
      experience: '10+ years in academic advising',
      education: 'PhD in Computer Science from MIT',
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 80,
      availability: true,
      bio: 'Experienced academic advisor specializing in STEM scholarships.',
      packages: [],
      verified: true,
      totalStudents: 245,
      successRate: 92,
      createdAt: new Date(),
    },
    {
      id: '3',
      email: 'michael.chen@example.com',
      name: 'Prof. Michael Chen',
      role: 'advisor',
      status: 'approved',
      specializations: ['Business', 'MBA', 'Finance'],
      countries: ['Singapore', 'Australia', 'Germany'],
      languages: ['English', 'Mandarin', 'German'],
      experience: '8 years in business school admissions',
      education: 'MBA from Harvard Business School',
      rating: 4.8,
      reviewCount: 89,
      hourlyRate: 90,
      availability: true,
      bio: 'Former admissions officer at top business schools.',
      packages: [],
      verified: true,
      totalStudents: 178,
      successRate: 88,
      createdAt: new Date(),
    }
  ];

  useEffect(() => {
    // Load saved items from localStorage
    const savedScholarshipIds = JSON.parse(localStorage.getItem('savedScholarships') || '[]');
    const savedAdvisorIds = JSON.parse(localStorage.getItem('savedAdvisors') || '[]');

    const scholarships = allScholarships.filter(s => savedScholarshipIds.includes(s.id));
    const advisors = allAdvisors.filter(a => savedAdvisorIds.includes(a.id));

    setSavedScholarships(scholarships);
    setSavedAdvisors(advisors);
  }, []);

  const handleRemoveScholarship = (scholarshipId: string) => {
    const savedScholarshipIds = JSON.parse(localStorage.getItem('savedScholarships') || '[]');
    const updated = savedScholarshipIds.filter((id: string) => id !== scholarshipId);
    localStorage.setItem('savedScholarships', JSON.stringify(updated));
    setSavedScholarships(prev => prev.filter(s => s.id !== scholarshipId));
  };

  const handleRemoveAdvisor = (advisorId: string) => {
    const savedAdvisorIds = JSON.parse(localStorage.getItem('savedAdvisors') || '[]');
    const updated = savedAdvisorIds.filter((id: string) => id !== advisorId);
    localStorage.setItem('savedAdvisors', JSON.stringify(updated));
    setSavedAdvisors(prev => prev.filter(a => a.id !== advisorId));
  };

  const filteredScholarships = savedScholarships.filter(scholarship =>
    scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAdvisors = savedAdvisors.filter(advisor =>
    advisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    advisor.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const now = new Date();
    const timeDiff = deadline.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your library</h2>
          <Link to="/login" className="text-blue-600 hover:text-blue-700">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Library</h1>
          <p className="text-gray-600">Your saved scholarships and advisors</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('scholarships')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'scholarships'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Scholarships ({savedScholarships.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('advisors')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'advisors'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Advisors ({savedAdvisors.length})</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Search */}
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={`Search saved ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'scholarships' ? (
          <div>
            {filteredScholarships.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {savedScholarships.length === 0 ? 'No saved scholarships yet' : 'No scholarships match your search'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {savedScholarships.length === 0 
                    ? 'Start exploring scholarships and save the ones you\'re interested in.'
                    : 'Try adjusting your search terms.'
                  }
                </p>
                {savedScholarships.length === 0 && (
                  <Link
                    to="/scholarships"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Scholarships
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScholarships.map((scholarship) => {
                  const daysLeft = getDaysUntilDeadline(scholarship.deadline);
                  const isExpired = daysLeft <= 0;
                  const isUrgent = daysLeft <= 30 && daysLeft > 0;

                  return (
                    <div key={scholarship.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{scholarship.title}</h3>
                            <p className="text-gray-600 text-sm">{scholarship.provider}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveScholarship(scholarship.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove from saved"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-green-600">
                              {formatCurrency(scholarship.amount, scholarship.currency)}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              {scholarship.country}
                            </span>
                          </div>

                          <div className={`flex items-center space-x-2 text-sm ${
                            isExpired ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-blue-600'
                          }`}>
                            <Calendar className="h-4 w-4" />
                            <span>
                              {isExpired ? 'Expired' : `${daysLeft} days left`}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Book className="h-4 w-4" />
                            <span>{scholarship.fieldOfStudy.join(', ')}</span>
                          </div>

                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <GraduationCap className="h-4 w-4" />
                            <span>{scholarship.academicLevel.join(', ')}</span>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <Link
                            to={`/scholarships/${scholarship.id}`}
                            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            View Details
                          </Link>
                          {!isExpired && (
                            <button
                              onClick={() => window.open(scholarship.applicationUrl, '_blank')}
                              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              Apply Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            {filteredAdvisors.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {savedAdvisors.length === 0 ? 'No saved advisors yet' : 'No advisors match your search'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {savedAdvisors.length === 0 
                    ? 'Start exploring advisors and save the ones you\'d like to work with.'
                    : 'Try adjusting your search terms.'
                  }
                </p>
                {savedAdvisors.length === 0 && (
                  <Link
                    to="/advisors"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Advisors
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAdvisors.map((advisor) => (
                  <div key={advisor.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={`https://images.pexels.com/photos/${advisor.id === '2' ? '1181690' : '1222271'}/pexels-photo-${advisor.id === '2' ? '1181690' : '1222271'}.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1`}
                            alt={advisor.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{advisor.name}</h3>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-sm font-medium">{advisor.rating}</span>
                              <span className="text-sm text-gray-500 ml-1">({advisor.reviewCount})</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveAdvisor(advisor.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove from saved"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex flex-wrap gap-2">
                          {advisor.specializations.slice(0, 2).map((spec, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                            >
                              {spec}
                            </span>
                          ))}
                          {advisor.specializations.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              +{advisor.specializations.length - 2} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{advisor.countries.join(', ')}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>From ${advisor.hourlyRate}/session</span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span className="text-gray-600">{advisor.totalStudents} students</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4 text-green-500" />
                            <span className="text-gray-600">{advisor.successRate}% success</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Link
                          to={`/advisors/${advisor.id}`}
                          className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          View Profile
                        </Link>
                        <Link
                          to="/chat"
                          className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Message
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;