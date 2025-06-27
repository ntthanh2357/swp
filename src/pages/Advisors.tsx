import React, { useState } from 'react';
import { Star, Globe, Clock, Filter, Search, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Advisor } from '../types';

const Advisors: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  // Mock advisors data
  const advisors: Advisor[] = [
    {
      id: '2',
      email: 'sarah.johnson@example.com',
      name: 'Dr. Sarah Johnson',
      role: 'advisor',
      specializations: ['Computer Science', 'Engineering', 'Technology'],
      countries: ['USA', 'Canada', 'UK'],
      languages: ['English', 'Spanish'],
      experience: '10+ years in academic advising with focus on STEM scholarships',
      education: 'PhD in Computer Science from MIT',
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 80,
      availability: true,
      bio: 'Experienced academic advisor specializing in STEM scholarships and university admissions. I have helped over 500 students secure scholarships worth over $2M.',
      packages: [
        {
          id: 'pkg1',
          name: 'Scholarship Discovery',
          description: '30-minute session to identify suitable scholarships',
          duration: 30,
          price: 40,
          features: ['Personalized scholarship recommendations', 'Application timeline', 'Initial guidance']
        },
        {
          id: 'pkg2',
          name: 'Application Support',
          description: '60-minute comprehensive application assistance',
          duration: 60,
          price: 80,
          features: ['Document review', 'Essay feedback', 'Interview preparation', 'Application strategy']
        },
        {
          id: 'pkg3',
          name: 'Complete Mentorship',
          description: 'Series of 3 in-depth sessions for full support',
          duration: 180,
          price: 200,
          features: ['3 comprehensive sessions', 'Ongoing email support', 'Document templates', 'Success tracking']
        }
      ],
      createdAt: new Date(),
    },
    {
      id: '3',
      email: 'michael.chen@example.com',
      name: 'Prof. Michael Chen',
      role: 'advisor',
      specializations: ['Business', 'MBA', 'Finance'],
      countries: ['Singapore', 'Australia', 'Germany'],
      languages: ['English', 'Mandarin', 'German'],
      experience: '8 years in business school admissions and scholarship consulting',
      education: 'MBA from Harvard Business School',
      rating: 4.8,
      reviewCount: 89,
      hourlyRate: 90,
      availability: true,
      bio: 'Former admissions officer at top business schools. Specializing in MBA scholarships and business program applications.',
      packages: [
        {
          id: 'pkg4',
          name: 'MBA Consultation',
          description: '45-minute MBA program and scholarship guidance',
          duration: 45,
          price: 70,
          features: ['Program selection', 'GMAT strategy', 'Application timeline']
        },
        {
          id: 'pkg5',
          name: 'Business School Package',
          description: 'Comprehensive MBA application support',
          duration: 90,
          price: 150,
          features: ['Essay review', 'Interview prep', 'Scholarship strategy', 'School selection']
        }
      ],
      createdAt: new Date(),
    },
    {
      id: '4',
      email: 'emily.rodriguez@example.com',
      name: 'Dr. Emily Rodriguez',
      role: 'advisor',
      specializations: ['Medicine', 'Healthcare', 'Life Sciences'],
      countries: ['USA', 'Netherlands', 'Sweden'],
      languages: ['English', 'Spanish', 'Dutch'],
      experience: '12 years in medical school admissions and healthcare scholarships',
      education: 'MD from Johns Hopkins, MPH from Harvard',
      rating: 5.0,
      reviewCount: 156,
      hourlyRate: 100,
      availability: true,
      bio: 'Medical doctor and public health expert. Specialized in medical school scholarships and healthcare program admissions.',
      packages: [
        {
          id: 'pkg6',
          name: 'Medical School Prep',
          description: 'Medical school application and scholarship guidance',
          duration: 60,
          price: 100,
          features: ['School selection', 'MCAT strategy', 'Personal statement review']
        },
        {
          id: 'pkg7',
          name: 'Healthcare Scholarships',
          description: 'Comprehensive healthcare scholarship consultation',
          duration: 75,
          price: 125,
          features: ['Scholarship research', 'Application review', 'Interview coaching']
        }
      ],
      createdAt: new Date(),
    },
  ];

  const countries = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'Singapore', 'Netherlands', 'Sweden'];
  const fields = ['Computer Science', 'Engineering', 'Business', 'Medicine', 'Arts', 'Social Sciences'];

  const filteredAdvisors = advisors.filter(advisor => {
    const matchesSearch = advisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         advisor.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCountry = !selectedCountry || advisor.countries.includes(selectedCountry);
    const matchesField = !selectedField || advisor.specializations.some(spec => spec.includes(selectedField));
    
    return matchesSearch && matchesCountry && matchesField;
  });

  const sortedAdvisors = [...filteredAdvisors].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price':
        return a.hourlyRate - b.hourlyRate;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Advisor</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with experienced advisors who specialize in your field and target countries. 
            Get personalized guidance for your scholarship journey.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search advisors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Fields</option>
              {fields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rating">Sort by Rating</option>
              <option value="price">Sort by Price</option>
              <option value="reviews">Sort by Reviews</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found {sortedAdvisors.length} advisor{sortedAdvisors.length !== 1 ? 's' : ''} matching your criteria
          </p>
        </div>

        {/* Advisors grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedAdvisors.map((advisor) => (
            <div key={advisor.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={`https://images.pexels.com/photos/${advisor.id === '2' ? '1181690' : advisor.id === '3' ? '1222271' : '1181686'}/pexels-photo-${advisor.id === '2' ? '1181690' : advisor.id === '3' ? '1222271' : '1181686'}.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1`}
                    alt={advisor.name}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{advisor.name}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{advisor.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({advisor.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{advisor.bio}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Award className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{advisor.specializations.join(', ')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-2 text-green-500" />
                    <span>{advisor.countries.join(', ')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-purple-500" />
                    <span>From ${advisor.packages[0]?.price || advisor.hourlyRate}/session</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${advisor.availability ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-sm text-gray-600">
                      {advisor.availability ? 'Available' : 'Busy'}
                    </span>
                  </div>
                  <Link
                    to={`/advisors/${advisor.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedAdvisors.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No advisors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria to find more advisors.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Advisors;