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

## Environment Variables

The following environment variables are required for the application to function properly:

### Database Configuration
| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@host:5432/db |
| PGPORT | PostgreSQL port | 5432 |
| PGHOST | Database host | localhost |
| PGUSER | Database user | postgres |
| PGPASSWORD | Database password | your-secure-password |
| PGDATABASE | Database name | your_database_name |

### Session Management
| Variable | Description | Example |
|----------|-------------|---------|
| SESSION_SECRET | Secret key for session encryption | your-secure-secret |

### Server Configuration
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment mode | development |

### File Upload Settings
| Variable | Description | Example |
|----------|-------------|---------|
| UPLOAD_DIR | Directory for file uploads | uploads |
| MAX_FILE_SIZE | Maximum file upload size | 10mb |
| ALLOWED_FILE_TYPES | Comma-separated list of allowed MIME types | image/jpeg,image/png,application/pdf |

### PDF Generation
| Variable | Description | Example |
|----------|-------------|---------|
| PDF_TEMPLATES_DIR | Directory containing PDF templates | server/utils/pdf_templates |
| PDF_OUTPUT_DIR | Directory for generated PDFs | uploads |
| PDF_FONT_DIR | Directory containing custom fonts | server/utils/fonts |

### Internationalization
| Variable | Description | Example |
|----------|-------------|---------|
| DEFAULT_LANGUAGE | Default application language | en |
| SUPPORTED_LANGUAGES | Comma-separated list of supported languages | en,ar,ur |

### Security Settings
| Variable | Description | Example |
|----------|-------------|---------|
| CORS_ORIGIN | CORS allowed origins | * |
| RATE_LIMIT_WINDOW | Rate limiting time window | 15m |
| RATE_LIMIT_MAX_REQUESTS | Maximum requests per window | 100 |

### Optional External Services

#### AWS S3 Configuration (Optional)
| Variable | Description |
|----------|-------------|
| AWS_ACCESS_KEY_ID | AWS access key |
| AWS_SECRET_ACCESS_KEY | AWS secret key |
| AWS_BUCKET_NAME | S3 bucket name |
| AWS_REGION | AWS region |

#### Monitoring (Optional)
| Variable | Description |
|----------|-------------|
| SENTRY_DSN | Sentry error tracking DSN |
| LOG_LEVEL | Application log level |

#### Cache Configuration (Optional)
| Variable | Description |
|----------|-------------|
| REDIS_URL | Redis connection URL |
| CACHE_TTL | Cache time-to-live in seconds |

To get started:
1. Copy `.env.template` to `.env`
2. Fill in the required values
3. Optional services can be configured as needed

Note: Never commit the `.env` file to version control. The `.env.template` file serves as a template for required environment variables.


## Deployment Guide

### Recommended Hosting Solutions

1. **Application Hosting**:
   - **Replit**: Ideal for full-stack deployment with built-in CI/CD
   - **Vercel**: Great for frontend deployment
   - **Railway.app**: Excellent for full-stack Node.js applications
   - **Heroku**: Reliable platform with good scaling options

2. **Database Hosting**:
   - **Neon**: Recommended PostgreSQL provider with serverless capabilities
   - **Supabase**: Good alternative with additional features
   - **Railway.app**: Integrated PostgreSQL hosting

3. **File Storage**:
   - **AWS S3**: For document and image storage
   - **Cloudinary**: For image optimization and delivery
   - **DigitalOcean Spaces**: Cost-effective S3-compatible storage

### Deployment Steps

1. **Database Setup**:
   ```bash
   # Initialize database
   npm run db:push
   ```

2. **Environment Configuration**:
   - Set up production environment variables:
     ```env
     NODE_ENV=production
     DATABASE_URL=your_production_db_url
     SESSION_SECRET=your_secure_session_secret
     ```

3. **Build Process**:
   ```bash
   # Build frontend assets
   npm run build
   ```

4. **Replit Deployment**:
   - Fork the project on Replit
   - Configure secrets in Replit's secrets manager
   - Use the "Run" button to deploy

5. **Alternative Deployment (Vercel/Railway)**:
   - Connect your GitHub repository
   - Configure build settings:
     ```json
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
     ```

### Production Considerations

1. **Performance Optimization**:
   - Enable server-side caching
   - Implement rate limiting
   - Use CDN for static assets

2. **Security Measures**:
   - Enable CORS properly
   - Implement CSRF protection
   - Use secure session settings
   - Regular dependency updates

3. **Monitoring**:
   - Set up error tracking (e.g., Sentry)
   - Implement application logging
   - Monitor database performance

4. **Scaling**:
   - Use load balancing for high traffic
   - Implement database connection pooling
   - Consider serverless functions for specific features

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
