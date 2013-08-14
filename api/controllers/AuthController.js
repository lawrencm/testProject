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
		console.log("zzzzzzzzzzzzz");
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