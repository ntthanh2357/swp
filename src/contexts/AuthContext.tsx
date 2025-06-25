import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, Advisor } from '../types';
import { decodeGoogleCredential } from '../hooks/useGoogleAuth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'student' | 'advisor' | 'admin') => Promise<void>;
  loginWithGoogle: (credential: string, role: 'student' | 'advisor') => Promise<void>;
  register: (userData: any) => Promise<void>;
  registerWithGoogle: (credential: string, role: 'student' | 'advisor', additionalData?: any) => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  updateProfile: (updatedUser: User) => Promise<void>;
  logout: () => void;
  loading: boolean;
  pendingVerification: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (Student | Advisor | User)[] = [
  {
    id: '1',
    email: 'student@example.com',
    name: 'Nguyễn Văn An',
    role: 'student',
    targetCountry: 'USA',
    fieldOfStudy: 'Computer Science',
    academicLevel: 'Bachelor',
    bio: 'Aspiring computer science student looking for scholarships in the US',
    gpa: 3.8,
    englishScore: { type: 'IELTS', score: 7.5 },
    emailVerified: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'advisor@example.com',
    name: 'Dr. Sarah Johnson',
    role: 'advisor',
    status: 'approved',
    specializations: ['Computer Science', 'Engineering'],
    countries: ['USA', 'Canada', 'UK'],
    languages: ['English', 'Spanish'],
    experience: '10+ years in academic advising',
    education: 'PhD in Computer Science from MIT',
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 80,
    availability: true,
    verified: true,
    totalStudents: 245,
    successRate: 92,
    bio: 'Experienced academic advisor specializing in STEM scholarships and university admissions.',
    packages: [
      {
        id: 'pkg1',
        name: 'Scholarship Discovery',
        description: '30-minute session to identify suitable scholarships',
        duration: 30,
        price: 40,
        features: ['Personalized scholarship recommendations', 'Application timeline', 'Initial guidance']
      },
      {
        id: 'pkg2',
        name: 'Application Support',
        description: '60-minute comprehensive application assistance',
        duration: 60,
        price: 80,
        features: ['Document review', 'Essay feedback', 'Interview preparation', 'Application strategy']
      },
      {
        id: 'pkg3',
        name: 'Complete Mentorship',
        description: 'Series of 3 in-depth sessions for full support',
        duration: 180,
        price: 200,
        features: ['3 comprehensive sessions', 'Ongoing email support', 'Document templates', 'Success tracking']
      }
    ],
    emailVerified: true,
    createdAt: new Date(),
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    emailVerified: true,
    createdAt: new Date(),
  }
];

// Mock OTP storage (in real app, this would be server-side)
const mockOTPs: { [email: string]: { otp: string; expires: Date } } = {};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = async (email: string): Promise<void> => {
    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    mockOTPs[email] = { otp, expires };
    
    // In real app, send email here
    console.log(`OTP for ${email}: ${otp}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const login = async (email: string, password: string, role: 'student' | 'advisor' | 'admin') => {
    setLoading(true);
    try {
      // Mock login - in real app, this would be an API call
      const foundUser = mockUsers.find(u => u.email === email && u.role === role);
      if (foundUser && foundUser.emailVerified) {
        // Check if advisor is approved
        if (role === 'advisor' && (foundUser as any).status === 'pending') {
          throw new Error('Your advisor account is pending approval. Please wait for admin confirmation.');
        }
        if (role === 'advisor' && (foundUser as any).status === 'rejected') {
          throw new Error('Your advisor application has been rejected. Please contact support.');
        }
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
      } else if (foundUser && !foundUser.emailVerified) {
        throw new Error('Email not verified. Please verify your email first.');
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string, role: 'student' | 'advisor') => {
    setLoading(true);
    try {
      const googleUser = decodeGoogleCredential(credential);
      
      if (!googleUser) {
        throw new Error('Invalid Google credential');
      }

      console.log('Google login for:', googleUser.email, 'as', role);

      // Check if user exists in our system
      const existingUser = mockUsers.find(u => u.email === googleUser.email && u.role === role);
      
      if (existingUser) {
        // Update avatar if from Google
        if (googleUser.picture && googleUser.picture !== existingUser.avatar) {
          existingUser.avatar = googleUser.picture;
        }
        setUser(existingUser);
        localStorage.setItem('user', JSON.stringify(existingUser));
      } else {
        // Create new user with Google data
        const newUser: User = {
          id: Date.now().toString(),
          email: googleUser.email,
          name: googleUser.name,
          role: role,
          avatar: googleUser.picture,
          emailVerified: true, // Google accounts are pre-verified
          createdAt: new Date(),
          ...(role === 'student' && {
            targetCountry: '',
            fieldOfStudy: '',
            academicLevel: '',
            bio: '',
          }),
          ...(role === 'advisor' && {
            specializations: [],
            countries: [],
            languages: ['English'],
            experience: '',
            education: '',
            rating: 0,
            reviewCount: 0,
            hourlyRate: 80,
            availability: true,
            bio: '',
            packages: [],
            verified: false,
            totalStudents: 0,
            successRate: 0,
          }),
        };

        mockUsers.push(newUser);
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      }
    } catch (error: any) {
      throw new Error(error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Send OTP
      await sendOTP(userData.email);
      
      // Store pending user data
      localStorage.setItem('pendingUser', JSON.stringify(userData));
      setPendingVerification(userData.email);
    } finally {
      setLoading(false);
    }
  };

  const registerWithGoogle = async (credential: string, role: 'student' | 'advisor', additionalData: any = {}) => {
    setLoading(true);
    try {
      const googleUser = decodeGoogleCredential(credential);
      
      if (!googleUser) {
        throw new Error('Invalid Google credential');
      }

      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === googleUser.email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create new user with Google data and additional info
      const newUser: User = {
        id: Date.now().toString(),
        email: googleUser.email,
        name: googleUser.name,
        role: role,
        avatar: googleUser.picture,
        emailVerified: true,
        createdAt: new Date(),
        ...additionalData,
      };

      mockUsers.push(newUser);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error: any) {
      throw new Error(error.message || 'Google registration failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    setLoading(true);
    try {
      const storedOTP = mockOTPs[email];
      
      if (!storedOTP) {
        throw new Error('OTP not found. Please request a new one.');
      }
      
      if (new Date() > storedOTP.expires) {
        throw new Error('OTP has expired. Please request a new one.');
      }
      
      if (storedOTP.otp !== otp) {
        throw new Error('Invalid OTP. Please try again.');
      }
      
      // Get pending user data
      const pendingUserData = localStorage.getItem('pendingUser');
      if (!pendingUserData) {
        throw new Error('Registration data not found. Please register again.');
      }
      
      const userData = JSON.parse(pendingUserData);
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        ...(userData.role === 'advisor' && { status: 'pending' }),
        emailVerified: true,
        createdAt: new Date(),
      };
      
      // Add to mock users (in real app, save to database)
      mockUsers.push(newUser);
      
      if (userData.role === 'advisor') {
        // For advisors, don't auto-login, redirect to pending page
        setPendingVerification(null);
      } else {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      }
      
      localStorage.removeItem('pendingUser');
      
      // Clean up OTP
      delete mockOTPs[email];
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (email: string) => {
    setLoading(true);
    try {
      await sendOTP(email);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedUser: User) => {
    try {
      // In real app, this would call API to update user profile
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(updatedUser)
      // });
      
      // For demo, update localStorage and state
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update the user in mock users array
      const userIndex = mockUsers.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('pendingUser');
    setPendingVerification(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithGoogle,
      register, 
      registerWithGoogle,
      verifyEmail, 
      resendOTP, 
      updateProfile,
      logout, 
      loading, 
      pendingVerification 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};