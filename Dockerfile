# Use a small, efficient HTTP server image
FROM nginx:alpine

# Copy the static HTML, CSS, and JavaScript files to the default Nginx web root directory
COPY views /usr/share/nginx/html
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js

# Expose port 80 to allow outside access
EXPOSE 80
