const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Ajoutez cette ligne

const app = express();
const port = 3000;

// Middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Utilisez cors middleware
app.use(cors()); // Ajoutez cette ligne

// Configuration of the nodemailer transporter for sending emails via Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'saiidiikhaled@gmail.com',
    pass: 'jcvi rplq wvjf xasx',
  },
});

// Route to handle sending emails
app.post('/send-email', (req, res) => {
  const { name, email, subject, message } = req.body;

  const mailOptions = {
    from: 'saiidiikhaled@gmail.com',
    to: 'saiidiikhaled@gmail.com',
    subject: `New message from ${name}: ${subject}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending the email.');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully.');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
