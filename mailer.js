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
 function resetPassword(order){
    let orderInfo = `${order.name} Tell number:${order.phoneNo} has purchased:${order.cart}`
    let mailOptions = {
        from: 'youremail@gmail.com',
        to: 'myfriend@yahoo.com',
        subject: 'Password reset',
        text: orderInfo
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