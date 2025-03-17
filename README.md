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
│   └── storage.ts         # Database operations
├── shared/               # Shared TypeScript types and schemas
└── uploads/             # File upload directory
```

## Key Features

### Authentication System
- Separate login flows for drivers and administrators
- Secure session management
- Role-based access control

### Driver Management
- Driver registration and profile management
- Document upload capability (ID, license, profile picture)
- Status tracking (pending, active, suspended)

### Vehicle Management
- Vehicle registration with detailed information
- Multiple photo uploads
- Active/inactive status tracking

### Operation Orders
- Create and manage transportation orders
- Passenger information management
- PDF document generation with QR codes
- Trip tracking and history

### Admin Dashboard
- Comprehensive driver management
- Order monitoring and tracking
- Document verification system
- Status management for drivers and vehicles

### Multilingual Support
- Complete trilingual interface (Arabic, English, Urdu)
- RTL support for Arabic
- Easy language switching

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices and hooks guidelines
- Implement proper error handling
- Maintain consistent code formatting

### API Structure
- RESTful API design
- Proper validation using Zod schemas
- Secure file upload handling
- Structured error responses

### Database
- Use Drizzle ORM for database operations
- Implement proper data validation
- Maintain referential integrity
- Follow SQL best practices

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
