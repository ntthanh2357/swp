import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Ban, 
  Unlock,
  Award,
  BookOpen,
  MessageCircle,
  Clock,
  Globe,
  GraduationCap
} from 'lucide-react';
import { AdminUser, RouteParams } from './types';
import { validateId, formatDate, getStatusColor } from './utils';

const UserDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validation = validateId(id);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid user ID');
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data - in real app, fetch from API
        const mockUsers: { [key: string]: AdminUser } = {
          '1': {
            id: '1',
            name: 'Nguyễn Văn An',
            email: 'student@example.com',
            role: 'student',
            status: 'active',
            createdAt: new Date('2024-01-15'),
            lastLogin: new Date('2024-01-20'),
            profileComplete: true,
            emailVerified: true,
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1'
          },
          '2': {
            id: '2',
            name: 'Dr. Sarah Johnson',
            email: 'advisor@example.com',
            role: 'advisor',
            status: 'active',
            createdAt: new Date('2024-01-10'),
            lastLogin: new Date('2024-01-21'),
            profileComplete: true,
            emailVerified: true,
            avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1'
          },
          '3': {
            id: '3',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            status: 'active',
            createdAt: new Date('2023-12-01'),
            lastLogin: new Date('2024-01-21'),
            profileComplete: true,
            emailVerified: true
          }
        };

        const foundUser = mockUsers[id!];
        if (!foundUser) {
          setError('User not found');
        } else {
          setUser(foundUser);
        }
      } catch (err) {
        setError('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!user) return;

    try {
      // In real app, make API call
      console.log(`Changing user ${user.id} status to ${newStatus}`);
      
      setUser({ ...user, status: newStatus as any });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link
          to="/admin/users"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Users</span>
        </Link>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/users" replace />;
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link
        to="/admin/users"
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Users</span>
      </Link>

      {/* User Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
              )}
              <div className="text-white">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-blue-100">{user.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white capitalize">
                    {user.role}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)} text-white`}>
                    {user.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                <Edit className="h-5 w-5" />
              </button>
              {user.status === 'active' ? (
                <button
                  onClick={() => handleStatusChange('banned')}
                  className="p-2 bg-red-500/20 text-white rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Ban className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange('active')}
                  className="p-2 bg-green-500/20 text-white rounded-lg hover:bg-green-500/30 transition-colors"
                >
                  <Unlock className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{user.name}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{user.email}</span>
                  {user.emailVerified ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 capitalize">{user.role}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{formatDate(user.createdAt)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Role-specific Information */}
          {user.role === 'student' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Student Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">Computer Science</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Country</label>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">USA</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Level</label>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">Bachelor</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                  <span className="text-gray-900">3.8/4.0</span>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <p className="text-gray-900">
                  Aspiring computer science student looking for scholarships in the US. Interested in artificial intelligence and machine learning.
                </p>
              </div>
            </div>
          )}

          {user.role === 'advisor' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Advisor Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Computer Science</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Engineering</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Countries</label>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">USA, Canada, UK</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <span className="text-gray-900">10+ years</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                  <span className="text-gray-900">$80/hour</span>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">English</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Spanish</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <p className="text-gray-900">
                  Experienced academic advisor specializing in STEM scholarships and university admissions. 
                  I have helped over 500 students secure scholarships worth over $2M.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <span className="text-gray-900">Send Message</span>
              </button>

              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit className="h-5 w-5 text-green-600" />
                <span className="text-gray-900">Edit Profile</span>
              </button>

              {user.status === 'active' ? (
                <button
                  onClick={() => handleStatusChange('banned')}
                  className="w-full flex items-center space-x-3 p-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Ban className="h-5 w-5" />
                  <span>Ban User</span>
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange('active')}
                  className="w-full flex items-center space-x-3 p-3 border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <Unlock className="h-5 w-5" />
                  <span>Unban User</span>
                </button>
              )}
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email Verified</span>
                {user.emailVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Profile Complete</span>
                {user.profileComplete ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Account Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
            
            <div className="space-y-4">
              {user.role === 'student' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Applications</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Saved Scholarships</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Consultations</span>
                    <span className="font-medium">3</span>
                  </div>
                </>
              )}

              {user.role === 'advisor' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Students Helped</span>
                    <span className="font-medium">245</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium">4.9/5</span>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Messages Sent</span>
                <span className="font-medium">127</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;