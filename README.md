# Road Lightning Transport - Vehicle and Driver Management System

## Overview
A comprehensive bilingual vehicle and driver management system designed to streamline administrative and driver-related processes. The system supports Arabic, English, and Urdu languages, providing a seamless experience for managing drivers, vehicles, and operation orders.

## Key Features

### Authentication & User Management
- Role-based authentication (Admin/Driver)
- Secure login and registration system
- Profile management with document uploads
- Multi-language support (Arabic, English, Urdu)

### Driver Features
- Personal profile management
- Vehicle registration and management
- Operation order creation and tracking
- Document management (ID, License, Profile Image)
- Trip history and documentation
- QR code integration for quick access

### Admin Features
- Driver approval workflow
- Active driver management
- Driver suspension capabilities
- Complete operation order oversight
- Document verification system
- Comprehensive reporting tools

### Vehicle Management
- Vehicle registration system
- Multiple vehicle support
- Photo documentation
- Active status tracking
- Registration document management

### Operation Orders
- Trip creation and management
- Passenger information tracking
- Visa type documentation
- PDF document generation
- QR code integration
- Multi-city route support

## Technical Stack

### Frontend
- React with TypeScript
- TanStack Query for data fetching
- Tailwind CSS with shadcn/ui components
- i18next for internationalization
- Mobile-responsive design
- Lucide React for icons

### Backend
- Express.js server
- PostgreSQL database with Drizzle ORM
- Secure file upload system
- PDF generation capabilities
- Session-based authentication
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v20 or later)
- PostgreSQL database
- NPM or Yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd road-lightning-transport
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file with the following variables:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SESSION_SECRET=your-session-secret
```

4. Start the development server
```bash
npm run dev
```

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and configurations
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main application component
├── server/
│   ├── routes.ts          # API routes
│   ├── auth.ts           # Authentication logic
│   ├── storage.ts        # Database interactions
│   └── utils/            # Server utilities
├── shared/
│   └── schema.ts         # Shared TypeScript types and schemas
└── uploads/              # File upload directory
```

## API Documentation

### Authentication Endpoints
- `POST /api/login` - User login
- `POST /api/register` - Driver registration
- `POST /api/logout` - User logout

### Driver Endpoints
- `GET /api/driver/orders` - Get driver's orders
- `POST /api/vehicles` - Register new vehicle
- `POST /api/operation-orders` - Create operation order
- `POST /api/documents/upload` - Upload documents

### Admin Endpoints
- `GET /api/admin/pending-drivers` - List pending drivers
- `GET /api/admin/active-drivers` - List active drivers
- `GET /api/admin/suspended-drivers` - List suspended drivers
- `GET /api/admin/all-orders` - List all operation orders
- `POST /api/admin/drivers/:id/status` - Update driver status

## Security Features
- Session-based authentication
- Secure password hashing
- File upload validation
- Role-based access control
- XSS protection
- CSRF protection

## Deployment
The application is designed to be deployed on Replit and includes all necessary configurations for seamless deployment.

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
