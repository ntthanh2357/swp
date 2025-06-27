import React, { useState } from 'react';
import { Calendar, MessageCircle, Users, TrendingUp, Clock, Star, Edit, Save, X, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Advisor } from '../types';

const AdvisorDashboard: React.FC = () => {
  const { user } = useAuth();
  const advisor = user as Advisor;
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: advisor?.bio || '',
    specializations: advisor?.specializations ? advisor.specializations.join(', ') : '',
    countries: advisor?.countries ? advisor.countries.join(', ') : '',
    languages: advisor?.languages ? advisor.languages.join(', ') : '',
    hourlyRate: advisor?.hourlyRate || 0,
  });

  const upcomingConsultations = [
    {
      id: '1',
      studentName: 'Nguyễn Văn An',
      date: '2024-01-15',
      time: '10:00 AM',
      type: 'Scholarship Discovery',
      status: 'confirmed',
    },
    {
      id: '2',
      studentName: 'Trần Thị Bình',
      date: '2024-01-16',
      time: '2:00 PM',
      type: 'Application Support',
      status: 'pending',
    },
  ];

  const recentMessages = [
    {
      id: '1',
      studentName: 'Nguyễn Văn An',
      lastMessage: 'Thank you for the scholarship recommendations...',
      timestamp: '1 hour ago',
      unread: false,
    },
    {
      id: '2',
      studentName: 'Trần Thị Bình',
      lastMessage: 'Could you help me review my personal statement?',
      timestamp: '3 hours ago',
      unread: true,
    },
  ];

  const monthlyStats = {
    totalConsultations: 24,
    newStudents: 8,
    revenue: 1920,
    averageRating: 4.9,
  };

  const handleSaveProfile = () => {
    // In a real app, this would update the profile via API
    console.log('Saving profile:', profileData);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setProfileData({
      bio: advisor?.bio || '',
      specializations: advisor?.specializations ? advisor.specializations.join(', ') : '',
      countries: advisor?.countries ? advisor.countries.join(', ') : '',
      languages: advisor?.languages ? advisor.languages.join(', ') : '',
      hourlyRate: advisor?.hourlyRate || 0,
    });
    setIsEditingProfile(false);
  };

  if (!advisor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {advisor.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your consultations and help students achieve their academic goals.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{monthlyStats.totalConsultations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Students</p>
                <p className="text-2xl font-bold text-gray-900">{monthlyStats.newStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${monthlyStats.revenue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{monthlyStats.averageRating}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Management */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Management</h2>
                {!isEditingProfile ? (
                  <>
                    <Link
                      to="/create-scholarship"
                      className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Create Scholarship</span>
                    </Link>
                    <Link
                      to="/advisor-scholarships"
                      className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
                    >
                      <Award className="h-4 w-4" />
                      <span className="hidden sm:inline">My Scholarships</span>
                    </Link>
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  </>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center space-x-1 bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  {isEditingProfile ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-600">{advisor.bio}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileData.specializations}
                        onChange={(e) => setProfileData({ ...profileData, specializations: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Computer Science, Engineering"
                      />
                    ) : (
                      <p className="text-gray-600">{advisor.specializations ? advisor.specializations.join(', ') : ''}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Countries</label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileData.countries}
                        onChange={(e) => setProfileData({ ...profileData, countries: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="USA, Canada, UK"
                      />
                    ) : (
                      <p className="text-gray-600">{advisor.countries ? advisor.countries.join(', ') : ''}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileData.languages}
                        onChange={(e) => setProfileData({ ...profileData, languages: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="English, Spanish"
                      />
                    ) : (
                      <p className="text-gray-600">{advisor.languages ? advisor.languages.join(', ') : ''}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
                    {isEditingProfile ? (
                      <input
                        type="number"
                        value={profileData.hourlyRate}
                        onChange={(e) => setProfileData({ ...profileData, hourlyRate: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-600">${advisor.hourlyRate}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Consultations */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Consultations</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {upcomingConsultations.map((consultation) => (
                  <div key={consultation.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{consultation.type}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          consultation.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {consultation.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{consultation.studentName}</p>
                      <p className="text-sm text-gray-500">{consultation.date} at {consultation.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Recent Messages */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Messages</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <MessageCircle className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {message.studentName}
                        </p>
                        {message.unread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{message.lastMessage}</p>
                      <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Students Helped</span>
                  <span className="font-semibold text-gray-900">{advisor.totalStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold text-green-600">{advisor.successRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold text-gray-900">{advisor.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Reviews</span>
                  <span className="font-semibold text-gray-900">{advisor.reviewCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorDashboard;