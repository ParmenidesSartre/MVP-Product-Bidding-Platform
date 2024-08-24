export const template = (resetCode: string, userName: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Password Reset - SecurePass</title>
        <style>
          body {
            font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
            background-color: #f2f4f6;
            color: #51545e;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
          }
          .email-wrapper {
            width: 100%;
            background-color: #f2f4f6;
            padding: 20px;
            box-sizing: border-box;
          }
          .email-content {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
            margin: 0 auto;
            max-width: 570px;
            box-sizing: border-box;
          }
          h1 {
            color: #333333;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 24px;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            color: #51545e;
            margin-bottom: 24px;
          }
          .reset-code {
            font-size: 24px;
            font-weight: bold;
            color: #22bc66;
            text-align: center;
            margin: 24px 0;
            display: block;
            letter-spacing: 2px;
          }
          .email-footer {
            text-align: center;
            padding: 20px;
            font-size: 13px;
            color: #a8aaaf;
          }
          .email-footer p {
            margin: 0;
            color: #6b7280;
          }
          @media only screen and (max-width: 600px) {
            .email-content {
              padding: 16px;
              border-radius: 5px;
            }
            h1 {
              font-size: 20px;
            }
            p {
              font-size: 14px;
            }
            .reset-code {
              font-size: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-content">
            <h1>Hi ${userName},</h1>
            <p>You recently requested to reset your password for your SecurePass account. Use the code below to reset it. This password reset code is only valid for the next 10 minutes.</p>
            <div class="reset-code">${resetCode}</div>
            <p>If you did not request a password reset, please ignore this email or <a href="https://securepass.com/support">contact support</a> if you have questions.</p>
            <p>Thanks,<br>The SecurePass Team</p>
          </div>
          <div class="email-footer">
            <p>&copy; ${new Date().getFullYear()} SecurePass. All rights reserved.</p>
            <p>SecurePass, Inc., 1234 Innovation Way, Tech City, TX 78910</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
