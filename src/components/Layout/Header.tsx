import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, User, LogOut, MessageCircle, Calendar, Settings, Award, Users, ShoppingBag, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AvatarUpload from '../AvatarUpload';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ScholarConnect</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/scholarships" className="text-gray-700 hover:text-blue-600 transition-colors">
              Scholarships
            </Link>
            <Link to="/advisors" className="text-gray-700 hover:text-blue-600 transition-colors">
              Find Advisors
            </Link>
            <Link to="/packages" className="text-gray-700 hover:text-blue-600 transition-colors">
              Consulting Packages
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About Us
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'student' && (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span className="hidden sm:inline">Orders</span>
                    </Link>
                    <Link
                      to="/chat"
                      className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Messages</span>
                    </Link>
                  </>
                )}
                {user.role === 'advisor' && (
                  <>
                    <Link
                      to="/advisor-dashboard"
                      className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
                    >
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <Link
                      to="/chat"
                      className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Messages</span>
                    </Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                    <Link
                      to="/chat"
                      className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Messages</span>
                    </Link>
                  </>
                )}
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <AvatarUpload
                      currentAvatar={user.avatar}
                      userName={user.name}
                      userId={user.id}
                      onAvatarChange={() => {}} // Header avatar is read-only
                      size="sm"
                      editable={false}
                    />
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-600 capitalize">{user.role}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <User className="h-4 w-4" />
                       <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                       <span>Settings</span>
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                       <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Close menu when clicking outside */}
                {showUserMenu && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;