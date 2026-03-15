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
    console.log('🚀 Starting Bulk Email Campaign...');
    
    if (!fs.existsSync(CSV_PATH)) {
        console.error(`❌ CSV file not found at: ${CSV_PATH}`);
        return;
    }

    const fileContent = fs.readFileSync(CSV_PATH);
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
    });

    console.log(`📋 Found ${records.length} potential leads.`);
    
    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const email = record.Email;
        const campaign = record['Campaign Name'];
        
        if (!email || email.trim() === '') continue;

        const salonName = guessSalonName(email, campaign);
        const pitchMessage = "I've been working on a new AI-powered booking automation specifically designed for modern salons. I'd love to show you how it could save you time and improve client retention.";
        
        console.log(`\n[${i + 1}/${records.length}] Sending to: ${salonName} (${email})...`);

        const mailOptions = {
            from: `"Pallavi Patel" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: SUBJECT,
            html: createEmailTemplate(salonName, pitchMessage)
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Sent successfully!`);
        } catch (error) {
            console.error(`❌ Failed to send to ${email}:`, error.message);
        }

        if (i < records.length - 1) {
            console.log(`Wait 3 seconds for next...`);
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
    }

    console.log('\n✨ Bulk campaign complete!');
}

startBulkSend().catch(console.error);
