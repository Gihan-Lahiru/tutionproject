# Email Verification Setup Guide

## Overview
The system now includes email verification for new user registrations. Users must verify their email address before they can log in.

## How It Works

1. **User Registration**: User fills out the registration form
2. **Email Sent**: A 6-digit verification code is sent to the user's email
3. **Verification**: User enters the code on the verification page
4. **Account Activation**: Once verified, the user can log in

## Setup Instructions

### 1. Configure Email Service

Update your `.env` file in the backend folder with email credentials:

```env
# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 2. For Gmail Users

If using Gmail, you need to generate an **App Password**:

1. Go to your Google Account: https://myaccount.google.com/
2. Select **Security**
3. Under "Signing in to Google," select **2-Step Verification** (enable if not already)
4. At the bottom, select **App passwords**
5. Select **Mail** and **Other (Custom name)**
6. Enter "Tuition Sir LMS" and click **Generate**
7. Copy the 16-character password and use it as `EMAIL_PASSWORD` in your .env file

### 3. For Other Email Providers

Update these settings in `backend/utils/emailService.js`:

```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

### 4. Run Database Migration

The migration should already be run, but if needed:

```bash
cd backend
node scripts/add-email-verification.js
```

### 5. Restart Backend Server

After configuring the environment variables, restart your backend:

```bash
cd backend
npm run dev
```

## Features

### Email Template
- Professional HTML email template with branding
- Clear 6-digit verification code display
- 10-minute expiration notice
- Responsive design

### Security Features
- Verification codes expire after 10 minutes
- Codes are stored securely in the database
- Users cannot log in until email is verified
- Option to resend verification code

### User Experience
- Clean verification page with 6 separate input boxes
- Auto-focus on next input when entering digits
- Paste support for copying codes
- Resend code functionality
- Clear error messages

## Testing

### Test the Flow:

1. Register a new user at: http://localhost:3001/register
2. Check the email for the verification code
3. Enter the code at: http://localhost:3001/verify-email
4. Try logging in after verification

### Development Mode:

During development, check the backend console for the verification code if email sending fails.

## Troubleshooting

### Email Not Sending

1. **Check Email Credentials**: Verify EMAIL_USER and EMAIL_PASSWORD in .env
2. **Gmail App Password**: Make sure you're using an App Password, not your regular password
3. **2-Step Verification**: Gmail requires 2-Step Verification to be enabled
4. **Firewall**: Check if port 587 is blocked
5. **Console Logs**: Check backend console for email service errors

### Code Not Working

1. **Expired Code**: Verification codes expire after 10 minutes - use "Resend Code"
2. **Wrong Code**: Double-check the code from the email
3. **Database**: Ensure migration was successful

### Cannot Log In

1. **Verify Email First**: Users must verify email before logging in
2. **Check Email Verified Status**: Query the database to check `email_verified` column
3. **Resend Code**: Use the "Resend Code" button on the verification page

## Database Schema

New columns added to `users` table:

```sql
email_verified INTEGER DEFAULT 0  -- 0 = not verified, 1 = verified
verification_code TEXT            -- 6-digit code
verification_code_expires TEXT    -- ISO timestamp for expiration
```

## API Endpoints

### POST /api/auth/register
Registers user and sends verification email

**Response:**
```json
{
  "message": "Registration successful. Please check your email for verification code.",
  "user": { ... },
  "requiresVerification": true
}
```

### POST /api/auth/verify-email
Verifies email with code

**Request:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "message": "Email verified successfully",
  "token": "jwt_token",
  "user": { ... }
}
```

### POST /api/auth/resend-verification
Resends verification code

**Request:**
```json
{
  "email": "user@example.com"
}
```

### POST /api/auth/login
Login checks email verification status

**Error Response (Unverified):**
```json
{
  "message": "Please verify your email before logging in",
  "requiresVerification": true,
  "email": "user@example.com"
}
```

## Customization

### Change Code Length
Edit `backend/utils/emailService.js`:
```javascript
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
};
```

### Change Expiration Time
Edit `backend/controllers/authController.js`:
```javascript
const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
```

### Customize Email Template
Edit the HTML template in `backend/utils/emailService.js`

## Production Considerations

1. **Use Professional Email Service**: Consider SendGrid, AWS SES, or Mailgun for production
2. **Rate Limiting**: Add rate limiting to prevent verification code spam
3. **Monitoring**: Log email sending failures for investigation
4. **Backup**: Ensure database backups include verification data
5. **Security**: Keep EMAIL_PASSWORD secure and never commit to version control

## Support

If you encounter issues:
1. Check backend console for error logs
2. Verify .env configuration
3. Test email service connectivity
4. Review database migration status
