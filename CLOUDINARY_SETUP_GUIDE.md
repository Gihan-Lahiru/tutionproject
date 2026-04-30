# File Storage Setup Guide for Client

## Overview
This application uses **Cloudinary** for storing uploaded files (profile pictures, papers, notes, assignments, and videos). Cloudinary provides a free tier with 25GB storage and 25GB bandwidth per month.

## Step 1: Create Cloudinary Account (FREE)

1. Go to [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Sign up with your email
3. Verify your email address
4. Login to Cloudinary Dashboard

## Step 2: Get Your Credentials

After logging in to Cloudinary:
1. Go to **Dashboard** (default landing page)
2. You'll see your credentials:
   - **Cloud Name**: e.g., `dxxxxxxxxxxxx`
   - **API Key**: e.g., `123456789012345`
   - **API Secret**: Click "👁️ Reveal" to see it

## Step 3: Configure Your Application

### For Render.com Deployment:

1. Go to your Render Dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Add these three environment variables:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

4. Click **Save Changes**
5. Your app will automatically redeploy

### For Local Development:

Add these lines to your `.env` file in the backend folder:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## Step 4: Verify Setup

After adding credentials:
1. Try uploading a profile picture in the app
2. Check Cloudinary Dashboard → Media Library
3. You should see your uploaded file in `tuition-app/profiles` folder

## File Storage Organization

Files are automatically organized in folders:
- `tuition-app/profiles/` - Profile pictures
- `tuition-app/papers/` - Question papers, notes, assignments
- `tuition-app/videos/` - Video lessons

## Storage Limits (FREE Tier)

- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25 credits/month
- **No credit card required**

## Upgrade Options

If you exceed free tier limits:
- **Plus Plan**: $89/month (85GB storage, 160GB bandwidth)
- **Advanced Plan**: $224/month (205GB storage, 340GB bandwidth)

## Support

- Cloudinary Documentation: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- Contact Cloudinary Support: [https://support.cloudinary.com](https://support.cloudinary.com)

## Important Notes

⚠️ **Keep your API Secret secure!**
- Never commit `.env` file to GitHub
- Never share API Secret publicly
- If exposed, regenerate it from Cloudinary Dashboard

✅ **Backup your files**
- Cloudinary has built-in redundancy
- Files are stored across multiple servers
- 99.9% uptime guarantee

## Alternative Storage Options

If you prefer other services, you can also use:
1. **AWS S3** - More technical, pay-as-you-go
2. **Azure Blob Storage** - Microsoft's cloud storage
3. **Google Cloud Storage** - Google's cloud storage
4. **Uploadcare** - Similar to Cloudinary

All require similar environment variable setup.
