
const { Resend } = require('resend');

const apiKey = process.env.RESEND_API_KEY;


if (!apiKey && process.env.NODE_ENV) {
    console.log(' Resend en modo desarrollo - Los emails se simularán en consola');
}

const resend = new Resend(apiKey);

module.exports = resend;