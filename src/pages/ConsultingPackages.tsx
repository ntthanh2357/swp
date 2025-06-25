import React, { useState } from 'react';
import { Check, Star, Clock, Users, MessageCircle, Video, FileText, Award, CreditCard, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  duration: string;
  features: string[];
  popular?: boolean;
  recommended?: boolean;
  icon: React.ReactNode;
  color: string;
  includes: {
    sessions: number;
    duration: string;
    support: string;
    materials: string[];
  };
}

const ConsultingPackages: React.FC = () => {
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const packages: Package[] = [
    {
      id: 'starter',
      name: 'Scholarship Discovery',
      description: 'Perfect for students just starting their scholarship journey',
      price: 49,
      originalPrice: 69,
      duration: '30 minutes',
      popular: false,
      icon: <Award className="h-8 w-8" />,
      color: 'blue',
      features: [
        'Personalized scholarship recommendations',
        'Application timeline planning',
        'Initial guidance and tips',
        'Resource list and links',
        'Email follow-up summary'
      ],
      includes: {
        sessions: 1,
        duration: '30 minutes',
        support: 'Email support for 1 week',
        materials: ['Scholarship checklist', 'Application timeline template']
      }
    },
    {
      id: 'professional',
      name: 'Application Support',
      description: 'Comprehensive assistance for your scholarship applications',
      price: 149,
      originalPrice: 199,
      duration: '60 minutes',
      popular: true,
      recommended: true,
      icon: <FileText className="h-8 w-8" />,
      color: 'purple',
      features: [
        'Document review and feedback',
        'Personal statement guidance',
        'Interview preparation',
        'Application strategy development',
        'Deadline management',
        'Follow-up email support',
        'Resource library access'
      ],
      includes: {
        sessions: 1,
        duration: '60 minutes',
        support: 'Email support for 2 weeks',
        materials: ['Essay templates', 'Interview guide', 'Application tracker']
      }
    },
    {
      id: 'premium',
      name: 'Complete Mentorship',
      description: 'Full support throughout your entire scholarship journey',
      price: 399,
      originalPrice: 549,
      duration: '3 sessions',
      popular: false,
      icon: <Users className="h-8 w-8" />,
      color: 'green',
      features: [
        '3 comprehensive consultation sessions',
        'Ongoing email support',
        'Document templates and guides',
        'Success tracking and monitoring',
        'Priority scheduling',
        'Video call sessions',
        'Personalized action plan',
        'Application review service'
      ],
      includes: {
        sessions: 3,
        duration: '60 minutes each',
        support: 'Email support for 1 month',
        materials: ['Complete application kit', 'Success tracking dashboard', 'Priority advisor access']
      }
    }
  ];

  const testimonials = [
    {
      name: 'Nguyễn Văn An',
      package: 'Complete Mentorship',
      result: 'Secured $50,000 scholarship to Stanford',
      rating: 5,
      comment: 'The mentorship program was incredible. My advisor helped me every step of the way.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
    },
    {
      name: 'Trần Thị Bình',
      package: 'Application Support',
      result: 'Accepted to Harvard Medical School',
      rating: 5,
      comment: 'The application support was exactly what I needed. Highly recommended!',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
    }
  ];

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowPaymentModal(true);
  };

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border' | 'hover') => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-600',
        hover: 'hover:bg-blue-700'
      },
      purple: {
        bg: 'bg-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-600',
        hover: 'hover:bg-purple-700'
      },
      green: {
        bg: 'bg-green-600',
        text: 'text-green-600',
        border: 'border-green-600',
        hover: 'hover:bg-green-700'
      }
    };
    return colorMap[color as keyof typeof colorMap][variant];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your Success Path
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Get personalized guidance from expert advisors and unlock scholarship opportunities worth millions
          </p>
          <div className="flex items-center justify-center space-x-8 text-blue-200">
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-400" />
              <span>Expert Advisors</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-400" />
              <span>Proven Results</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-400" />
              <span>Money-back Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">$50M+</div>
              <div className="text-gray-600">Scholarships Secured</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">10,000+</div>
              <div className="text-gray-600">Students Helped</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-gray-600">Expert Advisors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Consulting Package
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the perfect package for your scholarship journey. All packages include expert guidance and proven strategies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                  pkg.popular ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 text-sm font-bold">
                    🔥 MOST POPULAR
                  </div>
                )}
                
                {pkg.recommended && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                    RECOMMENDED
                  </div>
                )}

                <div className={`p-8 ${pkg.popular ? 'pt-12' : ''}`}>
                  {/* Package Header */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-3 rounded-full ${getColorClasses(pkg.color, 'bg')} bg-opacity-10 mb-4`}>
                      <div className={getColorClasses(pkg.color, 'text')}>
                        {pkg.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    
                    {/* Pricing */}
                    <div className="mb-6">
                      <div className="flex items-center justify-center space-x-2">
                        {pkg.originalPrice && (
                          <span className="text-2xl text-gray-400 line-through">${pkg.originalPrice}</span>
                        )}
                        <span className="text-4xl font-bold text-gray-900">${pkg.price}</span>
                      </div>
                      <div className="text-gray-600 mt-1">{pkg.duration}</div>
                      {pkg.originalPrice && (
                        <div className="text-green-600 font-medium mt-1">
                          Save ${pkg.originalPrice - pkg.price}!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Package Includes */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Package Includes:</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {pkg.includes.sessions} session(s) - {pkg.includes.duration}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {pkg.includes.support}
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {pkg.includes.materials.join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPackage(pkg.id)}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors ${getColorClasses(pkg.color, 'bg')} ${getColorClasses(pkg.color, 'hover')} transform hover:scale-105`}
                  >
                    {user ? 'Select Package' : 'Sign Up to Continue'}
                  </button>

                  {/* Money-back guarantee */}
                  <div className="text-center mt-4">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <Shield className="h-4 w-4 mr-1" />
                      30-day money-back guarantee
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Benefits */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">All Packages Include</h3>
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Video className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Video Consultations</h4>
                <p className="text-sm text-gray-600">Face-to-face guidance with expert advisors</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Document Review</h4>
                <p className="text-sm text-gray-600">Professional review of your applications</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Ongoing Support</h4>
                <p className="text-sm text-gray-600">Email and chat support throughout your journey</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Award className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold mb-2">Success Guarantee</h4>
                <p className="text-sm text-gray-600">We're committed to your success</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how our consulting packages have helped students achieve their dreams
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.package} Package</p>
                    <div className="flex items-center mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-lg font-semibold text-green-600 mb-2">
                    🎉 {testimonial.result}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "What happens after I purchase a package?",
                answer: "You'll receive an email confirmation with next steps, including how to schedule your first session and access your materials."
              },
              {
                question: "Can I upgrade my package later?",
                answer: "Yes! You can upgrade to a higher-tier package at any time. We'll credit your previous purchase toward the new package."
              },
              {
                question: "What if I'm not satisfied with the service?",
                answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied, we'll refund your purchase."
              },
              {
                question: "How quickly can I start my consultation?",
                answer: "Most consultations can be scheduled within 24-48 hours of purchase, depending on advisor availability."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && selectedPackage && (
        <PaymentModal
          package={packages.find(p => p.id === selectedPackage)!}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPackage(null);
          }}
        />
      )}
    </div>
  );
};

// Payment Modal Component
interface PaymentModalProps {
  package: Package;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ package: pkg, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'vnpay' | 'momo' | 'bank'>('stripe');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'payment' | 'confirmation'>('payment');

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setStep('confirmation');
      
      // Send confirmation email (simulated)
      console.log('Sending confirmation email...');
    }, 2000);
  };

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border' | 'hover') => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-600',
        hover: 'hover:bg-blue-700'
      },
      purple: {
        bg: 'bg-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-600',
        hover: 'hover:bg-purple-700'
      },
      green: {
        bg: 'bg-green-600',
        text: 'text-green-600',
        border: 'border-green-600',
        hover: 'hover:bg-green-700'
      }
    };
    return colorMap[color as keyof typeof colorMap][variant];
  };

  if (step === 'confirmation') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for purchasing the {pkg.name} package. You'll receive a confirmation email shortly with next steps.
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Package:</span>
              <span className="font-medium">{pkg.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">${pkg.price}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">#SC{Date.now().toString().slice(-6)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Package Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{pkg.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">${pkg.price}</span>
              {pkg.originalPrice && (
                <span className="text-lg text-gray-400 line-through">${pkg.originalPrice}</span>
              )}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('stripe')}
                className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  paymentMethod === 'stripe' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">Credit Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod('vnpay')}
                className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  paymentMethod === 'vnpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium">VNPay</span>
              </button>
              <button
                onClick={() => setPaymentMethod('momo')}
                className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  paymentMethod === 'momo' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium">MoMo</span>
              </button>
              <button
                onClick={() => setPaymentMethod('bank')}
                className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  paymentMethod === 'bank' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium">Bank Transfer</span>
              </button>
            </div>
          </div>

          {/* Payment Form */}
          {paymentMethod === 'stripe' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'bank' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">Bank Transfer Details</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Bank:</strong> Vietcombank</p>
                <p><strong>Account:</strong> 1234567890</p>
                <p><strong>Name:</strong> ScholarConnect Ltd</p>
                <p><strong>Amount:</strong> ${pkg.price}</p>
                <p><strong>Reference:</strong> SC{Date.now().toString().slice(-6)}</p>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Shield className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-colors ${getColorClasses(pkg.color, 'bg')} ${getColorClasses(pkg.color, 'hover')} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `Pay $${pkg.price}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultingPackages;