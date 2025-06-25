import React, { useState } from 'react';
import { Calendar, Download, Eye, Star, MessageCircle, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: string;
  packageName: string;
  packageType: 'starter' | 'professional' | 'premium';
  amount: number;
  status: 'completed' | 'active' | 'pending' | 'cancelled';
  purchaseDate: Date;
  expiryDate?: Date;
  paymentMethod: string;
  advisorName?: string;
  sessionsUsed: number;
  totalSessions: number;
  materials: string[];
  rating?: number;
  review?: string;
}

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  // Mock order data
  const orders: Order[] = [
    {
      id: 'ORD-001',
      packageName: 'Complete Mentorship',
      packageType: 'premium',
      amount: 399,
      status: 'active',
      purchaseDate: new Date('2024-01-10'),
      expiryDate: new Date('2024-02-10'),
      paymentMethod: 'Credit Card',
      advisorName: 'Dr. Sarah Johnson',
      sessionsUsed: 1,
      totalSessions: 3,
      materials: ['Complete application kit', 'Success tracking dashboard', 'Priority advisor access']
    },
    {
      id: 'ORD-002',
      packageName: 'Application Support',
      packageType: 'professional',
      amount: 149,
      status: 'completed',
      purchaseDate: new Date('2023-12-15'),
      paymentMethod: 'VNPay',
      advisorName: 'Prof. Michael Chen',
      sessionsUsed: 1,
      totalSessions: 1,
      materials: ['Essay templates', 'Interview guide', 'Application tracker'],
      rating: 5,
      review: 'Excellent service! My advisor was very helpful and professional.'
    },
    {
      id: 'ORD-003',
      packageName: 'Scholarship Discovery',
      packageType: 'starter',
      amount: 49,
      status: 'completed',
      purchaseDate: new Date('2023-11-20'),
      paymentMethod: 'MoMo',
      advisorName: 'Dr. Emily Rodriguez',
      sessionsUsed: 1,
      totalSessions: 1,
      materials: ['Scholarship checklist', 'Application timeline template'],
      rating: 4,
      review: 'Good introduction to scholarship opportunities.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'active':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleDownloadMaterials = (orderId: string) => {
    // Simulate download
    console.log(`Downloading materials for order ${orderId}`);
    // In real app, this would trigger a download or open materials
  };

  const handleSubmitReview = () => {
    console.log('Submitting review:', reviewData);
    setShowReviewModal(false);
    setReviewData({ rating: 5, comment: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-2">
            View your consulting package purchases and access your materials
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Packages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${orders.reduce((sum, order) => sum + order.amount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sessions Used</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.reduce((sum, order) => sum + order.sessionsUsed, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.packageName}</h3>
                      <p className="text-sm text-gray-600">Order #{order.id}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">${order.amount}</div>
                    <div className="text-sm text-gray-600">{order.paymentMethod}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Purchase Date</div>
                    <div className="text-sm text-gray-600">
                      {order.purchaseDate.toLocaleDateString()}
                    </div>
                  </div>
                  {order.expiryDate && (
                    <div>
                      <div className="text-sm font-medium text-gray-700">Expires</div>
                      <div className="text-sm text-gray-600">
                        {order.expiryDate.toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-700">Advisor</div>
                    <div className="text-sm text-gray-600">{order.advisorName}</div>
                  </div>
                </div>

                {/* Progress Bar for Active Orders */}
                {order.status === 'active' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Sessions Progress</span>
                      <span className="text-gray-600">
                        {order.sessionsUsed} of {order.totalSessions} used
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(order.sessionsUsed / order.totalSessions) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Rating for Completed Orders */}
                {order.status === 'completed' && order.rating && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < order.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {order.review && (
                      <p className="text-sm text-gray-600 mt-1 italic">"{order.review}"</p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => handleDownloadMaterials(order.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Materials</span>
                  </button>

                  {order.status === 'active' && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>Schedule Session</span>
                    </button>
                  )}

                  {order.status === 'completed' && !order.rating && (
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                    >
                      <Star className="h-4 w-4" />
                      <span>Leave Review</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-medium">{selectedOrder.packageName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">${selectedOrder.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1 capitalize">{selectedOrder.status}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Materials */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Included Materials</h3>
                  <div className="space-y-2">
                    {selectedOrder.materials.map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{material}</span>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Session Progress */}
                {selectedOrder.status === 'active' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Progress</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Sessions Used:</span>
                        <span className="font-medium">
                          {selectedOrder.sessionsUsed} of {selectedOrder.totalSessions}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${(selectedOrder.sessionsUsed / selectedOrder.totalSessions) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Leave a Review</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                        className={`text-2xl ${
                          star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share your experience..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;