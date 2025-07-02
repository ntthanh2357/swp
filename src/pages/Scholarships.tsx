import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, DollarSign, GraduationCap, Star, Heart, CheckCircle, FileText, Award, Globe, Book, Users, TrendingUp, ExternalLink, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { useScholarships } from '../hooks/useScholarships';
import { ScholarshipFilters } from '../types/scholarship';

const Scholarships: React.FC = () => {
  const { user } = useAuth();
  const {
    scholarships,
    totalScholarships,
    loading,
    error,
    filters,
    updateFilters,
    toggleSaveScholarship,
    savedScholarships
  } = useScholarships();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const countries = ['USA', 'UK', 'Germany', 'Australia', 'Canada', 'France', 'Japan', 'Switzerland', 'China', 'New Zealand'];
  const fields = ['Computer Science', 'Engineering', 'Business', 'Medicine', 'Arts', 'Social Sciences', 'All Fields'];
  const levels = ['Bachelor', 'Master', 'PhD', 'Postdoc'];

  // Apply filters when they change
  const handleFilterChange = () => {
    const newFilters: ScholarshipFilters = {
      search: searchQuery || undefined,
      country: selectedCountry || undefined,
      fieldOfStudy: selectedField || undefined,
      academicLevel: selectedLevel || undefined,
      sortBy: sortBy as any,
      page: currentPage,
      limit: itemsPerPage
    };
    
    updateFilters(newFilters);
  };

  // Apply filters when the search query, filters, or pagination changes
  React.useEffect(() => {
    handleFilterChange();
  }, [searchQuery, selectedCountry, selectedField, selectedLevel, sortBy, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(totalScholarships / itemsPerPage);

  // Handle saving/unsaving scholarships
  const handleSaveScholarship = async (scholarshipId: string) => {
    try {
      await toggleSaveScholarship(scholarshipId);
    } catch (error) {
      console.error('Error toggling save status:', error);
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
              {totalScholarships} scholarship{totalScholarships !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-lg mb-8">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-5 w-5 mr-2" />
              <h3 className="font-bold">Error loading scholarships</h3>
            </div>
            <p>{error}</p>
            <button 
              onClick={() => handleFilterChange()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {scholarships.map((scholarship) => {
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
        )}

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
        {scholarships.length === 0 && !loading && !error && (
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
                updateFilters({
                  page: 1,
                  limit: itemsPerPage
                });
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
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