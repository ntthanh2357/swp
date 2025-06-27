import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Users, 
  Award, 
  MessageCircle, 
  Star, 
  Globe, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Target,
  Zap,
  CheckCircle,
  Play,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Building,
  MapPin
} from 'lucide-react';

const Home: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentUniversity, setCurrentUniversity] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    students: 0,
    advisors: 0,
    successRate: 0,
    countries: 0
  });

  const features = [
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: 'Scholarship Discovery',
      description: 'Access thousands of scholarship opportunities worldwide with AI-powered personalized recommendations.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'Expert Advisors',
      description: 'Connect with experienced advisors who specialize in your field and target countries.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-green-600" />,
      title: 'Real-time Support',
      description: 'Get immediate assistance through chat and video consultations with trusted advisors.',
      gradient: 'from-green-500 to-emerald-500'
    },
  ];

  const stats = [
    { number: 10000, label: 'Students Helped', suffix: '+' },
    { number: 500, label: 'Expert Advisors', suffix: '+' },
    { number: 95, label: 'Success Rate', suffix: '%' },
    { number: 50, label: 'Countries', suffix: '+' },
  ];

  const testimonials = [
    {
      name: 'Nguyễn Văn An',
      role: 'Computer Science Student',
      university: 'Stanford University',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      quote: 'ScholarConnect helped me secure a $50,000 scholarship to Stanford. The advisor guidance was invaluable!',
      rating: 5
    },
    {
      name: 'Trần Thị Bình',
      role: 'Medical Student',
      university: 'Harvard Medical School',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      quote: 'The personalized support and scholarship matching made my dream of studying medicine at Harvard a reality.',
      rating: 5
    },
    {
      name: 'Lê Minh Hoàng',
      role: 'Engineering Student',
      university: 'MIT',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      quote: 'Amazing platform! Found multiple scholarship opportunities and got expert advice throughout the process.',
      rating: 5
    }
  ];

  const universities = [
    {
      name: 'Harvard University',
      location: 'Cambridge, USA',
      image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
      scholarships: 45,
      type: 'Ivy League'
    },
    {
      name: 'Oxford University',
      location: 'Oxford, UK',
      image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
      scholarships: 38,
      type: 'Historic'
    },
    {
      name: 'Stanford University',
      location: 'California, USA',
      image: 'https://images.pexels.com/photos/1154638/pexels-photo-1154638.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
      scholarships: 52,
      type: 'Innovation Hub'
    },
    {
      name: 'MIT',
      location: 'Massachusetts, USA',
      image: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
      scholarships: 41,
      type: 'STEM Leader'
    },
    {
      name: 'Cambridge University',
      location: 'Cambridge, UK',
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
      scholarships: 39,
      type: 'Academic Excellence'
    },
    {
      name: 'ETH Zurich',
      location: 'Zurich, Switzerland',
      image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
      scholarships: 28,
      type: 'Tech Pioneer'
    },
    {
      name: 'University of Tokyo',
      location: 'Tokyo, Japan',
      image: 'https://images.pexels.com/photos/2835436/pexels-photo-2835436.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
      scholarships: 33,
      type: 'Asia Leader'
    },
    {
      name: 'Sorbonne University',
      location: 'Paris, France',
      image: 'https://images.pexels.com/photos/161901/paris-sunset-france-monument-161901.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
      scholarships: 31,
      type: 'Cultural Heritage'
    }
  ];

  const advisorHighlights = [
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'STEM Scholarships',
      rating: 4.9,
      reviews: 127,
      countries: ['USA', 'Canada', 'UK'],
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      badge: 'Top Rated'
    },
    {
      name: 'Prof. Michael Chen',
      specialty: 'Business & MBA',
      rating: 4.8,
      reviews: 89,
      countries: ['Singapore', 'Australia', 'Germany'],
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      badge: 'Expert'
    },
    {
      name: 'Dr. Emily Rodriguez',
      specialty: 'Medical Sciences',
      rating: 5.0,
      reviews: 156,
      countries: ['USA', 'Netherlands', 'Sweden'],
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      badge: 'Verified'
    },
  ];

  const recentScholarships = [
    {
      title: 'Google Developer Scholarship',
      amount: '$10,000',
      deadline: '2024-02-28',
      university: 'Google LLC',
      type: 'Technology'
    },
    {
      title: 'Harvard Merit Scholarship',
      amount: '$70,000',
      deadline: '2024-12-01',
      university: 'Harvard University',
      type: 'Academic Excellence'
    },
    {
      title: 'Oxford Rhodes Scholarship',
      amount: '£60,000',
      deadline: '2024-09-30',
      university: 'University of Oxford',
      type: 'Leadership'
    }
  ];

  // Animate stats on component mount
  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        callback(Math.floor(progress * (end - start) + start));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    const timer = setTimeout(() => {
      animateValue(0, 10000, 2000, (value) => setAnimatedStats(prev => ({ ...prev, students: value })));
      animateValue(0, 500, 2000, (value) => setAnimatedStats(prev => ({ ...prev, advisors: value })));
      animateValue(0, 95, 2000, (value) => setAnimatedStats(prev => ({ ...prev, successRate: value })));
      animateValue(0, 50, 2000, (value) => setAnimatedStats(prev => ({ ...prev, countries: value })));
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Auto-rotate universities
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUniversity((prev) => (prev + 1) % universities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [universities.length]);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                <span className="text-sm font-medium">🎉 Over 10,000 students helped!</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Your Gateway to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse">
                  Academic Excellence
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl">
                Connect with expert advisors, discover scholarship opportunities, and accelerate your academic journey with AI-powered personalized guidance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link
                  to="/register"
                  className="group bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="group border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Sign In</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-blue-200">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                  <span className="text-sm">Verified Advisors</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                  <span className="text-sm">Secure Platform</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                  <span className="text-sm">24/7 Support</span>
                </div>
              </div>
            </div>

            {/* University Showcase */}
            <div className="relative">
              <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Top Universities</h3>
                  <p className="text-blue-200">Where our students study</p>
                </div>
                
                <div className="relative h-64 rounded-xl overflow-hidden mb-4">
                  <img
                    src={universities[currentUniversity].image}
                    alt={universities[currentUniversity].name}
                    className="w-full h-full object-cover transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <h4 className="font-bold text-lg">{universities[currentUniversity].name}</h4>
                        <p className="text-sm opacity-90 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {universities[currentUniversity].location}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{universities[currentUniversity].scholarships}</div>
                        <div className="text-xs opacity-90">Scholarships</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-2 mb-4">
                  {universities.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentUniversity(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentUniversity ? 'bg-white' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {universities.slice(0, 6).map((uni, index) => (
                    <div key={index} className="text-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                         onClick={() => setCurrentUniversity(index)}>
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full overflow-hidden">
                        <img src={uni.image} alt={uni.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-xs font-medium truncate">{uni.name.split(' ')[0]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {index === 0 ? animatedStats.students.toLocaleString() : 
                   index === 1 ? animatedStats.advisors.toLocaleString() :
                   index === 2 ? animatedStats.successRate :
                   animatedStats.countries}{stat.suffix}
                </div>
                <div className="text-gray-600 font-medium">
                  {index === 0 ? 'Students Helped' :
                   index === 1 ? 'Expert Advisors' :
                   index === 2 ? 'Success Rate' :
                   'Countries'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* University Gallery Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Study at the World's Best Universities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our students have been accepted to prestigious universities worldwide with full scholarships.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {universities.map((university, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={university.image}
                    alt={university.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {university.type}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white">
                      <h3 className="font-bold text-lg mb-1">{university.name}</h3>
                      <p className="text-sm opacity-90 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {university.location}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {university.scholarships} Scholarships
                      </span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Learn More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional University Stats */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
                <div className="text-gray-600">Partner Universities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">$50M+</div>
                <div className="text-gray-600">Scholarships Secured</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">45</div>
                <div className="text-gray-600">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
                <div className="text-gray-600">Acceptance Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and support you need to find and secure scholarships.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {index === 0 ? 'Scholarship Discovery' :
                     index === 1 ? 'Expert Advisors' :
                     'Real-time Support'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {index === 0 ? 'Access thousands of scholarship opportunities worldwide with AI-powered personalized recommendations.' :
                     index === 1 ? 'Connect with experienced advisors who specialize in your field and target countries.' :
                     'Get immediate assistance through chat and video consultations with trusted advisors.'}
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">Learn More</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Scholarships Ticker */}
      <section className="py-12 bg-blue-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Zap className="h-6 w-6 text-yellow-400 mr-2" />
            <h3 className="text-xl font-semibold">Latest Scholarship Opportunities</h3>
          </div>
          <div className="flex space-x-8 animate-scroll">
            {[...recentScholarships, ...recentScholarships].map((scholarship, index) => (
              <div key={index} className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[300px]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{scholarship.title}</h4>
                  <span className="text-yellow-400 font-bold">{scholarship.amount}</span>
                </div>
                <p className="text-blue-200 text-sm">{scholarship.university}</p>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="bg-blue-500 px-2 py-1 rounded">{scholarship.type}</span>
                  <span>Deadline: {scholarship.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from students who achieved their dreams with ScholarConnect
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-blue-100">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg md:text-xl text-gray-700 mb-4 italic">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                    <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                    <div className="text-blue-600 font-medium">{testimonials[currentTestimonial].university}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Advisors Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Top Advisors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Work with experienced experts who have helped thousands of students achieve their academic goals.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {advisorHighlights.map((advisor, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="relative">
                  <img
                    src={advisor.image}
                    alt={advisor.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100 group-hover:border-blue-300 transition-colors"
                  />
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {advisor.badge}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-1">{advisor.name}</h3>
                  <p className="text-blue-600 text-sm mb-3">{advisor.specialty}</p>
                  <div className="flex items-center justify-center mb-3">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{advisor.rating}</span>
                    <span className="ml-1 text-sm text-gray-500">({advisor.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-1" />
                    <span>{advisor.countries.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/advisors"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2 transform hover:scale-105"
            >
              <span>View All Advisors</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with just a few simple steps and begin your journey to academic success.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Create Profile',
                description: 'Tell us about your academic goals and preferences',
                icon: <Users className="h-8 w-8" />,
                color: 'blue'
              },
              {
                step: '02',
                title: 'Find Advisors',
                description: 'Browse and connect with expert advisors in your field',
                icon: <Globe className="h-8 w-8" />,
                color: 'purple'
              },
              {
                step: '03',
                title: 'Book Sessions',
                description: 'Schedule consultations and choose the right package',
                icon: <Clock className="h-8 w-8" />,
                color: 'green'
              },
              {
                step: '04',
                title: 'Get Guidance',
                description: 'Receive personalized advice and scholarship opportunities',
                icon: <Award className="h-8 w-8" />,
                color: 'orange'
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-full flex items-center justify-center text-white mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {item.icon}
                  </div>
                  <div className={`absolute -top-2 -right-2 bg-${item.color}-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center`}>
                    {item.step}
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10">
                      <div className="h-full bg-gradient-to-r from-gray-300 to-transparent"></div>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Academic Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of students who found their path to success with ScholarConnect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 inline-flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg"
            >
              <span>Start Today</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/scholarships"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 inline-flex items-center justify-center space-x-2"
            >
              <BookOpen className="h-5 w-5" />
              <span>Browse Scholarships</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;