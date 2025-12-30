import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { EmailService } from '../common/services/email.service';

/**
 * Seed Email Templates Script
 *
 * Seeds default email templates into MongoDB
 *
 * Usage:
 * npm run build
 * node dist/scripts/seed-email-templates.js
 *
 * Or directly with ts-node:
 * npx ts-node src/scripts/seed-email-templates.ts
 */

async function seedEmailTemplates() {
  console.log('🌱 Seeding email templates...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const emailService = app.get(EmailService);

  try {
    // OTP Verification Email Template
    await emailService.saveTemplate({
      name: 'otp-verification',
      subject: 'Your OTP for Smart Interview Trainer',
      htmlBody: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 50px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .otp-box {
      background-color: #f8f9fa;
      border: 2px dashed #667eea;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
      display: inline-block;
    }
    .otp-code {
      font-size: 36px;
      font-weight: bold;
      color: #667eea;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
    }
    .expiry {
      color: #dc3545;
      font-size: 14px;
      margin-top: 10px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #6c757d;
      font-size: 12px;
    }
    .info-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Smart Interview Trainer</h1>
    </div>
    <div class="content">
      <h2>Welcome back!</h2>
      <p>You requested to log in to your account. Use the OTP below to continue:</p>
      
      <div class="otp-box">
        <div class="otp-code">{{otp}}</div>
        <div class="expiry">⏱️ Valid for {{expiryMinutes}} minutes</div>
      </div>

      <div class="info-box">
        <strong>⚠️ Security Tips:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Never share your OTP with anyone</li>
          <li>Our team will never ask for your OTP</li>
          <li>If you didn't request this, ignore this email</li>
        </ul>
      </div>

      <p style="color: #6c757d;">
        Logging in as: <strong>{{email}}</strong>
      </p>
    </div>
    <div class="footer">
      <p>© 2025 Smart Interview Trainer. All rights reserved.</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
      `,
      textBody: `
Smart Interview Trainer - OTP Verification

Your OTP: {{otp}}
Valid for: {{expiryMinutes}} minutes

Login email: {{email}}

Security Tips:
- Never share your OTP with anyone
- Our team will never ask for your OTP
- If you didn't request this, ignore this email

© 2025 Smart Interview Trainer
      `,
      isActive: true,
      description:
        'OTP verification email sent during login. Variables: otp, expiryMinutes, email',
    });

    console.log('✅ OTP verification template created');

    // Welcome Email Template (bonus)
    await emailService.saveTemplate({
      name: 'welcome',
      subject: 'Welcome to Smart Interview Trainer! 🎉',
      htmlBody: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 50px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; }
    .cta-button { display: inline-block; background-color: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to Smart Interview Trainer!</h1>
    </div>
    <div class="content">
      <h2>Hi {{userName}}!</h2>
      <p>We're thrilled to have you join us. Get ready to ace your interviews with AI-powered practice sessions.</p>
      <h3>What's Next?</h3>
      <ul>
        <li>📝 Complete your profile</li>
        <li>🎯 Choose your domain focus</li>
        <li>💬 Start your first practice interview</li>
        <li>📊 Track your progress with detailed analytics</li>
      </ul>
      <p style="text-align: center;">
        <a href="{{dashboardUrl}}" class="cta-button">Go to Dashboard</a>
      </p>
    </div>
    <div class="footer">
      <p>© 2025 Smart Interview Trainer. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `,
      textBody:
        'Welcome to Smart Interview Trainer, {{userName}}! Visit {{dashboardUrl}} to get started.',
      isActive: true,
      description:
        'Welcome email for new users. Variables: userName, dashboardUrl',
    });

    console.log('✅ Welcome template created');

    console.log('\n🎉 Email templates seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding templates:', error);
  } finally {
    await app.close();
  }
}

seedEmailTemplates();
