# OperateMe - Vehicle and Driver Management System

A comprehensive bilingual vehicle and driver management system with intelligent operational workflows, designed to streamline administrative processes through advanced search and filtering capabilities.

## Features

- 🌐 Multilingual Support (Arabic, English, and Urdu)
- 🔐 Secure Role-based Authentication
- 📱 Mobile-responsive Design
- 📄 Dynamic Document Management
- 🔍 QR Code Integration
- 👤 Advanced Driver Management
- 🚗 Vehicle Registration and Tracking
- 📋 Operation Order Management
- 🔎 Advanced Search and Filtering System

## Project Overview

This system provides a complete solution for managing vehicles and drivers with features including:

### User Management
- Role-based authentication (Admin/Driver)
- Multi-language support
- Profile management with document uploads

### Driver Features
- Vehicle registration and management
- Operation order creation
- Document generation with QR codes
- Trip history tracking

### Admin Features
- Driver approval and management
- Advanced search and filtering capabilities
- Document verification system
- Order tracking and monitoring

### Search and Filtering System
- Real-time search functionality
- Advanced filtering options:
  - Registration date (Today, This Week, This Month)
  - Driver name dropdown filters
  - Document type filters
  - Status filters for orders
  - Date-based filtering

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui components
- i18next for internationalization
- TanStack Query for data fetching
- React Hook Form for form management
- Wouter for routing

### Backend
- Express.js server
- PostgreSQL database with Drizzle ORM
- Passport.js for authentication
- Multer for file uploads
- PDF generation capabilities

## Getting Started

### Prerequisites
- Node.js (v20.x or later)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/donwolfonline/OperateMe.git
cd OperateMe
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
```

4. Start the development server:
```bash
npm run dev
```

## Deployment

### Vercel Deployment Steps

#### Prerequisites
1. Node.js (v20.x or later)
2. Vercel CLI
3. PostgreSQL database (recommended: Neon for serverless compatibility)

#### Deployment Steps

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy to Vercel:
```bash
vercel
```

#### Environment Variables
Set these in your Vercel project dashboard:
```env
DATABASE_URL=your_neon_postgresql_connection_string
SESSION_SECRET=your_session_secret
NODE_ENV=production
```

#### Important Notes
- The application uses serverless functions for the API
- Static assets are served through Vercel's CDN
- Database connections are optimized for serverless environment
- File uploads are handled through Vercel Blob Storage

#### Troubleshooting
If you encounter any issues:
1. Check the Vercel deployment logs
2. Verify environment variables are correctly set
3. Ensure database connection string is properly formatted
4. Check if all dependencies are properly installed


### Alternative Deployment Options
For other deployment options, see:
- `DEPLOY_HOSTINGER.md` for Hostinger deployment
- `deploy.sh` for general deployment script
- `ecosystem.config.js` for PM2 configuration

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and configurations
│   │   └── pages/        # Page components
├── server/                # Backend Express application
│   ├── api/              # Serverless API routes
│   ├── routes.ts         # API routes
│   ├── auth.ts           # Authentication logic
│   └── storage.ts        # Database operations
├── shared/               # Shared TypeScript types and schemas
└── uploads/             # File upload directory
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
