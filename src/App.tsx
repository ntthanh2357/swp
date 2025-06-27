import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Scholarships from './pages/Scholarships';
import ScholarshipDetail from './pages/ScholarshipDetail';
import Advisors from './pages/Advisors';
import AdvisorProfile from './pages/AdvisorProfile';
import ConsultingPackages from './pages/ConsultingPackages';
import OrderHistory from './pages/OrderHistory';
import StudentDashboard from './pages/StudentDashboard';
import AdvisorDashboard from './pages/AdvisorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdvisorScholarships from './pages/AdvisorScholarships';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Library from './pages/Library';
import About from './pages/About';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/scholarships" element={<Scholarships />} />
              <Route path="/scholarships/:id" element={<ScholarshipDetail />} />
              <Route path="/advisors" element={<Advisors />} />
              <Route path="/advisors/:id" element={<AdvisorProfile />} />
              <Route path="/packages" element={<ConsultingPackages />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/advisor-dashboard" element={<AdvisorDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/advisor-scholarships" element={<AdvisorScholarships />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/library" element={<Library />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;