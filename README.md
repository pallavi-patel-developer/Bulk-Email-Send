# Pallavi Patel | Elegant Email Portal

A premium Node.js application for **PALLAVI PATEL** (AI Full Stack Developer) to send professional emails with an elegant brown and white theme.

**Portfolio:** [salon-eight-rho.vercel.app](https://salon-eight-rho.vercel.app/)

## Getting Started

1.  **Configure Credentials**:
    -   Rename `.env.example` to `.env`.
    -   Enter your Gmail address in `EMAIL_USER`.
    -   Enter your Gmail App Password in `EMAIL_PASS`.

2.  **Start the Server**:
    ```bash
    node server.js
    ```

3.  **Access the Application**:
    -   Open your browser and navigate to `http://localhost:3000`.

## Features
-   **Elegant UI**: Reverted to the hallmark brown and white palette with gold accents.
-   **CSS Branding**: Professional email header implemented using high-end CSS.
-   **Website Integration**: Direct links to your portfolio in both the portal and emails.
-   **Bulk Sender**: Automate outreach using your `emails.csv` lead list.

## Bulk Email Sending

To reach out to multiple salons at once using your desktop `emails.csv` list:

```bash
node bulk-send.js
```
The script will process each lead, personalize the salon name, and send your pitch with a 3-second delay between emails.

## Project Structure
-   `server.js`: Express server with Nodemailer configuration.
-   `public/`: Contains the frontend assets (`index.html`, `style.css`).
-   `.env`: Sensitive credential storage.
