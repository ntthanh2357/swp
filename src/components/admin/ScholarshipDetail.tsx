import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Award, 
  DollarSign, 
  Calendar, 
  Globe, 
  Users, 
  Eye, 
  Edit, 
  Trash2,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Star
} from 'lucide-react';
import { AdminScholarship, RouteParams } from './types';
import { validateId, formatDate, formatCurrency, getStatusColor } from './utils';
import supabase from '../../services/supabaseClient';

const ScholarshipDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [scholarship, setScholarship] = useState<AdminScholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validation = validateId(id);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid scholarship ID');
      setLoading(false);
      return;
    }

    const fetchScholarship = async () => {
      try {
        setLoading(true);

        // Fetch scholarship from Supabase
        const { data, error } = await supabase
          .from('scholarships')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (!data) {
          setError('Scholarship not found');
          return;
        }

        // Fetch application count
        const { count } = await supabase
          .from('saved_scholarships')
          .select('id', { count: 'exact' })
          .eq('scholarship_id', id);
        
        // Determine status based on deadline
        let status = data.status || 'active';
        if (new Date(data.deadline) < new Date() && status === 'active') {
          status = 'expired';
        }

        // Transform data to match AdminScholarship interface
        const scholarship: AdminScholarship = {
          id: data.id,
          title: data.title,
          provider: data.provider,
          amount: data.amount,
          currency: data.currency,
          deadline: new Date(data.deadline),
          country: data.country,
          status: status,
          applications: count || 0,
          createdBy: data.created_by,
          createdAt: new Date(data.created_at),
          featured: data.featured
        };
        
        setScholarship(scholarship);
      } catch (err) {
        setError('Failed to fetch scholarship details');
      } finally {
        setLoading(false);
      }
    };

    fetchScholarship();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!scholarship) return;

    try {
      console.log(`Changing scholarship ${scholarship.id} status to ${newStatus}`);
      
      // Update scholarship status in Supabase
      const { error } = await supabase
        .from('scholarships')
        .update({ status: newStatus })
        .eq('id', scholarship.id);

      if (error) throw new Error(error.message);
      
      setScholarship({ ...scholarship, status: newStatus as any });
    } catch (error) {
      console.error('Error updating scholarship status:', error);
    }
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const now = new Date();
    const timeDiff = deadline.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
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
          to="/admin/scholarships"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Scholarships</span>
        </Link>
      </div>
    );
  }

  if (!scholarship) {
    return <Navigate to="/admin/scholarships" replace />;
  }

  const daysLeft = getDaysUntilDeadline(scholarship.deadline);
  const isExpired = daysLeft <= 0;
  const isUrgent = daysLeft <= 30 && daysLeft > 0;

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link
        to="/admin/scholarships"
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Scholarships</span>
      </Link>

      {/* Scholarship Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{scholarship.title}</h1>
                {scholarship.featured && (
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                    ⭐ FEATURED
                  </span>
                )}
              </div>
              <p className="text-blue-100 mb-2">{scholarship.provider}</p>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(scholarship.status)} text-white`}>
                  {scholarship.status}
                </span>
                <span className="text-blue-100">
                  Created {formatDate(scholarship.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                <Edit className="h-5 w-5" />
              </button>
              <button className="p-2 bg-red-500/20 text-white rounded-lg hover:bg-red-500/30 transition-colors">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Scholarship Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Award Amount</label>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(scholarship.amount, scholarship.currency)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-900">{scholarship.country}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="text-gray-900">{scholarship.deadline.toLocaleDateString()}</div>
                    <div className={`text-sm ${
                      isExpired ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-500'
                    }`}>
                      {isExpired ? 'Expired' : `${daysLeft} days remaining`}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(scholarship.status)}`}>
                  {scholarship.status === 'active' && <CheckCircle className="h-4 w-4 mr-1" />}
                  {scholarship.status === 'expired' && <XCircle className="h-4 w-4 mr-1" />}
                  {scholarship.status === 'draft' && <Clock className="h-4 w-4 mr-1" />}
                  {scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Applications Received</label>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <span className="text-2xl font-bold text-gray-900">{scholarship.applications}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Created By</label>
                <div className="text-gray-900">{scholarship.createdBy}</div>
              </div>
            </div>
          </div>

          {/* Description and Requirements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Description & Requirements</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {scholarship.id === '1' ? 
                    'Supporting diversity in technology through education. This comprehensive scholarship program aims to increase representation in STEM fields and provide opportunities for underrepresented students to pursue their academic goals in technology-related disciplines.' :
                    'Supporting the next generation of developers and innovators. Recipients gain access to mentorship, internship opportunities, and Google developer resources.'
                  }
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Eligibility Requirements</h3>
                <ul className="space-y-2">
                  {scholarship.id === '1' ? [
                    'GPA 3.0+',
                    'STEM field',
                    'Leadership experience',
                    'Financial need'
                  ] : [
                    'Programming skills',
                    'Open source contributions',
                    'Portfolio projects'
                  ].map((requirement, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Fields of Study</h3>
                <div className="flex flex-wrap gap-2">
                  {scholarship.id === '1' ? 
                    ['Computer Science', 'Engineering', 'Technology'].map((field, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {field}
                      </span>
                    )) :
                    ['Computer Science', 'Software Engineering', 'Web Development'].map((field, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {field}
                      </span>
                    ))
                  }
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Academic Levels</h3>
                <div className="flex flex-wrap gap-2">
                  {['Bachelor', 'Master'].map((level, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {level}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye className="h-5 w-5 text-blue-600" />
                <span className="text-gray-900">View Public Page</span>
              </button>

              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit className="h-5 w-5 text-green-600" />
                <span className="text-gray-900">Edit Scholarship</span>
              </button>

              {scholarship.status === 'active' ? (
                <button
                  onClick={() => handleStatusChange('inactive')}
                  className="w-full flex items-center space-x-3 p-3 border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                  <span>Deactivate</span>
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange('active')}
                  className="w-full flex items-center space-x-3 p-3 border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Activate</span>
                </button>
              )}

              <button className="w-full flex items-center space-x-3 p-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="h-5 w-5" />
                <span>Delete Scholarship</span>
              </button>
            </div>
          </div>

          {/* Application Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Statistics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Applications</span>
                <span className="font-bold text-2xl text-gray-900">{scholarship.applications}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">This Month</span>
                <div className="flex items-center space-x-1">
                  <span className="font-medium">+23</span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average per Day</span>
                <span className="font-medium">4.2</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-medium">78%</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full text-blue-600 hover:text-blue-800 font-medium text-sm">
                View All Applications →
              </button>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Views</span>
                <span className="font-medium">2,341</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Saves</span>
                <span className="font-medium">156</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-medium">5.4%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rating</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">4.8</span>
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