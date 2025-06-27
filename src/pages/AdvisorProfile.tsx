import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Star, 
  Globe, 
  Clock, 
  Award,
  CheckCircle,
  MessageCircle,
  Calendar,
  BookOpen,
  Users,
  Heart,
  Share2,
  Phone,
  Video,
  Mail,
  MapPin,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Advisor } from '../types';

const AdvisorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  // Mock advisor data (in real app, fetch from API)
  const mockAdvisors: Advisor[] = [
    {
      id: '2',
      email: 'sarah.johnson@example.com',
      name: 'Dr. Sarah Johnson',
      role: 'advisor',
      status: 'approved',
      specializations: ['Computer Science', 'Engineering', 'Technology'],
      countries: ['USA', 'Canada', 'UK'],
      languages: ['English', 'Spanish'],
      experience: '10+ years in academic advising with focus on STEM scholarships. Former admissions officer at MIT and Stanford University.',
      education: 'PhD in Computer Science from MIT, MS in Education from Harvard',
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 80,
      availability: true,
      bio: 'Experienced academic advisor specializing in STEM scholarships and university admissions. I have helped over 500 students secure scholarships worth over $2M. My expertise includes application strategy, essay writing, interview preparation, and scholarship matching.',
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
      experience: '8 years in business school admissions and scholarship consulting. Former McKinsey consultant.',
      education: 'MBA from Harvard Business School, BS in Economics from Wharton',
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
      verified: true,
      totalStudents: 178,
      successRate: 88,
      createdAt: new Date(),
    }
  ];

  useEffect(() => {
    // Simulate API call
    const findAdvisor = mockAdvisors.find(a => a.id === id);
    setAdvisor(findAdvisor || null);
    
    // Check if saved
    const savedAdvisors = JSON.parse(localStorage.getItem('savedAdvisors') || '[]');
    setIsSaved(savedAdvisors.includes(id));
    
    setLoading(false);
  }, [id]);

  const handleSaveAdvisor = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const savedAdvisors = JSON.parse(localStorage.getItem('savedAdvisors') || '[]');
    
    if (isSaved) {
      // Remove from saved
      const updated = savedAdvisors.filter((savedId: string) => savedId !== id);
      localStorage.setItem('savedAdvisors', JSON.stringify(updated));
      setIsSaved(false);
    } else {
      // Add to saved
      const updated = [...savedAdvisors, id];
      localStorage.setItem('savedAdvisors', JSON.stringify(updated));
      setIsSaved(true);
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 3000);
    }
  };

  const handleBookPackage = (packageId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/packages?advisor=${id}&package=${packageId}`);
  };

  const handleSendMessage = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/chat');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!advisor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Advisor not found</h2>
          <Link to="/advisors" className="text-blue-600 hover:text-blue-700">
            ← Back to advisors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success notification */}
      {showSaveConfirmation && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span>Advisor saved to your library!</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link 
          to="/advisors"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Advisors
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-start space-x-6 mb-6 md:mb-0">
                <img
                  src={`https://images.pexels.com/photos/${advisor.id === '2' ? '1181690' : '1222271'}/pexels-photo-${advisor.id === '2' ? '1181690' : '1222271'}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`}
                  alt={advisor.name}
                  className="w-24 h-24 rounded-full border-4 border-white/20 object-cover"
                />
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold">{advisor.name}</h1>
                    {advisor.verified && (
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold">{advisor.rating}</span>
                      <span className="text-blue-100 ml-1">({advisor.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-blue-200 mr-1" />
                      <span>{advisor.totalStudents} students helped</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-yellow-400 mr-1" />
                      <span>{advisor.successRate}% success rate</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-blue-100">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      <span>{advisor.countries.join(', ')}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>From ${advisor.packages[0]?.price || advisor.hourlyRate}/session</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleSaveAdvisor}
                  className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                    isSaved 
                      ? 'bg-red-500/20 text-red-200 hover:bg-red-500/30' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                
                <button className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-300">
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">{advisor.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Education</h3>
                  <p className="text-gray-700">{advisor.education}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Experience</h3>
                  <p className="text-gray-700">{advisor.experience}</p>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Specializations</h2>
              <div className="flex flex-wrap gap-3">
                {advisor.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full font-medium border border-blue-200"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Languages</h2>
              <div className="flex flex-wrap gap-3">
                {advisor.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Packages */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Consulting Packages</h2>
              <div className="grid gap-6">
                {advisor.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`border rounded-xl p-6 transition-all duration-300 cursor-pointer ${
                      selectedPackage === pkg.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                      <div className="text-2xl font-bold text-blue-600">${pkg.price}</div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Duration: {pkg.duration} minutes
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookPackage(pkg.id);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="space-y-4">
                <button
                  onClick={handleSendMessage}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
                
                <button
                  onClick={handleSaveAdvisor}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isSaved
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? 'Remove from Saved' : 'Save Advisor'}</span>
                </button>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Availability</h3>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${advisor.availability ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="font-medium">
                  {advisor.availability ? 'Available for new students' : 'Fully booked'}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Usually responds within 24 hours</p>
                <p>• Video calls available</p>
                <p>• Flexible scheduling</p>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Performance</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-bold text-gray-900">{advisor.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-bold text-green-600">{advisor.successRate}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Students Helped</span>
                  <span className="font-bold text-blue-600">{advisor.totalStudents}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="font-bold text-gray-900">{advisor.reviewCount}</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Methods</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <MessageCircle className="h-5 w-5" />
                  <span>Chat messaging</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Video className="h-5 w-5" />
                  <span>Video calls</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="h-5 w-5" />
                  <span>Voice calls</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="h-5 w-5" />
                  <span>Email support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorProfile;