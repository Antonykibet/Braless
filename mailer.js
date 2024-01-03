var nodemailer = require('nodemailer');
const { orders } = require('./mongoConfig');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'antonykibet059@gmail.com',
    pass: 'onmd wnzr xlgy rteq'
  }
});

function mailOrder(order){
    let items = order.cart.map(obj => `${obj.catalogue}, ${obj.type}, ${obj.unit} Unit`).join(', ')
    let orderInfo = `${order.name}, Phone number:${order.phoneNo} has purchased:${items}`
      
    let mailOptions = {
        from: 'antonykibet059@gmail.com',
        to: 'wanjirumwaura465@gmail.com',
        //subject: 'New Order',
        subject: 'Testing order mailing',
        text: orderInfo
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}
 function resetPassword(resetToken,receiverEmail){
    let mailOptions = {
        from: 'antonykibet059@gmail.com',
        to: receiverEmail,
        subject: 'Password reset',
        text: 'You are receiving this because you (or someone else) has requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'https://n3vj0vz2-3500.uks1.devtunnels.ms/reset-password/' + resetToken + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports={mailOrder,resetPassword}