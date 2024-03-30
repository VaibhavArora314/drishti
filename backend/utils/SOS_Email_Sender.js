import transporter from "../config/email.js";

export const sendEmails = async (recipientEmails, subject, message, longitude, latitude) => {
  try {
    // Construct Google Maps URL with latitude and longitude
    const mapUrl = `https://maps.google.com/?q=${latitude},${longitude}`;

    // Loop through each recipient email
    for (const recipientEmail of recipientEmails) {
      // Construct email content including Google Maps link
      const emailContent = `${message}\n\nClick here to view location on Google Maps: ${mapUrl}`;

      // Send email to the current recipient
      await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: recipientEmail,
        subject: subject,
        text: emailContent,
      });

      console.log(`Email sent successfully to ${recipientEmail}`);
    }

    console.log("All emails sent successfully");
  } catch (error) {
    console.error("Error sending emails:", error);
    throw error; // Rethrow the error for handling in the caller function
  }
};