#!/bin/bash

# Build frontend
echo "Building frontend..."
npm run build

# Create necessary directories
echo "Creating directories..."
mkdir -p uploads
chmod 755 uploads

# Create environment variables template
echo "Creating .env template..."
cat > .env.template << EOL
# Database Configuration
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret

# Server Configuration
NODE_ENV=production
PORT=3000

# Upload Configuration
UPLOAD_DIR=/path/to/uploads
EOL

# Create nginx configuration
echo "Creating nginx configuration..."
cat > nginx.conf << EOL
server {
    listen 80;
    server_name your-domain.com;

    # Frontend static files
    location / {
        root /path/to/your/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Uploaded files
    location /uploads {
        alias /path/to/your/uploads;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
EOL

echo "Deployment files prepared successfully!"
