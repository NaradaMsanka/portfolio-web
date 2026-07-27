const { initializeApp } = require('firebase-admin/app');
const { FieldValue } = require('firebase-admin/firestore');
const { defineSecret } = require('firebase-functions/params');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const nodemailer = require('nodemailer');

initializeApp();

const notificationAddress = 'suneth2003narada@gmail.com';
const gmailAppPassword = defineSecret('GMAIL_APP_PASSWORD');

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

exports.sendEnquiryNotification = onDocumentCreated(
  {
    document: 'enquiries/{enquiryId}',
    region: 'asia-south1',
    secrets: [gmailAppPassword],
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const enquiry = snapshot.data();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: notificationAddress,
        pass: gmailAppPassword.value(),
      },
    });

    try {
      await transporter.sendMail({
        from: `Aventro Projects <${notificationAddress}>`,
        to: notificationAddress,
        replyTo: enquiry.email,
        subject: `New project enquiry: ${enquiry.type || 'General enquiry'}`,
        text: [
          `Name: ${enquiry.name}`,
          `Email: ${enquiry.email}`,
          `Phone: ${enquiry.phone || 'Not provided'}`,
          `Service: ${enquiry.type || 'Not selected'}`,
          '',
          enquiry.message,
        ].join('\n'),
        html: `
          <h2>New project enquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(enquiry.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(enquiry.email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(enquiry.phone || 'Not provided')}</p>
          <p><strong>Service:</strong> ${escapeHtml(enquiry.type || 'Not selected')}</p>
          <hr>
          <p style="white-space:pre-wrap">${escapeHtml(enquiry.message)}</p>
        `,
      });

      await snapshot.ref.update({
        notificationStatus: 'sent',
        notificationSentAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Enquiry notification failed', error);
      await snapshot.ref.update({
        notificationStatus: 'failed',
        notificationError: String(error.message || error).slice(0, 500),
      });
    }
  }
);
