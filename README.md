# OperateMe - Vehicle and Driver Management System

A comprehensive bilingual vehicle and driver management system designed to streamline administrative and driver-related processes with intelligent operational workflows.

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

## Key Features

### Driver Management
- Driver registration and profile management
- Document upload capability (ID, license, profile picture)
- Status tracking (pending, active, suspended)
- Advanced search and filtering by name, date, and status

### Vehicle Management
- Vehicle registration with detailed information
- Multiple photo uploads
- Active/inactive status tracking

### Operation Orders
- Create and manage transportation orders
- Passenger information management
- PDF document generation with QR codes
- Trip tracking and history
- Search by driver name and visa type

### Admin Dashboard
- Comprehensive driver management with advanced filtering
- Order monitoring and tracking with search capabilities
- Document verification system
- Status management for drivers and vehicles
- Searchable document history by driver name

### Search and Filter System
- Real-time search functionality across all sections
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

## Project Structure

```
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
