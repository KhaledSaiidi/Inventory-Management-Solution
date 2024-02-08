const nodemailer = require('nodemailer');

// Configurer le transporter pour l'envoi d'e-mails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'houssem.jrad@esprit.tn', // Remplacez par votre adresse e-mail Gmail
    pass: '03101919', // Remplacez par le mot de passe de votre compte Gmail
  },
});

// Fonction pour envoyer un e-mail
function sendEmail(newsItem) {
  const mailOptions = {
    from: 'votre-email@gmail.com', // Remplacez par votre adresse e-mail Gmail
    to: 'houssem.jrad@esprit.tn', // Remplacez par l'adresse e-mail à laquelle vous souhaitez envoyer l'e-mail
    subject: 'Nouvelle actualité ajoutée',
    text: `Une nouvelle actualité a été ajoutée :\n\nTitre : ${newsItem.title}\nContenu : ${newsItem.content}`,
  };

  // Envoyer l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = { sendEmail };
