require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your email provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email Template Generator
const createEmailTemplate = (name, message) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #FDFBF7;
                margin: 0;
                padding: 0;
                color: #4A3728;
            }
            .container {
                max-width: 600px;
                margin: 30px auto;
                background-color: #ffffff;
                border-radius: 4px;
                overflow: hidden;
                box-shadow: 0 15px 45px rgba(74, 55, 40, 0.08);
                border: 1px solid #E5DFD9;
            }
            .header-banner {
                background-color: #4A3728;
                padding: 40px 20px;
                text-align: center;
                border-bottom: 5px solid #C19A6B;
            }
            .header-banner h1 {
                margin: 0;
                color: #F5F5F0;
                font-size: 28px;
                text-transform: uppercase;
                letter-spacing: 3px;
                font-weight: 300;
            }
            .header-banner p {
                margin: 5px 0 0;
                color: #C19A6B;
                font-size: 14px;
                letter-spacing: 2px;
                text-transform: uppercase;
            }
            .content {
                padding: 50px 40px;
                line-height: 1.8;
            }
            .content h2 {
                color: #4A3728;
                margin-top: 0;
                font-weight: 600;
                border-bottom: 1px solid #F0EAE4;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .message-box {
                background-color: #FDFBF7;
                border-left: 3px solid #C19A6B;
                padding: 25px;
                margin: 25px 0;
                color: #5D4330;
                font-style: italic;
                font-size: 1.1rem;
            }
            .footer {
                background-color: #4A3728;
                color: #A89587;
                text-align: center;
                padding: 40px;
                font-size: 13px;
            }
            .footer a {
                color: #C19A6B;
                text-decoration: none;
            }
            .button {
                display: inline-block;
                padding: 16px 45px;
                background-color: #C19A6B;
                color: #ffffff;
                text-decoration: none;
                border-radius: 2px;
                margin-top: 20px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 2px;
                font-size: 13px;
            }
            .website-link {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #F0EAE4;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header-banner">
                <h1>PALLAVI PATEL | AI FULLSTACK DEVELOPER</h1>
            </div>
            <div class="content">
                <h2>Hi ${name} Team,</h2>
                <p>I recently discovered <strong>${name}</strong> while researching highly-rated local salons. Your reputation for quality is evident, but I noticed an opportunity to significantly enhance how new clients find and book your services online.</p>
                <div class="message-box">
                    "${message}"
                </div>
                <p>I specialize in building bespoke digital solutions for premium service providers. If you're open to it, I'd love to share a few specific ideas on how we can elevate the digital presence of <strong>${name}</strong>.</p>
                
                <p>Best regards,<br><strong>Pallavi Patel</strong><br>AI Full Stack Developer</p>
                <div class="website-link">
                    <p style="margin-bottom: 10px; font-weight: bold;">Visit this website just for your salon</p>
                    <a href="https://salon-eight-rho.vercel.app/" class="button" style="color: #ffffff;">Visit Salon Website</a>
                </div>
            </div>
            <div class="footer">
                <strong>PALLAVI PATEL</strong> | AI Full Stack Developer<br>
                <a href="mailto:pallavipayel8080@gmail.com">pallavipayel8080@gmail.com</a> | <a href="tel:+917860248805">(+91)7860248805</a>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Export template for bulk-send script
if (require.main !== module) {
    module.exports = { createEmailTemplate };
}

// Route to send email
app.post('/send-email', (req, res) => {
    const { to, name, subject, message } = req.body;

    if (!to || !name || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: createEmailTemplate(name, message)
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('');
            return res.status(500).json({ error: 'Failed to send email' });
        }
        res.status(200).json({ message: 'Email sent successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
