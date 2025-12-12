# AWS S3 Deployment Guide

## Build Status
✅ Build completed successfully with terser minification

## Pre-Deployment Checklist

### 1. Build the Project
```bash
npm run build
```

This creates the `dist` folder with all optimized assets.

### 2. AWS S3 Bucket Configuration

#### Bucket Settings:
1. **Static Website Hosting**: Enable it
   - Index document: `index.html`
   - Error document: `index.html` (for SPA routing)

2. **Bucket Policy** (make it public):
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```

3. **CORS Configuration** (if needed):
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

### 3. Upload Files

#### Option A: AWS CLI
```bash
# Install AWS CLI if not already installed
# Configure your credentials: aws configure

# Upload all files from dist folder
aws s3 sync dist/ s3://YOUR-BUCKET-NAME/ --delete

# Set correct content types
aws s3 cp dist/ s3://YOUR-BUCKET-NAME/ --recursive \
  --exclude "*" \
  --include "*.html" \
  --content-type "text/html" \
  --metadata-directive REPLACE

aws s3 cp dist/ s3://YOUR-BUCKET-NAME/ --recursive \
  --exclude "*" \
  --include "*.js" \
  --content-type "application/javascript" \
  --metadata-directive REPLACE

aws s3 cp dist/ s3://YOUR-BUCKET-NAME/ --recursive \
  --exclude "*" \
  --include "*.css" \
  --content-type "text/css" \
  --metadata-directive REPLACE
```

#### Option B: AWS Console
1. Go to your S3 bucket
2. Click "Upload"
3. Drag and drop ALL contents from the `dist` folder (not the folder itself)
4. Make sure to upload:
   - `index.html`
   - `favicon.svg`
   - `logo.svg`
   - All image files (avatar-*.jpg)
   - The entire `assets` folder
   - The entire `logos` folder

### 4. CloudFront (Optional but Recommended)

For better performance and HTTPS:

1. Create a CloudFront distribution
2. Set Origin Domain to your S3 bucket website endpoint
3. Set Default Root Object to `index.html`
4. Create Custom Error Response:
   - HTTP Error Code: 403
   - Response Page Path: `/index.html`
   - HTTP Response Code: 200
5. Create another Custom Error Response:
   - HTTP Error Code: 404
   - Response Page Path: `/index.html`
   - HTTP Response Code: 200

### 5. Troubleshooting White Page

If you see a white page after deployment:

1. **Check Browser Console** (F12):
   - Look for 404 errors on assets
   - Check for CORS errors
   - Verify all JS/CSS files are loading

2. **Verify File Paths**:
   - All paths in `index.html` should start with `/`
   - Assets should be in `/assets/` folder

3. **Check S3 Bucket**:
   - Ensure all files from `dist` are uploaded
   - Verify bucket is public
   - Check static website hosting is enabled

4. **Clear Cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear browser cache
   - If using CloudFront, create an invalidation for `/*`

### 6. Verify Deployment

After uploading, visit your S3 website endpoint:
```
http://YOUR-BUCKET-NAME.s3-website-REGION.amazonaws.com
```

Or your CloudFront URL:
```
https://YOUR-DISTRIBUTION-ID.cloudfront.net
```

## Quick Deploy Script

Save this as `deploy.sh`:

```bash
#!/bin/bash
BUCKET_NAME="your-bucket-name"

echo "Building project..."
npm run build

echo "Uploading to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete

echo "Setting content types..."
aws s3 cp s3://$BUCKET_NAME/ s3://$BUCKET_NAME/ --recursive \
  --exclude "*" --include "*.html" \
  --content-type "text/html" --metadata-directive REPLACE

aws s3 cp s3://$BUCKET_NAME/ s3://$BUCKET_NAME/ --recursive \
  --exclude "*" --include "*.js" \
  --content-type "application/javascript" --metadata-directive REPLACE

aws s3 cp s3://$BUCKET_NAME/ s3://$BUCKET_NAME/ --recursive \
  --exclude "*" --include "*.css" \
  --content-type "text/css" --metadata-directive REPLACE

echo "Deployment complete!"
echo "Visit: http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

## Common Issues

### Issue: White page with no errors
**Solution**: Check that `index.html` is at the root of your bucket, not in a subfolder

### Issue: 404 on assets
**Solution**: Ensure the `assets` folder is uploaded and paths start with `/`

### Issue: Access Denied
**Solution**: Update bucket policy to allow public read access

### Issue: Fonts not loading
**Solution**: Check CORS configuration on S3 bucket
