/*---------------------
	:: Auth 
	-> controller
---------------------*/

var passport = require('passport');

var AuthController = {

    index: function (req, res) {
        res.view();
    },

    logout: function (req, res) {
        req.logout();
        res.redirect('/');
    },

    user_info: function (req, res) {

//      console.log(req)

      if (req.session.passport.user){
          User.findOne({id:req.session.passport.user}).done(function(err,user){
            res.json(user);
          });
      }else{
          //bootstrap this for dev purposes
          res.json({
              "provider": "github",
              "uid": 885738,
              "userName": "lawrencm",
              "displayName": "Matt",
              "profileUrl": "https://github.com/lawrencm",
              "avatar": "https://0.gravatar.com/avatar/475c66fd383f7b213899dfbab7cf0650?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png",
              "createdAt": "2013-08-14T02:40:19.489Z",
              "updatedAt": "2013-08-16T02:45:47.075Z",
              "id": 9
          })
      }

    },

    'github': function (req, res) {


        passport.authenticate('github', { failureRedirect: '/login' },
            function (err, user) {
                req.logIn(user, function (err) {
                    if (err) {
                        res.view();
                        return;
                    }

                    res.redirect('/');
                    return;
                });
            })(req, res);
    },

    'github_callback': function (req, res, next) {
//		console.log("zzzzzzzzzzzzz");
    	// console.log(res);

//        passport.authenticate('github',function(err, user, info){
//            console.log(user);
//                req.logIn(user, function(err) {
//                    if (err) { return  }
//                });
//            res.redirect("/foo");
//        })(req,res);

        passport.authenticate('github', function(err, user, info)
        {
            if ((err) || (!user))
            {
                res.redirect('/login');
                return;
            }

            req.logIn(user, function(err)
            {
                if (err)
                {
                    console.log(err);
                    res.view();
                    return;
                }

                res.redirect('/');
                return;
            });
        })(req, res);


//
//    	passport.authenticate('github',{}, function(){
//    		console.log("does this work");
////            console.log(req.user);
//            res.redirect('/foo')
//    	})(req,res);

        // passport.authenticate('github',
        //     function (req, res,next,){      
        //         // console.log(res);
        //         res.redirect('/');
        //     })(req, res);
    },

    'google': function (req, res) {
        passport.authenticate('google', { failureRedirect: '/login', scope:['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/userinfo.profile'] },
            function (err, user) {
                req.logIn(user, function (err) {
                    if (err) {
                        res.view();
                        return;
                    }

                    res.redirect('/');
                    return;
                });
            })(req, res);
    },

    'google/callback': function (req, res) {
        passport.authenticate('google',
            function (req, res) {
                res.redirect('/');
            })(req, res);
    }

};
module.exports = AuthController;