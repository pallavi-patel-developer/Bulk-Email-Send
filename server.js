require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const createEmailTemplate = (name, message, templateId = 'professional') => {
    if (templateId === 'modern') {
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 40px 0; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
            .header { background-color: #111111; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 400; letter-spacing: 2px; }
            .content { padding: 40px; line-height: 1.6; }
            .content h2 { margin-top: 0; font-weight: 500; font-size: 20px; }
            .message-box { border-left: 4px solid #111111; padding-left: 20px; margin: 30px 0; font-style: italic; color: #555555; }
            .footer { background-color: #f7f7f7; text-align: center; padding: 30px; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; }
            .button { display: inline-block; padding: 12px 30px; background-color: #111111; color: #ffffff; text-decoration: none; border-radius: 4px; margin-top: 20px; font-weight: 500; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>PALLAVI PATEL</h1>
            </div>
            <div class="content">
                <h2>Hi ${name} Team,</h2>
                <p>I specialize in modern digital solutions for premium businesses.</p>
                <div class="message-box">"${message}"</div>
                <p>Let's elevate your digital presence.</p>
                <p>Best,<br><strong>Pallavi Patel</strong></p>
                <a href="https://salon-eight-rho.vercel.app/" class="button" style="color: #ffffff;">View Portfolio</a>
            </div>
            <div class="footer">
                <strong>PALLAVI PATEL</strong> | pallavipayel8080@gmail.com
            </div>
        </div>
    </body>
    </html>
        `;
    } else if (templateId === 'lawyer') {
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px 0; color: #18181b; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.06); }
            .header { background-color: #000000; padding: 50px 40px; text-align: center; position: relative; }
            .header::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #ff6bcb, #e11d48); }
            .header h1 { margin: 0; color: #ffffff; font-size: 32px; font-family: 'Playfair Display', Georgia, serif; font-weight: 600; letter-spacing: 0.5px; }
            .header p { color: #fdf2f8; font-size: 13px; margin-top: 10px; letter-spacing: 3px; text-transform: uppercase; font-weight: 600; opacity: 0.9; }
            .content { padding: 50px 40px; line-height: 1.8; font-size: 16px; color: #27272a; }
            .content h2 { margin-top: 0; color: #000000; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 600; }
            .message-box { background-color: #fafafa; border-left: 4px solid #e11d48; padding: 25px 30px; margin: 35px 0; color: #18181b; font-style: italic; font-size: 17px; border-radius: 0 8px 8px 0; }
            .footer { background-color: #ffffff; text-align: center; padding: 35px; font-size: 13px; color: #71717a; border-top: 1px solid #f4f4f5; }
            .footer a { color: #e11d48; text-decoration: none; font-weight: 600; }
            .button { display: inline-block; padding: 16px 45px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 50px; margin-top: 30px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; transition: all 0.3s ease; box-shadow: 0 8px 20px rgba(0,0,0,0.15); border: 1px solid #000000; }
            .button:hover { background-color: #ffffff; color: #000000; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Pallavi Patel</h1>
                <p>Ai FullStack Developer (Freelancer)</p>
            </div>
            <div class="content">
                <h2>Dear ${name} Team,</h2>
                
                <p>I came across your practice and noticed your online presence — you’re doing great work, but your website isn’t fully reflecting that professionalism or converting visitors into inquiries.</p>
                <div class="message-box">"${message}"</div>
                <p>I have a few specific improvement ideas for your current website (layout, clarity, and conversion flow).</p>
                <p>Would you be open to a quick 10-minute call or should I send a short audit?</p>
                <p>Sincerely,<br><strong>Pallavi Patel</strong></p>
                <div style="text-align: center;">
                    <a href="https://lawyer-web-portfolio.onrender.com/" class="button">Review Lawyer Portfolio</a>
                </div>
            </div>
            <div class="footer">
                Pallavi Patel | <a href="mailto:pallavipayel8080@gmail.com">pallavipayel8080@gmail.com</a><br><br>
               
            </div>
        </div>
    </body>
    </html>
        `;
    } else if (templateId === 'creative') {
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8; margin: 0; padding: 40px 0; color: #2d3748; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #FF6B6B, #4ECDC4); padding: 50px 20px; text-align: center; }
            .header h1 { margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .content { padding: 40px; line-height: 1.7; font-size: 16px; }
            .content h2 { margin-top: 0; color: #FF6B6B; font-weight: 600; }
            .message-box { background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; color: #4a5568; font-style: italic; border: 1px solid #e2e8f0; }
            .footer { text-align: center; padding: 30px; font-size: 14px; color: #718096; background: #fafafa; }
            .button { display: inline-block; padding: 15px 35px; background: linear-gradient(135deg, #FF6B6B, #4ECDC4); color: #ffffff; text-decoration: none; border-radius: 30px; margin-top: 20px; font-weight: 600; box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4); }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Hi ${name}! 🚀</h1>
            </div>
            <div class="content">
                <h2>Ready to transform your digital presence?</h2>
                <div class="message-box">"${message}"</div>
                <p>I build vibrant, interactive, and high-converting websites. Let's create something amazing together.</p>
                <p>Cheers,<br><strong>Pallavi Patel</strong></p>
                <div style="text-align: center;">
                    <a href="https://salon-eight-rho.vercel.app/" class="button" style="color: #ffffff;">See My Work</a>
                </div>
            </div>
            <div class="footer">
                pallavipayel8080@gmail.com | PALLAVI PATEL
            </div>
        </div>
    </body>
    </html>
        `;
    }

    // Default: Professional Template
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
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});
// Route to send email
app.post('/send-email', (req, res) => {
    const { to, name, subject, message, templateId } = req.body;

    if (!to || !name || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: createEmailTemplate(name, message, templateId)
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('');
            return res.status(500).json({ error: 'Failed to send email' });
        }
        res.status(200).json({ message: 'Email sent successfully' });
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});