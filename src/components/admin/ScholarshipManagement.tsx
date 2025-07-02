import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  DollarSign,
  Globe,
  Clock,
  TrendingUp,
  Users
} from 'lucide-react';
import { AdminScholarship } from './types'; 
import { getStatusColor, formatDate, formatCurrency } from './utils';
import supabase from '../../services/supabaseClient';

const ScholarshipManagement: React.FC = () => {
  const [scholarships, setScholarships] = useState<AdminScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedScholarships, setSelectedScholarships] = useState<string[]>([]);
  const scholarshipsPerPage = 10;

  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true);
      try {
        // Fetch scholarships from Supabase
        let query = supabase
          .from('scholarships')
          .select('*');

        // Apply filters if needed
        if (filterStatus !== 'all') {
          query = query.eq('status', filterStatus);
        }

        if (filterCountry !== 'all') {
          query = query.eq('country', filterCountry);
        }

        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,provider.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        // Transform data to match AdminScholarship interface
        const transformedData: AdminScholarship[] = data.map((item: any) => {
          // Determine status based on deadline
          let status = 'active';
          const deadline = new Date(item.deadline);
          if (deadline < new Date()) {
            status = 'expired';
          }

          return {
            id: item.id,
            title: item.title,
            provider: item.provider,
            amount: item.amount,
            currency: item.currency,
            deadline: new Date(item.deadline),
            country: item.country,
            status: item.status || status,
            applications: item.application_count || 0, // This would need a separate query in production
            createdBy: item.created_by,
            createdAt: new Date(item.created_at),
            featured: item.featured
          };
        });

        setScholarships(transformedData);
      } catch (err) {
        console.error("Error fetching scholarships:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, [searchQuery, filterStatus, filterCountry]);

  // Filter scholarships
  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || scholarship.status === filterStatus;
    const matchesCountry = filterCountry === 'all' || scholarship.country === filterCountry;
    
    return matchesSearch && matchesStatus && matchesCountry;
  });

  // Pagination
  const totalPages = Math.ceil(filteredScholarships.length / scholarshipsPerPage);
  const startIndex = (currentPage - 1) * scholarshipsPerPage;
  const paginatedScholarships = filteredScholarships.slice(startIndex, startIndex + scholarshipsPerPage);

  const handleScholarshipAction = async (scholarshipId: string, action: 'activate' | 'deactivate' | 'delete') => {
    try {
      console.log(`${action} scholarship ${scholarshipId}`);

      if (action === 'delete') {
        const { error } = await supabase
          .from('scholarships')
          .delete()
          .eq('id', scholarshipId);

        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from('scholarships')
          .update({ status: action === 'activate' ? 'active' : 'inactive' })
          .eq('id', scholarshipId);

        if (error) throw new Error(error.message);
      }
      
      if (action === 'delete') {
        setScholarships(prev => prev.filter(s => s.id !== scholarshipId));
      } else {
        setScholarships(prev => 
          prev.map(scholarship => 
            scholarship.id === scholarshipId 
              ? { ...scholarship, status: action === 'activate' ? 'active' : 'inactive' }
              : scholarship
          )
        );
      }
    } catch (error) {
      console.error('Error updating scholarship:', error);
    }
  };

  const handleBulkAction = async (action: string) => {
    try {
      console.log(`Bulk action: ${action} for scholarships:`, selectedScholarships);
      setSelectedScholarships([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Scholarship Management</h2>
            <p className="text-gray-600 mt-1">Manage scholarship opportunities and applications</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/create-scholarship"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Scholarship</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search scholarships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Countries</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Germany">Germany</option>
            <option value="Australia">Australia</option>
            <option value="Canada">Canada</option>
          </select>

          {selectedScholarships.length > 0 && (
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkAction(e.target.value);
                  e.target.value = '';
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Bulk Actions ({selectedScholarships.length})</option>
              <option value="activate">Activate Selected</option>
              <option value="deactivate">Deactivate Selected</option>
              <option value="delete">Delete Selected</option>
            </select>
          )}
        </div>

        {/* Scholarships Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedScholarships(paginatedScholarships.map(s => s.id));
                      } else {
                        setSelectedScholarships([]);
                      }
                    }}
                    checked={selectedScholarships.length === paginatedScholarships.length && paginatedScholarships.length > 0}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Scholarship</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Country</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Deadline</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Applications</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedScholarships.map((scholarship) => {
                const daysLeft = getDaysUntilDeadline(scholarship.deadline);
                const isExpired = daysLeft <= 0;
                const isUrgent = daysLeft <= 30 && daysLeft > 0;

                return (
                  <tr key={scholarship.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedScholarships.includes(scholarship.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedScholarships([...selectedScholarships, scholarship.id]);
                          } else {
                            setSelectedScholarships(selectedScholarships.filter(id => id !== scholarship.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900 flex items-center">
                          {scholarship.title}
                          {scholarship.featured && (
                            <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{scholarship.provider}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-green-600">
                        {formatCurrency(scholarship.amount, scholarship.currency)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{scholarship.country}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className={`text-sm ${
                        isExpired ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{scholarship.deadline.toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs mt-1">
                          {isExpired ? 'Expired' : `${daysLeft} days left`}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(scholarship.status)}`}>
                        {scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{scholarship.applications}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/scholarships/${scholarship.id}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                          title="Edit Scholarship"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleScholarshipAction(scholarship.id, 'delete')}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Scholarship"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + scholarshipsPerPage, filteredScholarships.length)} of {filteredScholarships.length} scholarships
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipManagement;