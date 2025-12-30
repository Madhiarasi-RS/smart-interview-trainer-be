# Email Setup Guide

## 📧 Gmail SMTP Configuration

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com
2. Navigate to **Security** → **2-Step Verification**
3. Follow the steps to enable 2FA

### Step 2: Generate App Password
1. Visit: https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other** as the device and enter "Smart Interview Trainer"
4. Click **Generate**
5. Copy the 16-character app password

### Step 3: Update .env File
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=Smart Interview Trainer <your-email@gmail.com>
```

**Important:** Use the app password, NOT your regular Gmail password!

## 🌱 Seed Email Templates

Run this command to create the OTP email template in MongoDB:

```bash
npm run build
node dist/scripts/seed-email-templates.js
```

Or directly with ts-node:
```bash
npx ts-node src/scripts/seed-email-templates.ts
```

## 🧪 Test Email Sending

1. Start the server:
```bash
npm run start:dev
```

2. Send a test login request:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

3. Check your email for the OTP!

## 📊 Email Template Structure

Templates are stored in MongoDB with the following structure:

```typescript
{
  name: 'otp-verification',
  subject: 'Your OTP for Smart Interview Trainer',
  htmlBody: '<html>...{{otp}}...{{expiryMinutes}}...</html>',
  textBody: 'Your OTP: {{otp}}...',
  isActive: true,
  description: 'OTP email template'
}
```

### Template Variables

Use `{{variableName}}` syntax for placeholders:

**OTP Verification Template:**
- `{{otp}}` - The 6-digit OTP code
- `{{expiryMinutes}}` - OTP validity duration (5 minutes)
- `{{email}}` - User's email address

## 🔧 Troubleshooting

### "Failed to send email"
- Verify EMAIL_USER and EMAIL_PASSWORD in .env
- Ensure 2FA is enabled on Gmail
- Use app password, not regular password
- Check if Gmail is blocking "less secure apps" (shouldn't be an issue with app passwords)

### "Template not found"
- Run the seed script to create templates
- Check MongoDB connection
- Verify template name matches in code: `'otp-verification'`

### "Email sent but not received"
- Check spam/junk folder
- Verify recipient email address is valid
- Check Gmail sent items to confirm sending
- Review server logs for errors

## 📝 Adding New Templates

1. Create template in MongoDB using EmailService:

```typescript
await emailService.saveTemplate({
  name: 'your-template-name',
  subject: 'Subject with {{variable}}',
  htmlBody: '<html>...{{variable}}...</html>',
  textBody: 'Plain text with {{variable}}',
  isActive: true,
  description: 'Template description'
});
```

2. Send email using template:

```typescript
await emailService.sendTemplatedEmail(
  'recipient@example.com',
  'your-template-name',
  { variable: 'value' }
);
```

## 🚀 Production Recommendations

1. **Use dedicated email service:**
   - SendGrid
   - Amazon SES
   - Mailgun
   - Postmark

2. **Move OTP storage to Redis:**
   - Faster than in-memory
   - Persists across server restarts
   - Supports distributed systems

3. **Add rate limiting:**
   - Prevent OTP spam
   - Max 3 OTP requests per 15 minutes per email

4. **Monitor email deliverability:**
   - Track bounce rates
   - Monitor spam complaints
   - Set up DKIM, SPF, DMARC records

## 📚 Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [Google App Passwords](https://support.google.com/accounts/answer/185833)
