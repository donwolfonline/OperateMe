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

## VPS Deployment Guide

### Prerequisites
- A VPS server (Ubuntu 22.04 LTS recommended)
- A domain name pointing to your server
- SSH access to your server
- Root or sudo privileges

### Step 1: Initial Server Setup
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required system dependencies
sudo apt install -y curl git nginx certbot python3-certbot-nginx

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -y pm2 -g
```

### Step 2: PostgreSQL Database Setup
```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE operateme;"
sudo -u postgres psql -c "CREATE USER operateuser WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE operateme TO operateuser;"
```

### Step 3: Application Deployment

1. **Clone the Repository**:
```bash
# Create application directory
sudo mkdir -p /var/www/operateme
sudo chown $USER:$USER /var/www/operateme

# Clone the repository
git clone https://github.com/yourusername/operateme.git /var/www/operateme
cd /var/www/operateme
```

2. **Setup Environment Variables**:
```bash
# Create and edit .env file
nano .env

# Add required environment variables
DATABASE_URL=postgresql://operateuser:your_secure_password@localhost:5432/operateme
NODE_ENV=production
SESSION_SECRET=your_secure_session_secret
# Add other required environment variables
```

3. **Install Dependencies and Build**:
```bash
# Install dependencies
npm install

# Build the application
npm run build
```

### Step 4: Nginx Configuration

1. **Create Nginx Configuration**:
```bash
sudo nano /etc/nginx/sites-available/operateme
```

2. **Add the Following Configuration**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads/ {
        alias /var/www/operateme/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    client_max_body_size 50M;
}
```

3. **Enable the Site**:
```bash
sudo ln -s /etc/nginx/sites-available/operateme /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: SSL Configuration

```bash
# Install SSL certificate
sudo certbot --nginx -d your-domain.com
```

### Step 6: Application Launch

1. **Setup PM2 Process**:
```bash
# Start the application with PM2
pm2 start server/index.ts --name "operateme" --interpreter="node_modules/.bin/tsx"

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
sudo pm2 startup
```

2. **Monitor the Application**:
```bash
# View logs
pm2 logs operateme

# Monitor application
pm2 monit
```

### Step 7: Upload Directory Setup
```bash
# Create uploads directory
mkdir -p /var/www/operateme/uploads
sudo chown -R $USER:www-data /var/www/operateme/uploads
sudo chmod -R 775 /var/www/operateme/uploads
```

### Maintenance and Updates

1. **Application Updates**:
```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild the application
npm run build

# Restart the application
pm2 restart operateme
```

2. **Database Backup**:
```bash
# Create backup script
sudo nano /usr/local/bin/backup-db.sh

# Add the following content:
#!/bin/bash
BACKUP_DIR="/var/backups/operateme"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p $BACKUP_DIR
pg_dump -U operateuser operateme > "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Make script executable
sudo chmod +x /usr/local/bin/backup-db.sh

# Add to crontab for daily backup
sudo crontab -e
# Add line: 0 2 * * * /usr/local/bin/backup-db.sh
```

### Security Considerations

1. **Firewall Setup**:
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow http
sudo ufw allow https
```

2. **Secure PostgreSQL**:
```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/postgresql.conf

# Set the following parameters:
listen_addresses = 'localhost'
max_connections = 100
```

3. **Regular Updates**:
```bash
# Create update script
sudo nano /usr/local/bin/update-system.sh

# Add content:
#!/bin/bash
apt update
apt upgrade -y
npm audit fix

# Make executable
sudo chmod +x /usr/local/bin/update-system.sh

# Add to weekly cron
sudo crontab -e
# Add line: 0 3 * * 0 /usr/local/bin/update-system.sh
```

### Monitoring and Logging

1. **Setup Log Rotation**:
```bash
sudo nano /etc/logrotate.d/operateme

# Add configuration:
/var/www/operateme/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

2. **Monitor System Resources**:
```bash
# Install monitoring tools
sudo apt install -y htop vnstat iotop

# Setup basic monitoring
vnstat -u -i eth0
```

### Troubleshooting

1. **Check Application Logs**:
```bash
# View PM2 logs
pm2 logs operateme

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

2. **Common Issues**:
- If the application fails to start, check PM2 logs
- For database connection issues, verify PostgreSQL service status
- For upload issues, check directory permissions
- For SSL issues, verify certbot renewal status

### Backup and Recovery

1. **Full System Backup**:
```bash
# Install backup tool
sudo apt install -y restic

# Initialize backup repository
restic init --repo /path/to/backup/location

# Create backup
restic backup /var/www/operateme
```

2. **Recovery Process**:
```bash
# Restore from backup
restic restore latest --target /var/www/operateme-restore
```

Remember to regularly:
- Monitor system resources
- Check application logs
- Update system packages
- Backup database and files
- Verify SSL certificate renewal
- Test backup restoration process