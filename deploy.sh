#!/bin/bash

# Build the project
npm run build

# Remove existing files in the document root (be careful!)
ssh bevzgchi@maintenances.org "rm -rf /home/bevzgchi/maintenances.org/*"

# Copy built files to Namecheap hosting
scp -r dist/* bevzgchi@maintenances.org:/home/bevzgchi/maintenances.org/

# Create .htaccess for SPA routing
ssh bevzgchi@maintenances.org "cat > /home/bevzgchi/maintenances.org/.htaccess << EOL
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
EOL"

echo "Deployment completed successfully!"
