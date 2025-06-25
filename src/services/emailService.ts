interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface OrderConfirmationData {
  orderId: string;
  packageName: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  purchaseDate: Date;
  materials: string[];
  nextSteps: string[];
}

interface ConsultationReminderData {
  customerName: string;
  advisorName: string;
  sessionDate: Date;
  sessionTime: string;
  meetingLink: string;
  packageName: string;
}

class EmailService {
  private apiUrl = '/api/email'; // In real app, this would be your backend URL

  // Send order confirmation email
  async sendOrderConfirmation(data: OrderConfirmationData): Promise<void> {
    try {
      const template = this.generateOrderConfirmationTemplate(data);
      
      console.log('Sending order confirmation email:', {
        to: data.customerEmail,
        subject: template.subject,
        html: template.html
      });

      // In real app, this would call your email service API
      // await fetch(`${this.apiUrl}/send`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     to: data.customerEmail,
      //     subject: template.subject,
      //     html: template.html,
      //     text: template.text
      //   })
      // });

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Order confirmation email sent successfully');
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw error;
    }
  }

  // Send consultation reminder email
  async sendConsultationReminder(data: ConsultationReminderData): Promise<void> {
    try {
      const template = this.generateConsultationReminderTemplate(data);
      
      console.log('Sending consultation reminder email:', {
        subject: template.subject,
        html: template.html
      });

      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Consultation reminder email sent successfully');
    } catch (error) {
      console.error('Error sending consultation reminder email:', error);
      throw error;
    }
  }

  // Send welcome email for new users
  async sendWelcomeEmail(userEmail: string, userName: string, userRole: string): Promise<void> {
    try {
      const template = this.generateWelcomeTemplate(userName, userRole);
      
      console.log('Sending welcome email:', {
        to: userEmail,
        subject: template.subject
      });

      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Welcome email sent successfully');
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  // Generate order confirmation email template
  private generateOrderConfirmationTemplate(data: OrderConfirmationData): EmailTemplate {
    const subject = `Order Confirmation - ${data.packageName} Package`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .materials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for choosing ScholarConnect</p>
          </div>
          
          <div class="content">
            <h2>Hi ${data.customerName},</h2>
            <p>Your order has been successfully processed! We're excited to help you on your scholarship journey.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Order ID:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Package:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.packageName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Amount:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">$${data.amount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Purchase Date:</strong></td>
                  <td style="padding: 8px 0;">${data.purchaseDate.toLocaleDateString()}</td>
                </tr>
              </table>
            </div>

            <div class="materials">
              <h3>📚 Your Materials</h3>
              <p>You now have access to the following resources:</p>
              <ul>
                ${data.materials.map(material => `<li>${material}</li>`).join('')}
              </ul>
              <a href="#" class="button">Access Materials</a>
            </div>

            <div class="materials">
              <h3>🚀 Next Steps</h3>
              <ol>
                ${data.nextSteps.map(step => `<li>${step}</li>`).join('')}
              </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="#" class="button">Schedule Your First Session</a>
            </div>

            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>The ScholarConnect Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 ScholarConnect. All rights reserved.</p>
            <p>Need help? Contact us at support@scholarconnect.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Order Confirmation - ${data.packageName} Package
      
      Hi ${data.customerName},
      
      Your order has been successfully processed!
      
      Order Details:
      - Order ID: ${data.orderId}
      - Package: ${data.packageName}
      - Amount: $${data.amount}
      - Purchase Date: ${data.purchaseDate.toLocaleDateString()}
      
      Your Materials:
      ${data.materials.map(material => `- ${material}`).join('\n')}
      
      Next Steps:
      ${data.nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}
      
      Best regards,
      The ScholarConnect Team
    `;

    return { subject, html, text };
  }

  // Generate consultation reminder email template
  private generateConsultationReminderTemplate(data: ConsultationReminderData): EmailTemplate {
    const subject = `Reminder: Your consultation with ${data.advisorName} is tomorrow`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Consultation Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .session-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Consultation Reminder</h1>
            <p>Your session is coming up!</p>
          </div>
          
          <div class="content">
            <h2>Hi ${data.customerName},</h2>
            <p>This is a friendly reminder about your upcoming consultation session.</p>
            
            <div class="session-details">
              <h3>Session Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Advisor:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.advisorName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Package:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.packageName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Date:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.sessionDate.toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Time:</strong></td>
                  <td style="padding: 8px 0;">${data.sessionTime}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.meetingLink}" class="button">Join Video Call</a>
            </div>

            <div class="session-details">
              <h3>📋 Preparation Tips</h3>
              <ul>
                <li>Test your camera and microphone beforehand</li>
                <li>Prepare any questions you'd like to discuss</li>
                <li>Have your documents ready for review</li>
                <li>Find a quiet space for the call</li>
              </ul>
            </div>

            <p>Looking forward to helping you succeed!</p>
            
            <p>Best regards,<br>The ScholarConnect Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 ScholarConnect. All rights reserved.</p>
            <p>Need to reschedule? Contact us at support@scholarconnect.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Consultation Reminder
      
      Hi ${data.customerName},
      
      This is a reminder about your upcoming consultation:
      
      - Advisor: ${data.advisorName}
      - Package: ${data.packageName}
      - Date: ${data.sessionDate.toLocaleDateString()}
      - Time: ${data.sessionTime}
      
      Meeting Link: ${data.meetingLink}
      
      Preparation Tips:
      - Test your camera and microphone
      - Prepare questions
      - Have documents ready
      - Find a quiet space
      
      Best regards,
      The ScholarConnect Team
    `;

    return { subject, html, text };
  }

  // Generate welcome email template
  private generateWelcomeTemplate(userName: string, userRole: string): EmailTemplate {
    const subject = `Welcome to ScholarConnect, ${userName}!`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ScholarConnect</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .feature { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
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
            <h2>Hi ${userName},</h2>
            <p>Welcome to ScholarConnect! We're thrilled to have you join our community of ${userRole === 'student' ? 'ambitious students' : 'expert advisors'}.</p>
            
            ${userRole === 'student' ? `
              <div class="feature">
                <h3>🔍 What you can do as a Student:</h3>
                <ul>
                  <li>Browse thousands of scholarship opportunities</li>
                  <li>Connect with expert advisors</li>
                  <li>Get personalized guidance</li>
                  <li>Access exclusive resources and materials</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" class="button">Explore Scholarships</a>
                <a href="#" class="button">Find Advisors</a>
              </div>
            ` : `
              <div class="feature">
                <h3>👨‍🏫 What you can do as an Advisor:</h3>
                <ul>
                  <li>Create your professional profile</li>
                  <li>Set your consulting packages</li>
                  <li>Connect with students worldwide</li>
                  <li>Share your expertise and earn income</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" class="button">Complete Your Profile</a>
                <a href="#" class="button">Set Up Packages</a>
              </div>
            `}

            <div class="feature">
              <h3>🚀 Getting Started</h3>
              <ol>
                <li>Complete your profile</li>
                <li>${userRole === 'student' ? 'Browse scholarships and advisors' : 'Set up your consulting packages'}</li>
                <li>${userRole === 'student' ? 'Book your first consultation' : 'Start helping students succeed'}</li>
              </ol>
            </div>

            <p>If you have any questions, our support team is here to help!</p>
            
            <p>Best regards,<br>The ScholarConnect Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 ScholarConnect. All rights reserved.</p>
            <p>Questions? Contact us at support@scholarconnect.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to ScholarConnect, ${userName}!
      
      We're thrilled to have you join our community.
      
      ${userRole === 'student' ? 
        'As a student, you can browse scholarships, connect with advisors, and get personalized guidance.' :
        'As an advisor, you can create your profile, set up packages, and help students succeed.'
      }
      
      Getting Started:
      1. Complete your profile
      2. ${userRole === 'student' ? 'Browse scholarships and advisors' : 'Set up your consulting packages'}
      3. ${userRole === 'student' ? 'Book your first consultation' : 'Start helping students'}
      
      Best regards,
      The ScholarConnect Team
    `;

    return { subject, html, text };
  }

  // Send payment receipt
  async sendPaymentReceipt(orderData: OrderConfirmationData): Promise<void> {
    try {
      const nextSteps = [
        'Check your email for access to materials',
        'Complete your profile if you haven\'t already',
        'Schedule your first consultation session',
        'Download and review your package materials',
        'Prepare questions for your advisor'
      ];

      await this.sendOrderConfirmation({
        ...orderData,
        nextSteps
      });
    } catch (error) {
      console.error('Error sending payment receipt:', error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
export default emailService;