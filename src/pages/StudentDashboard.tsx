import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Calendar, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Star,
  ChevronRight,
  Plus,
  Heart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'deadline',
      title: 'Scholarship Deadline Approaching',
      message: 'Microsoft Scholarship application deadline is in 5 days',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'update',
      title: 'Application Status Update',
      message: 'Your Fulbright application is under review',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'recommendation',
      title: 'New Scholarship Match',
      message: 'We found 3 new scholarships that match your profile',
      time: '2 days ago',
      read: true
    }
  ]);

  const [applications] = useState([
    {
      id: 1,
      scholarship: 'Microsoft Scholarship Program',
      status: 'pending',
      deadline: '2024-03-15',
      amount: '$5,000',
      progress: 75
    },
    {
      id: 2,
      scholarship: 'Google Developer Scholarship',
      status: 'submitted',
      deadline: '2024-02-28',
      amount: '$10,000',
      progress: 100
    },
    {
      id: 3,
      scholarship: 'Fulbright Foreign Student Program',
      status: 'under_review',
      deadline: '2024-10-15',
      amount: '$30,000',
      progress: 100
    }
  ]);

  const [upcomingDeadlines] = useState([
    {
      id: 1,
      scholarship: 'Rhodes Scholarship',
      deadline: '2024-09-30',
      daysLeft: 45,
      amount: '£70,000'
    },
    {
      id: 2,
      scholarship: 'Gates Cambridge Scholarship',
      deadline: '2024-12-15',
      daysLeft: 120,
      amount: '£50,000'
    },
    {
      id: 3,
      scholarship: 'Chevening Scholarships',
      deadline: '2024-11-01',
      daysLeft: 75,
      amount: '£25,000'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'submitted': return 'text-blue-600 bg-blue-100';
      case 'under_review': return 'text-purple-600 bg-purple-100';
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'submitted': return 'Submitted';
      case 'under_review': return 'Under Review';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-gray-600">
            Track your scholarship applications and discover new opportunities.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applied Value</p>
                <p className="text-2xl font-bold text-gray-900">$45,000</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(a => a.status === 'under_review').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">68%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Applications */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Applications</h2>
                <Link 
                  to="/scholarships"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Browse More →
                </Link>
              </div>

              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{application.scholarship}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>Amount: {application.amount}</span>
                      <span>Deadline: {new Date(application.deadline).toLocaleDateString()}</span>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900 font-medium">{application.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${application.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Details
                      </button>
                      {application.status === 'pending' && (
                        <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                          Complete Application
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Deadlines</h2>
              
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{deadline.scholarship}</h3>
                      <p className="text-sm text-gray-600">Value: {deadline.amount}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        deadline.daysLeft <= 30 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {deadline.daysLeft} days left
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(deadline.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {notification.type === 'deadline' && (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        )}
                        {notification.type === 'update' && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                        {notification.type === 'recommendation' && (
                          <Star className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link 
                  to="/scholarships"
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Plus className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-blue-900 font-medium">Find New Scholarships</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-blue-600" />
                </Link>

                <Link 
                  to="/profile"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-gray-900 font-medium">Update Profile</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </Link>

                <Link 
                  to="/library"
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="text-purple-900 font-medium">My Library</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-purple-600" />
                </Link>

                <Link 
                  to="/advisors"
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-green-900 font-medium">Book Consultation</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-green-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;