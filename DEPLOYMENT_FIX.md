# Production Deployment Fix Guide

## Issues Identified

### 1. API Domain Configuration Error
**Problem**: Frontend calling `https://aiwaverider.com/api/` instead of `https://api.aiwaverider.com/api/`
**Error**: `GET https://aiwaverider.com/api/videos?platform=youtube&page=1 404 (Not Found)`

### 2. Vercel Analytics 404 Error  
**Problem**: Trying to load `/_vercel/insights/script.js` without proper Vercel deployment
**Error**: `GET https://aiwaverider.com/_vercel/insights/script.js net::ERR_ABORTED 404 (Not Found)`

## Fixes Applied

### 1. API Domain Fix
✅ **Updated `docker-compose.prod.yml`**
```yaml
# Before
VITE_API_URL: "https://aiwaverider.com/api"

# After  
VITE_API_URL: "https://api.aiwaverider.com"
```

### 2. Vercel Analytics Fix
✅ **Updated `src/components/app/AppContent.jsx`**
- Made Vercel Analytics conditional based on environment variable
- Only loads when `VITE_VERCEL_ANALYTICS_ENABLED=true`

### 3. Environment Configuration
📋 **Create `.env.production` file** (you need to create this manually):
```bash
# Production Environment Variables
VITE_API_URL=https://api.aiwaverider.com
VITE_API_TIMEOUT=30000
VITE_API_RETRY_ATTEMPTS=3

# Disable Vercel Analytics (prevents 404 errors)
VITE_VERCEL_ANALYTICS_ENABLED=false

# Environment flag
NODE_ENV=production
VITE_ENV=production
```

## Deployment Steps

### 1. Create Production Environment File
```bash
# In your project root, create .env.production
cat > .env.production << 'EOF'
VITE_API_URL=https://api.aiwaverider.com
VITE_API_TIMEOUT=30000
VITE_API_RETRY_ATTEMPTS=3
VITE_VERCEL_ANALYTICS_ENABLED=false
NODE_ENV=production
VITE_ENV=production
EOF
```

### 2. Build and Deploy
```bash
# Build with corrected configuration
docker-compose -f docker-compose.prod.yml build --no-cache

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Verify API Connectivity
After deployment, verify the API calls are going to the correct domain:
- Open browser dev tools
- Navigate to the Videos page
- Check Network tab - should see calls to `https://api.aiwaverider.com/api/videos`

## Additional Notes

### Backend Requirements
Ensure your backend API is accessible at `https://api.aiwaverider.com` and has:
- `/api/videos` endpoint with platform and page parameters
- Proper CORS configuration for your frontend domain
- SSL certificate for the API subdomain

### Vercel Analytics (Optional)
To enable Vercel Analytics later:
1. Set up proper Vercel deployment
2. Configure analytics in Vercel dashboard  
3. Set `VITE_VERCEL_ANALYTICS_ENABLED=true` in environment

### Frontend Configuration Files Updated
- ✅ `docker-compose.prod.yml` - Fixed API URL
- ✅ `src/components/app/AppContent.jsx` - Made analytics conditional
- 📋 `.env.production` - Needs manual creation

## Testing
After deployment:
1. Visit https://aiwaverider.com/videos
2. Check browser console - should see no 404 errors
3. Verify API calls go to `api.aiwaverider.com` subdomain
4. Confirm videos load properly for each platform tab 