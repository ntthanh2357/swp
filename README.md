# ScholarConnect - Scholarship & Consulting Platform

A comprehensive platform connecting students with scholarship opportunities and expert advisors worldwide.

## ✨ **Features**

### 🎓 **For Students:**
- Browse thousands of scholarship opportunities
- Connect with expert advisors
- Real-time chat and video consultations
- Personalized scholarship recommendations
- Track application progress
- Upload and manage documents

### 👨‍🏫 **For Advisors:**
- Create professional profiles
- Offer consulting packages
- Chat with students worldwide
- Manage consultation schedules
- Track earnings and performance

### 🔐 **Authentication:**
- **Email/Password login** for students, advisors, and admins
- **Google OAuth integration** - Sign up and login with Google
- Email verification with OTP
- Role-based access control
- Secure JWT authentication

### 💬 **Real-time Chat:**
- Text messaging with read receipts
- File and image sharing
- Voice and video calls
- Typing indicators
- Online status tracking
- Message reactions and replies

### 📱 **Modern UI/UX:**
- Responsive design for all devices
- Beautiful Tailwind CSS styling
- Smooth animations and transitions
- Dark/light mode support
- Accessibility features

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd scholarship-consulting-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Google OAuth (Optional)**
```bash
# Copy environment file
cp .env.example .env

# Edit .env and add your Google Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**To get Google Client ID:**
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 Client ID credentials
5. Add your domain to authorized origins
6. Copy the Client ID to your `.env` file

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to `http://localhost:5173`

## 🔑 **Demo Accounts**

### Login Credentials:
- **Student:** `student@example.com` (any password)
- **Advisor:** `advisor@example.com` (any password)  
- **Admin:** `admin@example.com` (any password)

### Google Login:
- Click "Continue with Google" on login/register page
- For demo: uses mock Google data (demo@gmail.com)
- In production: connects to real Google OAuth

## 📖 **Usage Guide**

### 🔐 **Authentication:**

**Regular Login:**
1. Go to `/login`
2. Select your role (Student/Advisor/Admin)
3. Enter email and password
4. Click "Sign In"

**Google Login:**
1. Go to `/login` or `/register`
2. Select your role
3. Click "Continue with Google"
4. Authorize in Google popup
5. Automatic account creation/login

**Registration:**
1. Go to `/register`
2. Fill in your information
3. Choose role-specific fields
4. Verify email with OTP code
5. Start using the platform

### 👥 **User Management:**

**Profile Updates:**
- Go to `/profile` 
- Click "Edit Profile"
- Update information and avatar
- Save changes

**Avatar Upload:**
- Click on any avatar
- Upload new image (JPG/PNG, max 5MB)
- Auto-resize and optimization
- Syncs across all areas (header, chat, profile)

### 💬 **Chat System:**

**Starting Conversations:**
- Find advisor on `/advisors`
- Click "Contact" or message icon
- Start chatting immediately

**Chat Features:**
- Send text messages
- Upload files and images
- Voice/video calls
- Message reactions
- Reply to messages
- Typing indicators
- Read receipts

### 🎓 **Scholarships:**

**Browse Scholarships:**
- Visit `/scholarships`
- Use filters (country, field, level)
- Sort by deadline, amount, featured
- Navigate through 5 pages of scholarships
- View detailed information

**Personalized Recommendations:**
- Based on your profile
- Machine learning matching
- Updated regularly

### 👨‍🏫 **Consulting Packages:**

**For Students:**
- Browse `/packages`
- Choose consultation type
- Pay securely online
- Schedule sessions

**For Advisors:**
- Create custom packages
- Set pricing and duration
- Manage bookings
- Track earnings

## 🛠 **Technology Stack**

### Frontend:
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Vite** for build tooling

### Authentication:
- **JWT** for session management
- **Google OAuth 2.0** for social login
- **OTP verification** for email confirmation

### State Management:
- **React Context** for global state
- **Custom hooks** for business logic
- **Local storage** for persistence

### Real-time Features:
- **WebSocket simulation** for chat
- **Mock Socket.IO** implementation
- **Real-time updates** and notifications

## 📁 **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Header, Footer
│   ├── AvatarUpload.tsx # Avatar management
│   └── GoogleAuthButton.tsx # Google auth UI
├── contexts/           # React Context providers
│   └── AuthContext.tsx # Authentication state
├── hooks/              # Custom React hooks
│   ├── useGoogleAuth.ts # Google OAuth integration
│   └── useSocket.ts    # WebSocket simulation
├── pages/              # Route components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── Profile.tsx     # User profile
│   ├── Chat.tsx        # Chat interface
│   ├── Scholarships.tsx # Scholarship search
│   └── ...            # Other pages
├── services/           # API and business logic
│   ├── avatarService.ts # Avatar upload/management
│   ├── chatService.ts  # Chat functionality
│   └── emailService.ts # Email notifications
├── types/              # TypeScript definitions
└── App.tsx            # Main application component
```

## 🎨 **Design System**

### Colors:
- **Primary:** Blue (#3B82F6)
- **Secondary:** Purple (#8B5CF6)
- **Success:** Green (#10B981)
- **Warning:** Yellow (#F59E0B)
- **Error:** Red (#EF4444)

### Typography:
- **Headings:** Bold, clear hierarchy
- **Body:** 16px base, 1.6 line height
- **UI Text:** 14px, medium weight

### Spacing:
- **8px grid system**
- Consistent margins and padding
- Responsive breakpoints

## 🔒 **Security Features**

- **JWT token authentication**
- **XSS protection** with sanitization
- **CSRF protection** with tokens
- **Input validation** on all forms
- **Secure file uploads** with type checking
- **Rate limiting** on authentication
- **Environment variable protection**

## 📱 **Responsive Design**

- **Mobile-first** approach
- **Tablet optimization**
- **Desktop enhancement**
- **Touch-friendly** interface
- **Fast loading** on all devices

## 🚀 **Deployment**

### Development:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
npm run preview
```

### Environment Variables:
```bash
# Required for Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Optional configurations
VITE_API_URL=your_api_endpoint
VITE_SOCKET_URL=your_websocket_endpoint
```

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

For support and questions:
- 📧 Email: support@scholarconnect.com
- 💬 Chat: Available in the platform
- 📖 Documentation: [View docs](https://docs.scholarconnect.com)

## 🙏 **Acknowledgments**

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide React** for beautiful icons
- **Google** for OAuth integration
- **Pexels** for stock photos
- **Open Source Community** for inspiration and libraries

---

**Built with ❤️ for education and student success worldwide** 🌍🎓