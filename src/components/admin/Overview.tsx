import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Award, 
  TrendingUp, 
  DollarSign,
  UserPlus,
  FileText,
  Calendar,
  BarChart3
} from 'lucide-react';
import { AdminStats } from './types';
import { formatCurrency } from './utils';

const Overview: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalAdvisors: 0,
    totalScholarships: 0,
    activeScholarships: 0,
    totalApplications: 0,
    monthlyGrowth: {
      users: 0,
      scholarships: 0,
      applications: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch admin statistics
    const fetchStats = async () => {
      setLoading(true);
      
      // Mock data - in real app, fetch from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalUsers: 1247,
        totalStudents: 892,
        totalAdvisors: 355,
        totalScholarships: 156,
        activeScholarships: 124,
        totalApplications: 3456,
        monthlyGrowth: {
          users: 12.5,
          scholarships: 8.3,
          applications: 15.7
        }
      });
      
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'blue',
      growth: stats.monthlyGrowth.users,
      description: 'Registered users'
    },
    {
      title: 'Students',
      value: stats.totalStudents.toLocaleString(),
      icon: UserPlus,
      color: 'green',
      growth: stats.monthlyGrowth.users * 0.7,
      description: 'Active students'
    },
    {
      title: 'Advisors',
      value: stats.totalAdvisors.toLocaleString(),
      icon: Award,
      color: 'purple',
      growth: stats.monthlyGrowth.users * 0.3,
      description: 'Verified advisors'
    },
    {
      title: 'Scholarships',
      value: stats.totalScholarships.toLocaleString(),
      icon: FileText,
      color: 'orange',
      growth: stats.monthlyGrowth.scholarships,
      description: 'Available scholarships'
    },
    {
      title: 'Applications',
      value: stats.totalApplications.toLocaleString(),
      icon: TrendingUp,
      color: 'red',
      growth: stats.monthlyGrowth.applications,
      description: 'Total applications'
    },
    {
      title: 'Active Scholarships',
      value: stats.activeScholarships.toLocaleString(),
      icon: Calendar,
      color: 'indigo',
      growth: stats.monthlyGrowth.scholarships * 0.8,
      description: 'Currently available'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user_registration',
      message: 'New student registered: John Doe',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: UserPlus,
      color: 'green'
    },
    {
      id: 2,
      type: 'scholarship_added',
      message: 'New scholarship added: Google Developer Program',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      icon: Award,
      color: 'blue'
    },
    {
      id: 3,
      type: 'advisor_approved',
      message: 'Advisor application approved: Dr. Sarah Johnson',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      icon: Users,
      color: 'purple'
    },
    {
      id: 4,
      type: 'application_submitted',
      message: '15 new scholarship applications submitted',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      icon: FileText,
      color: 'orange'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${card.color}-100`}>
                  <Icon className={`h-6 w-6 text-${card.color}-600`} />
                </div>
                <div className={`flex items-center text-sm ${
                  card.growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {card.growth > 0 ? '+' : ''}{card.growth.toFixed(1)}%
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-full bg-${activity.color}-100`}>
                    <Icon className={`h-4 w-4 text-${activity.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.timestamp.toLocaleTimeString()} - {activity.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <UserPlus className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Add New User</div>
                  <div className="text-sm text-gray-600">Create student or advisor account</div>
                </div>
              </div>
              <div className="text-gray-400">→</div>
            </button>

            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Create Scholarship</div>
                  <div className="text-sm text-gray-600">Add new scholarship opportunity</div>
                </div>
              </div>
              <div className="text-gray-400">→</div>
            </button>

            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Review Applications</div>
                  <div className="text-sm text-gray-600">Manage pending advisor requests</div>
                </div>
              </div>
              <div className="text-gray-400">→</div>
            </button>

            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="font-medium text-gray-900">View Analytics</div>
                  <div className="text-sm text-gray-600">Detailed platform statistics</div>
                </div>
              </div>
              <div className="text-gray-400">→</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;