 # Use a small, efficient HTTP server image
 FROM nginx:alpine

 # Remove default nginx website
 RUN rm -rf /usr/share/nginx/html/*

 # Copy the static HTML, CSS, and JavaScript files to the default Nginx web root directory
 COPY views /usr/share/nginx/html/views
 COPY css /usr/share/nginx/html/css
 COPY js /usr/share/nginx/html/js

 # Expose port 80 to allow outside access
 EXPOSE 80