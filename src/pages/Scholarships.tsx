import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, DollarSign, GraduationCap, Star, Heart, CheckCircle, FileText, Award, Globe, Book, Users, TrendingUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Scholarship } from '../types';

const Scholarships: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [currentPage, setCurrentPage] = useState(1);
  const [savedScholarships, setSavedScholarships] = useState<string[]>(['1', '3']); // Mock saved scholarship IDs
  const itemsPerPage = 12;

  // Mock scholarships data with more entries
  const scholarships: Scholarship[] = [
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
      description: 'Supporting diversity in technology through education. This comprehensive scholarship program aims to increase representation in STEM fields and provide opportunities for underrepresented students.',
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
      description: 'Supporting the next generation of developers and innovators. Recipients gain access to mentorship, internship opportunities, and Google developer resources.',
      applicationUrl: 'https://developers.google.com/scholarships',
      tags: ['Programming', 'Open Source', 'Innovation'],
      featured: true,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      title: 'Fulbright Foreign Student Program',
      provider: 'U.S. Department of State',
      amount: 30000,
      currency: 'USD',
      deadline: new Date('2024-10-15'),
      country: 'USA',
      fieldOfStudy: ['All Fields'],
      academicLevel: ['Master', 'PhD'],
      requirements: ['International student', 'Academic excellence', 'Leadership potential', 'English proficiency'],
      description: 'The flagship international educational exchange program sponsored by the U.S. government. Provides funding for graduate study, research, and teaching.',
      applicationUrl: 'https://fulbrightprogram.org',
      tags: ['International', 'Government', 'Exchange'],
      featured: true,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '4',
      title: 'Rhodes Scholarship',
      provider: 'Rhodes Trust',
      amount: 70000,
      currency: 'GBP',
      deadline: new Date('2024-09-30'),
      country: 'UK',
      fieldOfStudy: ['All Fields'],
      academicLevel: ['Master', 'PhD'],
      requirements: ['Academic excellence', 'Leadership', 'Service to others', 'Age 18-24'],
      description: 'The world\'s oldest international scholarship program. Study at the University of Oxford with full funding for 2-3 years.',
      applicationUrl: 'https://rhodeshouse.ox.ac.uk',
      tags: ['Prestigious', 'Oxford', 'International'],
      featured: true,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '5',
      title: 'Chevening Scholarships',
      provider: 'UK Government',
      amount: 25000,
      currency: 'GBP',
      deadline: new Date('2024-11-01'),
      country: 'UK',
      fieldOfStudy: ['All Fields'],
      academicLevel: ['Master'],
      requirements: ['Work experience', 'Leadership potential', 'English proficiency', 'Return to home country'],
      description: 'UK government\'s global scholarship program. Study any eligible master\'s degree at a UK university with full funding.',
      applicationUrl: 'https://chevening.org',
      tags: ['Government', 'Leadership', 'UK'],
      featured: false,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '6',
      title: 'DAAD Scholarships',
      provider: 'German Academic Exchange Service',
      amount: 15000,
      currency: 'EUR',
      deadline: new Date('2024-08-31'),
      country: 'Germany',
      fieldOfStudy: ['Engineering', 'Science', 'Arts', 'Social Sciences'],
      academicLevel: ['Bachelor', 'Master', 'PhD'],
      requirements: ['Academic merit', 'German language (some programs)', 'Motivation letter'],
      description: 'Study in Germany with comprehensive support including tuition, living expenses, and travel costs.',
      applicationUrl: 'https://daad.de',
      tags: ['Germany', 'Research', 'Language'],
      featured: false,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '7',
      title: 'Australia Awards Scholarships',
      provider: 'Australian Government',
      amount: 40000,
      currency: 'AUD',
      deadline: new Date('2024-05-30'),
      country: 'Australia',
      fieldOfStudy: ['All Fields'],
      academicLevel: ['Bachelor', 'Master'],
      requirements: ['Developing country citizen', 'Return commitment', 'Leadership potential'],
      description: 'Long-term development scholarships contributing to development needs of Australia\'s partner countries.',
      applicationUrl: 'https://australiaawards.gov.au',
      tags: ['Development', 'Partnership', 'Government'],
      featured: false,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '8',
      title: 'Japanese Government MEXT Scholarship',
      provider: 'Ministry of Education, Culture, Sports, Science and Technology',
      amount: 20000,
      currency: 'JPY',
      deadline: new Date('2024-06-15'),
      country: 'Japan',
      fieldOfStudy: ['All Fields'],
      academicLevel: ['Bachelor', 'Master', 'PhD'],
      requirements: ['Academic excellence', 'Japanese language study', 'Age requirements'],
      description: 'Study in Japan with full tuition coverage, monthly allowance, and travel expenses.',
      applicationUrl: 'https://mext.go.jp',
      tags: ['Government', 'Culture', 'Language'],
      featured: false,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '9',
      title: 'Swiss Government Excellence Scholarships',
      provider: 'Swiss Confederation',
      amount: 35000,
      currency: 'CHF',
      deadline: new Date('2024-12-01'),
      country: 'Switzerland',
      fieldOfStudy: ['Research', 'Arts', 'Music'],
      academicLevel: ['Master', 'PhD', 'Postdoc'],
      requirements: ['Academic merit', 'Research proposal', 'Language requirements'],
      description: 'Promote international exchange and research cooperation between Switzerland and over 180 other countries.',
      applicationUrl: 'https://swissgov.scholarship.ch',
      tags: ['Research', 'Excellence', 'International'],
      featured: false,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '10',
      title: 'Gates Cambridge Scholarship',
      provider: 'Bill & Melinda Gates Foundation',
      amount: 50000,
      currency: 'GBP',
      deadline: new Date('2024-12-15'),
      country: 'UK',
      fieldOfStudy: ['All Fields'],
      academicLevel: ['Master', 'PhD'],
      requirements: ['Outstanding academic achievement', 'Leadership potential', 'Commitment to improving lives'],
      description: 'Highly competitive scholarship for outstanding applicants from countries outside the UK to pursue a graduate degree at Cambridge.',
      applicationUrl: 'https://gatescambridge.org',
      tags: ['Prestigious', 'Cambridge', 'Leadership'],
      featured: true,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '11',
      title: 'Eiffel Excellence Scholarship',
      provider: 'Campus France',
      amount: 25000,
      currency: 'EUR',
      deadline: new Date('2024-01-08'),
      country: 'France',
      fieldOfStudy: ['Engineering', 'Economics', 'Management', 'Political Science', 'Law'],
      academicLevel: ['Master', 'PhD'],
      requirements: ['International student', 'Academic excellence', 'Age under 30 (Master), 35 (PhD)'],
      description: 'French government scholarship program to attract top international students to French higher education.',
      applicationUrl: 'https://campusfrance.org',
      tags: ['Government', 'Excellence', 'International'],
      featured: false,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '12',
      title: 'Chinese Government Scholarship',
      provider: 'China Scholarship Council',
      amount: 18000,
      currency: 'CNY',
      deadline: new Date('2024-04-30'),
      country: 'China',
      fieldOfStudy: ['All Fields'],
      academicLevel: ['Bachelor', 'Master', 'PhD'],
      requirements: ['International student', 'Academic merit', 'Age requirements', 'Health certificate'],
      description: 'Comprehensive scholarship covering tuition, accommodation, living allowance, and medical insurance.',
      applicationUrl: 'https://csc.edu.cn',
      tags: ['Government', 'Comprehensive', 'Culture'],
      featured: false,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '13',
      title: 'Erasmus Mundus Joint Master Degrees',
      provider: 'European Commission',
      amount: 24000,
      currency: 'EUR',
      deadline: new Date('2024-01-15'),
      country: 'Multiple EU Countries',
      fieldOfStudy: ['Various Fields'],
      academicLevel: ['Master'],
      requirements: ['Bachelor degree', 'Language requirements', 'Academic excellence'],
      description: 'Study in multiple European countries with full scholarship covering tuition, travel, and living costs.',
      applicationUrl: 'https://erasmusplus.eu',
      tags: ['European', 'Mobility', 'Multicultural'],
      featured: true,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '14',
      title: 'Canada Graduate Scholarships',
      provider: 'Government of Canada',
      amount: 35000,
      currency: 'CAD',
      deadline: new Date('2024-10-01'),
      country: 'Canada',
      fieldOfStudy: ['All Fields'],
      academicLevel: ['Master', 'PhD'],
      requirements: ['Academic excellence', 'Research potential', 'Canadian resident or international'],
      description: 'Support high-caliber students engaged in master\'s or doctoral programs in Canada.',
      applicationUrl: 'https://nserc-crsng.gc.ca',
      tags: ['Government', 'Research', 'Graduate'],
      featured: false,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '15',
      title: 'New Zealand Development Scholarships',
      provider: 'New Zealand Government',
      amount: 30000,
      currency: 'NZD',
      deadline: new Date('2024-07-31'),
      country: 'New Zealand',
      fieldOfStudy: ['Development-related fields'],
      academicLevel: ['Bachelor', 'Master'],
      requirements: ['Developing country citizen', 'Development focus', 'Return commitment'],
      description: 'Contribute to sustainable development in partner countries through tertiary education and training.',
      applicationUrl: 'https://nzscholarships.govt.nz',
      tags: ['Development', 'Sustainability', 'Partnership'],
      featured: false,
      createdAt: new Date('2024-01-01'),
    }
  ];

  const countries = ['USA', 'UK', 'Germany', 'Australia', 'Canada', 'France', 'Japan', 'Switzerland', 'China', 'New Zealand'];
  const fields = ['Computer Science', 'Engineering', 'Business', 'Medicine', 'Arts', 'Social Sciences', 'All Fields'];
  const levels = ['Bachelor', 'Master', 'PhD', 'Postdoc'];

  // Filter scholarships
  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scholarship.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = !selectedCountry || scholarship.country.includes(selectedCountry);
    const matchesField = !selectedField || scholarship.fieldOfStudy.some(field => field.includes(selectedField));
    const matchesLevel = !selectedLevel || scholarship.academicLevel.includes(selectedLevel);
    
    return matchesSearch && matchesCountry && matchesField && matchesLevel;
  });

  // Sort scholarships
  const sortedScholarships = [...filteredScholarships].sort((a, b) => {
    switch (sortBy) {
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'amount':
        return b.amount - a.amount;
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedScholarships.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedScholarships = sortedScholarships.slice(startIndex, startIndex + itemsPerPage);

  const handleSaveScholarship = (scholarshipId: string) => {
    if (savedScholarships.includes(scholarshipId)) {
      setSavedScholarships(prev => prev.filter(id => id !== scholarshipId));
    } else {
      setSavedScholarships(prev => [...prev, scholarshipId]);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect Scholarship
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Discover thousands of scholarship opportunities worldwide. Your dream education is within reach.
          </p>
          <div className="flex items-center justify-center space-x-8 text-blue-200">
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-400" />
              <span>{scholarships.length}+ Scholarships</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-5 w-5 mr-2 text-green-400" />
              <span>15+ Countries</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-400" />
              <span>$50M+ Available</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search scholarships..."
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
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="deadline">Deadline</option>
                <option value="amount">Amount</option>
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredScholarships.length} scholarship{filteredScholarships.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {paginatedScholarships.map((scholarship) => {
            const daysLeft = getDaysUntilDeadline(scholarship.deadline);
            const isUrgent = daysLeft <= 30 && daysLeft > 0;
            const isExpired = daysLeft <= 0;
            const isSaved = savedScholarships.includes(scholarship.id);

            return (
              <div
                key={scholarship.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative group ${
                  scholarship.featured 
                    ? 'ring-2 ring-gradient-to-r from-yellow-400 to-orange-500' 
                    : 'border border-gray-100 hover:border-blue-200'
                } ${isExpired ? 'opacity-60' : ''}`}
              >
                {/* Featured Badge */}
                {scholarship.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      ⭐ FEATURED
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={() => handleSaveScholarship(scholarship.id)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                      isSaved 
                        ? 'bg-red-500/20 text-red-600 hover:bg-red-500/30' 
                        : 'bg-white/20 text-gray-600 hover:bg-white/40 hover:text-red-500'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save scholarship'}
                  >
                    <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-6 pt-12">
                  {/* Provider Logo/Icon */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4 mx-auto shadow-lg">
                    <span className="text-xl font-bold">
                      {scholarship.provider.charAt(0)}
                    </span>
                  </div>

                  {/* Title and Provider */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {scholarship.title}
                      </h3>
                      <p className="text-gray-600 text-sm font-medium">{scholarship.provider}</p>
                    </div>
                  </div>

                  {/* Amount and Country */}
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-2">
                      {formatCurrency(scholarship.amount, scholarship.currency)}
                    </div>
                    <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      <MapPin className="h-4 w-4 mr-1" />
                      {scholarship.country}
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="mb-6">
                    <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                      isExpired 
                        ? 'bg-red-100 text-red-700' 
                        : isUrgent 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-blue-100 text-blue-700'
                    }`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      {isExpired ? (
                        'Expired'
                      ) : (
                        <>
                          {isUrgent ? `${daysLeft} days left` : `Due: ${scholarship.deadline.toLocaleDateString()}`}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Fields and Levels */}
                  <div className="space-y-3 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center text-sm text-gray-700 mb-1">
                        <Book className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="font-medium">Field:</span>
                      </div>
                      <div className="text-sm text-gray-600 truncate pl-6">{scholarship.fieldOfStudy.join(', ')}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center text-sm text-gray-700 mb-1">
                        <GraduationCap className="h-4 w-4 mr-2 text-green-500" />
                        <span className="font-medium">Level:</span>
                      </div>
                      <div className="text-sm text-gray-600 pl-6">{scholarship.academicLevel.join(', ')}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {scholarship.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {scholarship.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                    {scholarship.tags.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        +{scholarship.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-3">
                    <Link
                      to={`/scholarships/${scholarship.id}`}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      View Details
                    </Link>
                    {!isExpired && user && (
                      <button
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                        title="Apply for scholarship"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Apply</span>
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Hover Effect Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
            >
             Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-6 py-3 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
            >
             Next
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredScholarships.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No scholarships found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Try adjusting your search criteria to find more scholarships that match your needs.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCountry('');
                setSelectedField('');
                setSelectedLevel('');
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scholarships;