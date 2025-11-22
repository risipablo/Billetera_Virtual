const { Resend} = require('resend')

const apiKey = process.env.RESEND_API_KEY

if(!apiKey){
     throw new Error('RESEND_API_KEY is required')
}

const resend = new Resend(apiKey)

module.exports = resend

