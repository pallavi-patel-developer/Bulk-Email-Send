require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

const escapeHtml = (value = '') => {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

const createEmailTemplate = (name, message) => {
    const safeName = escapeHtml(name || '');
    const normalizedMessage = (message || '').replace(/\r\n/g, '\n');
    const safeMessage = escapeHtml(normalizedMessage).replace(/\n/g, '<br>');

    return {
        text: `\n\n${normalizedMessage}\n\n`,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;"><br>${safeMessage}<br></div>`
    };
};

if (require.main !== module) {
    module.exports = { createEmailTemplate };
}


app.get('/', (_req, res) => {
    res.send('Server running 🚀');
});

app.post('/send-email', upload.single('attachment'), (req, res) => {
    const { to, name, subject, message, templateId } = req.body;

    if (!to || !name || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (req.file && req.file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ error: 'Attachment must be less than 10 MB' });
    }

    const emailContent = createEmailTemplate(name, message, templateId);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: emailContent.text,
        html: emailContent.html,
        attachments: req.file ? [{
            filename: req.file.originalname,
            content: req.file.buffer,
            contentType: req.file.mimetype
        }] : []
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to send email' });
        }
        res.status(200).json({ message: 'Email sent successfully' });
    });
});

app.use((err, _req, res, _next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Attachment must be less than 10 MB' });
        }
        return res.status(400).json({ error: err.message });
    }

    if (err) {
        return res.status(400).json({ error: err.message || 'File upload failed' });
    }

    res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});