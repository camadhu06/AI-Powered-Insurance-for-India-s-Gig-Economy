# Stage 1: Build Expo Web App
FROM node:20-alpine AS build

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Enable CI mode to prevent interactive prompts
ENV CI=1

# Install dependencies
# Using --legacy-peer-deps to handle any complex version conflicts
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the web project
# Using npx expo export --platform web for a static production build
RUN npx expo export --platform web

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the build output from the build stage to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
