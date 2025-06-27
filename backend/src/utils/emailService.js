const nodemailer = require('nodemailer');
const logger = require('./logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info('Email service connected successfully');
    } catch (error) {
      logger.error('Email service connection failed:', error);
    }
  }

  async sendEmail(to, subject, html, text = '') {
    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to,
        subject,
        html,
        text: text || this.extractTextFromHtml(html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${to}`, { messageId: result.messageId });
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  extractTextFromHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  async sendWelcomeEmail(user) {
    const subject = `Welcome to ScholarConnect, ${user.name}!`;
    const html = this.generateWelcomeTemplate(user);
    return this.sendEmail(user.email, subject, html);
  }

  async sendOTPEmail(email, otp, name) {
    const subject = 'Verify Your Email - ScholarConnect';
    const html = this.generateOTPTemplate(name, otp);
    return this.sendEmail(email, subject, html);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const subject = 'Reset Your Password - ScholarConnect';
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = this.generatePasswordResetTemplate(user.name, resetUrl);
    return this.sendEmail(user.email, subject, html);
  }

  async sendConsultationConfirmation(student, advisor, consultation) {
    const subject = 'Consultation Confirmed - ScholarConnect';
    const html = this.generateConsultationTemplate(student, advisor, consultation);
    return this.sendEmail(student.email, subject, html);
  }

  generateWelcomeTemplate(user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to ScholarConnect</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Welcome to ScholarConnect!</h1>
            <p>Your journey to academic success starts here</p>
          </div>
          
          <div class="content">
            <h2>Hi ${user.name},</h2>
            <p>Welcome to ScholarConnect! We're thrilled to have you join our community.</p>
            
            <p>With ScholarConnect, you can:</p>
            <ul>
              <li>Discover thousands of scholarship opportunities</li>
              <li>Connect with expert advisors</li>
              <li>Get personalized guidance for your academic journey</li>
              <li>Access exclusive resources and tools</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Get Started</a>
            </div>
            
            <p>If you have any questions, our support team is here to help!</p>
            
            <p>Best regards,<br>The ScholarConnect Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 ScholarConnect. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateOTPTemplate(name, otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Verify Your Email</h1>
          </div>
          
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Please use the following verification code to complete your registration:</p>
            
            <div class="otp-code">${otp}</div>
            
            <p>This code will expire in 10 minutes for security reasons.</p>
            
            <p>If you didn't request this verification, please ignore this email.</p>
            
            <p>Best regards,<br>The ScholarConnect Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 ScholarConnect. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generatePasswordResetTemplate(name, resetUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Your Password</h1>
          </div>
          
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>This link will expire in 1 hour for security reasons.</p>
            
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            
            <p>Best regards,<br>The ScholarConnect Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 ScholarConnect. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateConsultationTemplate(student, advisor, consultation) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Consultation Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .consultation-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Consultation Confirmed</h1>
          </div>
          
          <div class="content">
            <h2>Hi ${student.name},</h2>
            <p>Your consultation has been confirmed! Here are the details:</p>
            
            <div class="consultation-details">
              <h3>Consultation Details</h3>
              <p><strong>Advisor:</strong> ${advisor.name}</p>
              <p><strong>Date:</strong> ${new Date(consultation.scheduled_at).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${new Date(consultation.scheduled_at).toLocaleTimeString()}</p>
              <p><strong>Duration:</strong> ${consultation.duration} minutes</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${consultation.meeting_link || `${process.env.FRONTEND_URL}/chat`}" class="button">Join Meeting</a>
            </div>
            
            <p>Please be prepared and have any questions ready for your session.</p>
            
            <p>Best regards,<br>The ScholarConnect Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 ScholarConnect. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();