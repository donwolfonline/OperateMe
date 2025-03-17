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

## Key Features

### Authentication System
- Separate login flows for drivers and administrators
- Secure session management
- Role-based access control

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

### Multilingual Support
- Complete trilingual interface (Arabic, English, Urdu)
- RTL support for Arabic
- Easy language switching

### Search and Filter System
- Real-time search functionality across all sections
- Advanced filtering options:
  - Registration date (Today, This Week, This Month)
  - Driver name dropdown filters
  - Document type filters
  - Status filters for orders
  - Date-based filtering

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

## Deployment on Hostinger

### Prerequisites
- Hostinger VPS or Business Hosting plan with Node.js support
- Node.js (v20.x or later)
- PostgreSQL database
- Domain name (optional but recommended)

### Deployment Steps

1. Upload Project Files
```bash
# Build the frontend
npm run build

# Upload files to Hostinger via FTP or Git
```

2. Install Dependencies
```bash
npm install
npm install -g pm2
```

3. Set Up Environment Variables
Create a `.env` file in your project root:
```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
NODE_ENV=production
PORT=3000
```

4. Configure PM2
Create a `ecosystem.config.js` file:
```javascript
module.exports = {
  apps: [{
    name: "operateme",
    script: "server/index.js",
    env: {
      NODE_ENV: "production",
    }
  }]
}
```

5. Start the Application
```bash
# Start the application with PM2
pm2 start ecosystem.config.js

# Ensure app starts on server reboot
pm2 startup
pm2 save
```

6. Configure Nginx (if using VPS)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. Set Up SSL Certificate
- Use Hostinger's auto SSL feature or install Let's Encrypt
- Enable HTTPS in nginx configuration

### Database Setup
1. Create a PostgreSQL database in Hostinger's control panel
2. Update the DATABASE_URL in your .env file
3. Run database migrations:
```bash
npm run db:migrate
```

### File Upload Configuration
1. Create uploads directory:
```bash
mkdir uploads
chmod 755 uploads
```

2. Configure nginx to serve uploaded files:
```nginx
location /uploads {
    alias /path/to/your/uploads;
}
```

### Troubleshooting
- Check application logs: `pm2 logs`
- Monitor application: `pm2 monit`
- Nginx logs: `/var/log/nginx/error.log`

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