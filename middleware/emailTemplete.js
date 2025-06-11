exports.Verification_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your WanderLust Email</title>
      <style>
          body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f6f6f6;
              color: #2d3748;
          }
          .container {
              max-width: 640px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
              overflow: hidden;
              border: 1px solid #e2e8f0;
          }
          .header {
              background: linear-gradient(135deg, #38b2ac 0%, #4fd1c5 100%);
              color: white;
              padding: 24px;
              text-align: center;
              font-size: 28px;
              font-weight: 600;
              letter-spacing: 0.5px;
          }
          .content {
              padding: 32px;
              line-height: 1.7;
              font-size: 16px;
          }
          .verification-code {
              display: block;
              margin: 24px 0;
              font-size: 24px;
              color: #2c7a7b;
              background: #e6fffa;
              border: 2px solid #4fd1c5;
              padding: 12px;
              text-align: center;
              border-radius: 8px;
              font-weight: 700;
              letter-spacing: 3px;
          }
          .footer {
              background-color: #edf2f7;
              padding: 16px;
              text-align: center;
              color: #718096;
              font-size: 13px;
              border-top: 1px solid #e2e8f0;
          }
          p {
              margin: 0 0 16px;
          }
          .support-link {
              color: #4fd1c5;
              text-decoration: none;
              font-weight: 500;
          }
          .support-link:hover {
              text-decoration: underline;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Verify Your WanderLust Adventure</div>
          <div class="content">
              <p>Hello, Explorer!</p>
              <p>Welcome to <strong>WanderLust</strong>, your gateway to unforgettable travel experiences! To embark on your journey, please verify your email by entering the code below:</p>
              <span class="verification-code">{verificationCode}</span>
              <p>This code is your ticket to unlocking a world of destinations. If you didn’t sign up, no worries—simply ignore this email. For any questions, our friendly team is here to help at <a href="mailto:support@wanderlust.com" class="support-link">support@wanderlust.com</a>.</p>
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} WanderLust. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

exports.Welcome_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to WanderLust</title>
      <style>
          body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f6f6f6;
              color: #2d3748;
          }
          .container {
              max-width: 640px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
              overflow: hidden;
              border: 1px solid #e2e8f0;
          }
          .header {
              background: linear-gradient(135deg, #3182ce 0%, #63b3ed 100%);
              color: white;
              padding: 24px;
              text-align: center;
              font-size: 28px;
              font-weight: 600;
              letter-spacing: 0.5px;
          }
          .content {
              padding: 32px;
              line-height: 1.7;
              font-size: 16px;
          }
          .welcome-message {
              font-size: 20px;
              font-weight: 600;
              margin: 0 0 16px;
          }
          .button {
              display: inline-block;
              padding: 12px 32px;
              margin: 24px 0;
              background: #3182ce;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              text-align: center;
              font-size: 16px;
              font-weight: 600;
              transition: background-color 0.3s ease;
          }
          .button:hover {
              background: #2b6cb0;
          }
          .footer {
              background-color: #edf2f7;
              padding: 16px;
              text-align: center;
              color: #718096;
              font-size: 13px;
              border-top: 1px solid #e2e8f0;
          }
          ul {
              margin: 16px 0;
              padding-left: 24px;
          }
          li {
              margin-bottom: 8px;
          }
          .support-link {
              color: #3182ce;
              text-decoration: none;
              font-weight: 500;
          }
          .support-link:hover {
              text-decoration: underline;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Welcome to WanderLust!</div>
          <div class="content">
              <p class="welcome-message">Hello {name},</p>
              <p>Your adventure with <strong>WanderLust</strong> has officially begun! We’re beyond excited to have you in our community of explorers. Get ready to discover breathtaking destinations and create memories that last a lifetime.</p>
              <p>Here’s how to kick off your journey:</p>
              <ul>
                  <li>Discover unique stays and hidden gems around the globe.</li>
                  <li>Dive into our <a href="https://wanderlust.com/blog" class="support-link">travel blog</a> for inspiration and expert tips.</li>
                  <li>Need assistance? Our team is just an email away at <a href="mailto:support@wanderlust.com" class="support-link">support@wanderlust.com</a>.</li>
              </ul>
              <a href="https://wanderlust-app-b9uj.onrender.com/" class="button">Start Exploring Now</a>
              <p>Thank you for choosing <strong>WanderLust</strong>. Let’s make every moment an adventure!</p>
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} WanderLust. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;
