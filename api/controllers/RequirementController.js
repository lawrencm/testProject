/**
 * RequirementController
 *
 * @module      :: Controller
 * @description :: Contains logic for handling requests.
 */
 // var forms = require('forms'),
 //            fields = forms.fields,
 //            validators = forms.validators;


module.exports = {

    /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */

    // test:function(req,res){
    //     res.view();
    // },

    requirement_by_id: function(req,res){
        var reqId = req.param('reqId');
        Requirement.findOne({ id: reqId }).done(function(err,requirement){
            res.view({
                requirement:requirement
            });

        });

        //console.log(req);



        //console.log(reqId);
    },

    requirements: function(req, res) {
        var categories;
//        console.log(req);


        Requirement_category.find().exec(function(err, cats) {
            // console.log("doing somehting");
            // Error handling
            if (err) {
                categories = "an error has occured";
            } else {
                categories =  cats;
            }
        });

        var user = req.user;
        /*
        var forms = require('forms'),
            fields = forms.fields,
            validators = forms.validators;

        var reg_form = forms.create({
            username: fields.string({
                required: true
            }),
            password: fields.password({
                required: true
            }),
            confirm: fields.password({
                required: true,
                validators: [validators.matchField('password')]
            }),
            email: fields.email()
        });

        var s = "<form method='POST'>" + reg_form.toHTML() + "<input type=\"submit\">" + "</form>";

        */

        res.view({
            message: "Hello World22!",
            categories: categories,
            user:user
        });
        //res.send(s);

    }


};