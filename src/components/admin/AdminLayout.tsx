import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  Settings, 
  Home,
  ChevronRight 
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Overview',
      href: '/admin/overview',
      icon: LayoutDashboard,
      description: 'Dashboard overview and statistics'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      description: 'Manage students and advisors'
    },
    {
      name: 'Scholarships',
      href: '/admin/scholarships',
      icon: Award,
      description: 'Scholarship management'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      description: 'System configuration'
    }
  ];

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Home', href: '/' }];

    if (paths.length >= 1) {
      breadcrumbs.push({ name: 'Admin', href: '/admin' });
    }

    if (paths.length >= 2) {
      const section = paths[1];
      breadcrumbs.push({ 
        name: section.charAt(0).toUpperCase() + section.slice(1), 
        href: `/admin/${section}` 
      });
    }

    if (paths.length >= 3) {
      const id = paths[2];
      breadcrumbs.push({ 
        name: `Details (${id})`, 
        href: location.pathname 
      });
    }

    return breadcrumbs;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {getBreadcrumbs().map((breadcrumb, index) => (
              <li key={breadcrumb.href} className="inline-flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                )}
                <NavLink
                  to={breadcrumb.href}
                  className={`inline-flex items-center text-sm font-medium ${
                    index === getBreadcrumbs().length - 1
                      ? 'text-gray-500 cursor-default'
                      : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  {index === 0 && <Home className="w-4 h-4 mr-1" />}
                  {breadcrumb.name}
                </NavLink>
              </li>
            ))}
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your platform, users, and content from this central hub.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Navigation</h2>
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.href);
                  
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;