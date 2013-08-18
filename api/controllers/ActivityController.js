/**
 * ActivityController
 *
 * @module        :: Controller
 * @description    :: Contains logic for handling requests.
 */

module.exports = {

    /* e.g.
     sayHello: function (req, res) {
     res.send('hello world!');
     }
     */

    requirements_activity: function (req, res) {


        Activity.find()
            .where({object_type: 'requirement'})
            .limit(5)
//            .sort('date DESC')
            .done(function (err, activities) {


                activities.forEach(function (act) {



                  console.log(typeof act.updatedAt);

                    var ui;
                    User.findOne({ id: act.userid }).done(function (err, user) {
                        ui = user;
                    });

                    if (typeof ui !== "undefined") {
                        act['user'] = {};
                        act.user.displayName = ui.displayName;
                        act.user.avatar = ui.avatar;

                    }
                });
                res.json(activities);
            });
    }


};
