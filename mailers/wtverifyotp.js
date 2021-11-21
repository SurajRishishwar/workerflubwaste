const nodeMailer= require('../config/nodemailer');




exports.verifywt = (weight)=>{
    console.log('inside');

    let htmlString=nodeMailer.renderTemplate({weight:weight},'/wtverify/wtverify.ejs');


    nodeMailer.transporter.sendMail({
        from:'sociademedia@gmail.com',
        to:weight,
        subject:'Verify Weight',
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log('error in sending mail',err);
            return;
        }
        console.log('mail delivered',info);
        return;
    });
}