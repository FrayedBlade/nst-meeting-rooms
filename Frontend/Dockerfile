# Build stage
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files first (dependency caching)
COPY package.json package-lock.json* ./
RUN npm ci

# Accept build-time API URL argument
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

# Copy source and build
COPY . .
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
