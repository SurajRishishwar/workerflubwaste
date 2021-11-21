const usersdata = require('../models/registrationSchema');

const userquery = require('../models/userwastequery');

const workerquery = require('../models/workerassign');

const workerauth = require('../models/workerauth');

const postmailer = require('../mailers/wtverifyotp');

module.exports.workerhome=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/worker');
    }
    return res.render('signin',{
        title:"Worker | Sign In"
    });

}

module.exports.signup=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/worker');
    }
    return res.render('signup',{
        title:"Worker | Sign Up"
    });
}

module.exports.home=function(req,res){
    const idd = res.locals.user.workerid;
    workerquery.find({workerid:idd}).populate('userid').populate('queryid').exec(function(err,myquery){
                 if(err){
                     console.log('Error in Fetching Contact from DB');
                     return;
                 }
                 
                return res.render('worker',{
                     title:"My Query",
                     list:myquery
                 });
                
             });

}

module.exports.createsession=function(req,res){
  
       
    return res.redirect('/worker');

}

module.exports.createuser=function(req,res){
    if(req.body.password != req.body.confirmpassword){
        console.log('password not matched');
    }
    workerauth.findOne({email:req.body.email},function(err,user){
        if(err){console.log('Error in sign up');return;}
        if(!user){
            workerauth.create(req.body,function(err,user){
                if(err){console.log('Error in create new user',err);return;}
                else{
                  console.log('created success');
                }
            });
        }
        else{ 
            console.log('email alredy in use');
            return res.redirect('/');
        }
        return res.redirect('/');
    });
}

// module.exports.workerhome=function(req,res){
//     workerquery.find({workerid:"w2"}).populate('userid').populate('queryid').exec(function(err,myquery){
//         if(err){
//             console.log('Error in Fetching Contact from DB');
//             return;
//         }
        
//         return res.render('workerhome',{
//             title:"My Query",
//             list:myquery
//         });
        
//     });
// }
// module.exports.changereachstatus=function(req,res){
//     console.log(req.body.queryid);
//     userquery.findById(req.body.queryid,function(err,data){
      
//         if(data.reachotp==req.body.reachedotp){
//             userquery.findByIdAndUpdate(req.body.queryid,{"reachedstatus":true},function(err){
//                 if(err){
//                     console.log('Error in updating from DB',err);
                  
//                 }
//                 else{
//                     console.log("reached ");
                    
//                 }
//             });
//         }
//         else{
//             console.log("Wrong otp");
//         }
//         return res.redirect('/');
//     });
// }
module.exports.verifyweight=function(req,res){
    userquery.findByIdAndUpdate(req.body.queryid,{"quantity":req.body.quantity,"status":"wupdate"}).populate('user').exec(function(err,user){
        if(err){
            console.log('Error in updating from DB',err);
            
        }
       
        console.log('breakk---------------------');
        console.log(user.user.email);
        verwt=user.user.email;
        postmailer.verifywt(verwt);
        console.log("weight update");
        return res.redirect('/');
    });
}
module.exports.completed=function(req,res){
    userquery.findById(req.body.queryid,function(err,data){
        if(data.verifyotp==req.body.verifyotp){
            userquery.findByIdAndUpdate(req.body.queryid,{"custverifystatus":true,"status":"completed"},function(err){
                if(err){
                    console.log('Error in updating from DB',err);
                  
                }
                else{
                    console.log("process completed");
                    
                }
            });
        }
        else{
            console.log("Wrong otp");
        }
        return res.redirect('/');
    });


}

module.exports.logout = function(req,res){
    req.logout();
    return res.redirect('/');
}