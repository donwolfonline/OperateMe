# OperateMe - Vehicle and Driver Management System

A comprehensive bilingual vehicle and driver management system designed to streamline administrative and driver-related processes with intelligent operational workflows.

## Features

- 🌐 Multilingual Support (Arabic, English, and Urdu):
  - Full translation support for all cities and airports
  - Includes major Saudi cities and international airports
  - Bidirectional text support (RTL/LTR)
- 🔐 Secure Role-based Authentication
- 📱 Mobile-responsive Design
- 📄 Dynamic Document Management
- 🔍 QR Code Integration
- 👤 Advanced Driver Management
- 🚗 Vehicle Registration and Tracking
- 📋 Operation Order Management
- 🔎 Advanced Search and Filtering System
- 📊 Comprehensive Data Export:
  - Daily updated Excel reports
  - Complete trip and passenger statistics
  - PDF document tracking with direct links
  - Driver performance metrics
  - Route analytics and completion rates

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

### Excel Export System
- **Daily Trip Reports**
  - Comprehensive daily statistics
  - Trip counts and passenger totals
  - Route summaries and completion rates
  - Active driver tracking
  - PDF generation statistics
  - Clickable PDF and QR code links
  - Real-time status updates
  - Route analysis and completion rates

- **Driver Information**
  - Complete driver profiles
  - Document verification status
  - Performance metrics
  - Document URLs and verification links
  - Status tracking and history
  - Profile completion tracking

- **Operation Orders**
  - Detailed trip information
  - Vehicle assignments
  - Passenger manifests
  - PDF and QR code tracking
  - Real-time status updates
  - Clickable document links

- **Document Management**
  - Generated PDF tracking
  - Direct download links
  - QR code access
  - Creation timestamps
  - Document status monitoring
  - Automatic daily updates

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

## Development Setup

### Prerequisites
- Node.js (v20.x or later)
- PostgreSQL database
- Python 3.11+ (for PDF generation)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/donwolfonline/OperateMe.git
cd OperateMe
```

2. Copy the environment template and configure your variables:
```bash
cp .env.template .env
```

3. Update the .env file with your specific configuration:
   - Set your PostgreSQL database URL
   - Configure a secure session secret
   - Adjust other settings as needed

4. Install dependencies:
```bash
npm install
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── ui/       # shadcn UI components
│   │   │   ├── LanguageToggle.tsx  # Language switcher
│   │   │   ├── HomeButton.tsx      # Navigation component
│   │   │   ├── SearchAndFilter.tsx # Search functionality
│   │   │   └── ...
│   │   ├── hooks/        # Custom React hooks
│   │   │   ├── use-auth.ts    # Authentication hook
│   │   │   ├── use-toast.ts   # Toast notifications
│   │   │   └── ...
│   │   ├── lib/          # Utility functions and configurations
│   │   │   ├── i18n.ts         # Internationalization setup
│   │   │   ├── queryClient.ts  # React Query configuration
│   │   │   └── ...
│   │   └── pages/        # Page components
│   │       ├── admin-dashboard.tsx
│   │       ├── admin-login.tsx
│   │       ├── driver-dashboard.tsx
│   │       └── ...
├── server/                # Backend Express application
│   ├── routes.ts         # API routes
│   ├── auth.ts           # Authentication logic
│   └── storage.ts        # Database operations
├── shared/               # Shared TypeScript types and schemas
└── uploads/              # File upload directory
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