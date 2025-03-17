# Deploying to Hostinger

## Pre-deployment Checklist

1. Ensure you have:
   - Hostinger Business Hosting account
   - Node.js support enabled
   - Access to MySQL/PostgreSQL database
   - Domain configured (optional)

## Deployment Steps

### 1. Database Setup
1. Go to Hostinger control panel
2. Create a new MySQL/PostgreSQL database
3. Note down the database credentials:
   - Database name
   - Username
   - Password
   - Host

### 2. File Upload
1. Connect to Hostinger via FTP/SSH
2. Upload the entire project directory
3. Create an `uploads` directory
4. Set proper permissions:
   ```bash
   chmod 755 uploads
   ```

### 3. Environment Setup
1. Copy `.env.template` to `.env`
2. Update the environment variables:
   - Set DATABASE_URL with your database credentials
   - Set SESSION_SECRET (generate a random string)
   - Update UPLOAD_DIR path
   - Set NODE_ENV=production

### 4. Dependencies Installation
1. SSH into your hosting server
2. Navigate to project directory
3. Install dependencies:
   ```bash
   npm install
   npm install -g pm2
   ```

### 5. Database Migration
1. Run database migrations:
   ```bash
   npm run db:migrate
   ```

### 6. PM2 Setup
1. Start the application:
   ```bash
   pm2 start ecosystem.config.js
   ```
2. Save PM2 process list:
   ```bash
   pm2 save
   ```
3. Setup PM2 to start on server reboot:
   ```bash
   pm2 startup
   ```

### 7. Domain Configuration
1. Point your domain to Hostinger nameservers
2. Configure domain in Hostinger control panel
3. Update nginx configuration with your domain

### 8. SSL Setup
1. Use Hostinger's auto SSL feature
2. Or install Let's Encrypt certificate

## Troubleshooting

### Common Issues
1. 502 Bad Gateway
   - Check if Node.js process is running
   - Verify PM2 logs: `pm2 logs`

2. File Upload Issues
   - Check uploads directory permissions
   - Verify UPLOAD_DIR path in .env

3. Database Connection Issues
   - Verify DATABASE_URL in .env
   - Check database credentials
   - Ensure database server is accessible

### Useful Commands
- View application logs: `pm2 logs`
- Monitor application: `pm2 monit`
- Restart application: `pm2 restart all`
- View process status: `pm2 list`

## Support
For hosting-related issues, contact Hostinger support:
https://www.hostinger.com/support
