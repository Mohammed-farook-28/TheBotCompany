# Supabase Storage Setup for Image Uploads

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard:
   https://supabase.com/dashboard/project/fttidqzstrlzwnewgvgm/storage/buckets

2. Click "New bucket"

3. Configure the bucket:
   - Name: `event-images`
   - Public bucket: ✅ YES (check this box)
   - Click "Create bucket"

## Step 2: Set Up Storage Policy

Go to SQL Editor and run this:

```sql
-- Allow public read access to event images
CREATE POLICY "Public read access for event images" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'event-images');

-- Allow authenticated users to upload event images
CREATE POLICY "Allow upload for event images" 
ON storage.objects 
FOR INSERT 
TO public
WITH CHECK (bucket_id = 'event-images');

-- Allow delete for event images
CREATE POLICY "Allow delete for event images" 
ON storage.objects 
FOR DELETE 
TO public
USING (bucket_id = 'event-images');
```

## Step 3: Test Upload

Once the bucket is created, the admin panel will allow you to:
- Click "Upload Image" button
- Select an image file (PNG, JPG, GIF)
- Image will be automatically uploaded to Supabase Storage
- The image URL will be used for the event

## File Size Limits

- Maximum file size: 50MB (default Supabase limit)
- Recommended: Keep images under 5MB for better performance
- Supported formats: JPG, PNG, GIF, WebP

## Getting the Public URL

After upload, images will be accessible at:
```
https://fttidqzstrlzwnewgvgm.supabase.co/storage/v1/object/public/event-images/filename.jpg
```

This URL is automatically generated and stored in your event's `image_url` field.


