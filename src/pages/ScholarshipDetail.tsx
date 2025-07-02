import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  DollarSign, 
  MapPin, 
  GraduationCap, 
  FileText, 
  ExternalLink,
  Heart,
  ArrowLeft,
  CheckCircle,
  Clock,
  Book,
  Users,
  Star,
  Share2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useScholarships } from '../hooks/useScholarships';

const ScholarshipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    currentScholarship: scholarship, 
    loading, 
    error, 
    fetchScholarshipById,
    toggleSaveScholarship
  } = useScholarships();
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  useEffect(() => {
    if (id) {
      fetchScholarshipById(id);
    }
  }, [id]);

  const handleSaveScholarship = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (id) {
      try {
        await toggleSaveScholarship(id);
        
        // Show confirmation when saving
        if (!scholarship?.isSaved) {
          setShowSaveConfirmation(true);
          setTimeout(() => setShowSaveConfirmation(false), 3000);
        }
      } catch (error) {
        console.error('Error saving/unsaving scholarship:', error);
      }
    }
  };

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (scholarship?.applicationUrl) {
      window.open(scholarship.applicationUrl, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: scholarship?.title,
          text: scholarship?.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const now = new Date();
    const timeDiff = deadline.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            to="/scholarships"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scholarships
          </Link>
          
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-lg mb-8">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-5 w-5 mr-2" />
              <h3 className="font-bold">Error loading scholarship</h3>
            </div>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Scholarship not found</h2>
          <Link to="/scholarships" className="text-blue-600 hover:text-blue-700">
            ← Back to scholarships
          </Link>
        </div>
      </div>
    );
  }

  const daysLeft = getDaysUntilDeadline(scholarship.deadline);
  const isExpired = daysLeft <= 0;
  const isUrgent = daysLeft <= 30 && daysLeft > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success notification */}
      {showSaveConfirmation && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span>Scholarship saved to your library!</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link 
          to="/scholarships"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Scholarships
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  {scholarship.featured && (
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                      ⭐ FEATURED
                    </span>
                  )}
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    {scholarship.provider}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{scholarship.title}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">
                      {formatCurrency(scholarship.amount, scholarship.currency)}
                    </div>
                    <div className="text-blue-100">Award Amount</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{scholarship.country}</div>
                    <div className="text-blue-100">Study Location</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-1 ${
                      isExpired ? 'text-red-300' : isUrgent ? 'text-yellow-300' : 'text-white'
                    }`}>
                      {isExpired ? 'Expired' : `${daysLeft} days`}
                    </div>
                    <div className="text-blue-100">
                      {isExpired ? 'Application closed' : 'Until deadline'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3 ml-6">
                <button
                  onClick={handleSaveScholarship}
                  className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                    scholarship.isSaved 
                      ? 'bg-red-500/20 text-red-200 hover:bg-red-500/30' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${scholarship.isSaved ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
                >
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Scholarship</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{scholarship.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Eligibility Requirements</h2>
              <div className="space-y-3">
                {scholarship.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tags</h2>
              <div className="flex flex-wrap gap-3">
                {scholarship.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Key Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Deadline</div>
                    <div className="text-gray-600">{scholarship.deadline.toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Country</div>
                    <div className="text-gray-600">{scholarship.country}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Book className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Fields of Study</div>
                    <div className="text-gray-600">{scholarship.fieldOfStudy.join(', ')}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <GraduationCap className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Academic Level</div>
                    <div className="text-gray-600">{scholarship.academicLevel.join(', ')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Take Action</h3>
              
              <div className="space-y-4">
                {!isExpired && (
                  <button
                    onClick={handleApply}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>Apply Now</span>
                  </button>
                )}
                
                <button
                  onClick={handleSaveScholarship}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    scholarship.isSaved
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${scholarship.isSaved ? 'fill-current' : ''}`} />
                  <span>{scholarship.isSaved ? 'Remove from Saved' : 'Save Scholarship'}</span>
                </button>
                
                <Link
                  to="/advisors"
                  className="w-full bg-green-100 text-green-700 py-3 px-6 rounded-xl hover:bg-green-200 transition-colors font-semibold text-center block"
                >
                  Get Expert Help
                </Link>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Award Value</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(scholarship.amount, scholarship.currency)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Application Deadline</span>
                  <span className={`font-bold ${isExpired ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-blue-600'}`}>
                    {isExpired ? 'Closed' : `${daysLeft} days`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Competition Level</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipDetail;