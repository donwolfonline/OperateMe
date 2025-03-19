# OperateMe - Vehicle and Driver Management System

A comprehensive bilingual vehicle and driver management system designed to streamline administrative and driver-related processes with intelligent operational workflows.

Features

🌐 Multilingual Support (Arabic, English, and Urdu)
🔐 Secure Role-based Authentication
📱 Mobile-responsive Design
📄 Dynamic Document Management
🔍 QR Code Integration
👤 Advanced Driver Management
🚗 Vehicle Registration and Tracking
📋 Operation Order Management
🔎 Advanced Search and Filtering System
Key Features

Driver Management

Driver registration and profile management
Document upload capability (ID, license, profile picture)
Status tracking (pending, active, suspended)
Advanced search and filtering by name, date, and status
Vehicle Management

Vehicle registration with detailed information
Multiple photo uploads
Active/inactive status tracking
Operation Orders

Create and manage transportation orders
Passenger information management
PDF document generation with QR codes
Trip tracking and history
Search by driver name and visa type
Admin Dashboard

Comprehensive driver management with advanced filtering
Order monitoring and tracking with search capabilities
Document verification system
Status management for drivers and vehicles
Searchable document history by driver name
Search and Filter System

Real-time search functionality across all sections
Advanced filtering options:
Registration date (Today, This Week, This Month)
Driver name dropdown filters
Document type filters
Status filters for orders
Date-based filtering
Tech Stack

Frontend

React with TypeScript
Tailwind CSS for styling
shadcn/ui components
i18next for internationalization
TanStack Query for data fetching
React Hook Form for form management
Wouter for routing
Backend

Express.js server
PostgreSQL database with Drizzle ORM
Passport.js for authentication
Multer for file uploads
PDF generation capabilities
Development Setup

Prerequisites

Node.js (v20.x or later)
PostgreSQL database
Python 3.11+ (for PDF generation)
Installation

Clone the repository:
git clone https://github.com/donwolfonline/OperateMe.git
cd OperateMe
Install dependencies:
npm install
Set up environment variables:
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
Start the development server:
npm run dev
Deployment Guide

Recommended Hosting Solutions

Application Hosting:
Replit: Ideal for full-stack deployment with built-in CI/CD
Vercel: Great for frontend deployment
Railway.app: Excellent for full-stack Node.js applications
Heroku: Reliable platform with good scaling options
Database Hosting:
Neon: Recommended PostgreSQL provider with serverless capabilities
Supabase: Good alternative with additional features
Railway.app: Integrated PostgreSQL hosting
File Storage:
AWS S3: For document and image storage
Cloudinary: For image optimization and delivery
DigitalOcean Spaces: Cost-effective S3-compatible storage
Deployment Steps

Database Setup:
# Initialize database
npm run db:push
Environment Configuration:
Set up production environment variables:
NODE_ENV=production
DATABASE_URL=your_production_db_url
SESSION_SECRET=your_secure_session_secret
Build Process:
# Build frontend assets
npm run build
Replit Deployment:
Fork the project on Replit
Configure secrets in Replit's secrets manager
Use the "Run" button to deploy
Alternative Deployment (Vercel/Railway):
Connect your GitHub repository
Configure build settings:
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build"
    }
  ]
}
Production Considerations

Performance Optimization:
Enable server-side caching
Implement rate limiting
Use CDN for static assets
Security Measures:
Enable CORS properly
Implement CSRF protection
Use secure session settings
Regular dependency updates
Monitoring:
Set up error tracking (e.g., Sentry)
Implement application logging
Monitor database performance
Scaling:
Use load balancing for high traffic
Implement database connection pooling
Consider serverless functions for specific features
Project Structure

├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and configurations
│   │   └── pages/        # Page components
├── server/                # Backend Express application
│   ├── routes.ts         # API routes
│   ├── auth.ts           # Authentication logic
│   └── storage.ts        # Database operations
├── shared/               # Shared TypeScript types and schemas
└── uploads/             # File upload directory
Contributing

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
License

This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
