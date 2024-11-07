# Jobify - Job Portal Management System

A comprehensive job portal management system built with Node.js, Express, and MongoDB, featuring role-based access control, AI-powered job descriptions, and activity logging.

## 🚀 Features

### Authentication & Authorization

- Role-based access control (Super Admin, Admin)
- JWT-based authentication
- Password reset functionality
- Activity logging for security

### Company Management

- Create and manage company profiles
- Upload company logos
- Track company information
- Associate jobs with companies

### Job Management

- Create and manage job listings
- AI-powered job description generation
- File attachments for job descriptions
- Advanced search and filtering

### Admin Management

- Super admin controls
- Configurable admin permissions
- Activity monitoring
- System access control

## 📦 Project Structure

### Frontend Structure

```bash
jobify-client/
├── src/
│ ├── api/
│ │ ├── apiConfig.js
│ │ ├── authApi.js
│ │ ├── companyApi.js
│ │ ├── jobApi.js
│ │ └── superAdminApi.js
│ ├── components/
│ │ ├── admin/
│ │ │ ├── ActivityLogFilters.jsx
│ │ │ ├── ActivityLogSkeleton.jsx
│ │ │ ├── ActivityLogTable.jsx
│ │ │ ├── AdminCard.jsx
│ │ │ ├── AdminModal.jsx
│ │ │ └── AdminSkeleton.jsx
│ │ ├── common/
│ │ │ ├── Skeleton.jsx
│ │ │ └── LoadingOverlay.jsx
│ │ ├── company/
│ │ │ ├── CompanyCard.jsx
│ │ │ ├── CompanyModal.jsx
│ │ │ └── CompanySkeleton.jsx
│ │ ├── job/
│ │ │ ├── JobCard.jsx
│ │ │ ├── JobModal.jsx
│ │ │ └── JobSkeleton.jsx
│ │ ├── PermissionGuard.jsx
│ │ └── ProtectedRoute.jsx
│ ├── features/
│ │ ├── auth/
│ │ │ └── authSlice.js
│ │ ├── company/
│ │ │ └── companySlice.js
│ │ ├── jobs/
│ │ │ └── jobSlice.js
│ │ └── superadmin/
│ │ └── superAdminSlice.js
│ ├── layouts/
│ │ ├── RootLayout.jsx
│ │ └── DashboardLayout.jsx
│ ├── pages/
│ │ ├── ActivityLog.jsx
│ │ ├── AdminDetails.jsx
│ │ ├── CreateSuperAdmin.jsx
│ │ ├── Dashboard.jsx
│ │ ├── ForgotPassword.jsx
│ │ ├── JobDetails.jsx
│ │ ├── Login.jsx
│ │ ├── ResetPassword.jsx
│ │ ├── ManageAdmins.jsx
│ │ ├── ManageCompanies.jsx
│ │ ├── ManageJobs.jsx
│ │ └── Profile.jsx
│ ├── config/
│ │ └── variables.js
│ ├── utils/
│ │ └── permissions.js
│ ├── App.jsx
│ └── main.jsx
├── package.json
└── vite.config.js
```

## 🚀 Live Demo

- Frontend: [Jobify Client](https://jobify-34.vercel.app/)
- Backend: [Jobify API](https://jobify-iqy3.onrender.com)

## 👤 Demo Credentials

### Super Admin

```bash
Email: superadmin@jobify.com
Password: Admin@123
```

### Admin

```bash
Email: admin@jobify.com
Password: Admin@123
```

## 🏃‍♂️ Running the Project Locally

### Backend Setup

Clone the repository

```bash
git clone https://github.com/azim128/jobify
```

Navigate to backend directory

```bash
cd jobify
```

Install dependencies

```bash
npm install
```

Set up environment variables

```bash
cp .env.example .env
```

```bash
    npm run dev
```

### Frontend Setup

checkout to frontend branch

```bash
git checkout frontend
```

```bash
npm install
```

Set up environment variables

```bash
cp .env.example .env
```

```bash
npm run dev
```

## ⚠️ Limitations

1. **File Upload Restrictions**

   - Supported formats:
     - Images: JPG, PNG
     - Documents: PDF

2. **Search Functionality**

   - Basic text search
   - Limited filter combinations

3. **Real-time Updates**
   - No real-time notifications
   - Manual refresh required

## 🔮 Future Scope

1. **Enhanced Features**

   - Real-time notifications
   - Advanced search with filters
   - Bulk operations like delete, edit, etc.
   - Export functionality
   - Email templates customization

2. **Technical Improvements**

   - WebSocket integration
   - Redis caching
   - Rate limiting
   - Testing both frontend and backend

3. **User Experience**

   - Accessibility improvements
   - Dashboard customization
   - Responsive design

4. **Security Enhancements**

   - Two-factor authentication
   - OAuth integration
   - Admin can change password after some time

5. **Analytics & Reporting**
   - Advanced analytics dashboard
   - Custom report generation
   - Data visualization
   - Performance metrics
   - Usage statistics

## 🛠 Tech Stack Details

### Frontend

- React.js with Vite
- Redux Toolkit for state management
- Tailwind CSS for styling
- Axios for API requests
- React Router for navigation

### Backend

- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- Cloudinary for storage

### DevOps

- Version Control: Git
- Hosting:
  - Frontend: Vercel
  - Backend: Render
  - Database: MongoDB Atlas
