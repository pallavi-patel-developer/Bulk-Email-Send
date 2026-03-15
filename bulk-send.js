require('dotenv').config();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { parse } = require('csv-parse/sync');
const { createEmailTemplate } = require('./server');

// CONFIGURATION
const CSV_PATH = 'C:\\Users\\hp\\Desktop\\emails.csv';
const SUBJECT = 'Quick digital idea for your salon';
const DELAY_MS = 3000; // 3 second delay to prevent spam flagging

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper to clean salon names from email
function guessSalonName(email, campaign) {
    if (campaign && campaign !== 'salon' && campaign !== '"salon"') {
        return campaign.replace(/"/g, '');
    }
    const namePart = email.split('@')[0];
    return namePart
        .split(/[.\-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

async function startBulkSend() {
    
    if (!fs.existsSync(CSV_PATH)) {
        console.error(``);
        return;
    }

    const fileContent = fs.readFileSync(CSV_PATH);
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
    });

    
    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const email = record.Email;
        const campaign = record['Campaign Name'];
        
        if (!email || email.trim() === '') continue;

        const salonName = guessSalonName(email, campaign);
        const pitchMessage = "I've been working on a new AI-powered booking automation specifically designed for modern salons. I'd love to show you how it could save you time and improve client retention.";
        

        const mailOptions = {
            from: `"Pallavi Patel" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: SUBJECT,
            html: createEmailTemplate(salonName, pitchMessage)
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error(``);
        }

        if (i < records.length - 1) {
            console.log(`Wait 3 seconds for next...`);
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
    }

}

startBulkSend().catch(console.error);
