/**
 * Activity
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

    attributes: {

        userid: 'string',
        verb: 'string',
        object_type: 'string',
        object_id: 'string',
        modified: 'date',
        dateObj: function(){
          return new Date(this.updatedAt);
        },
        userObj: function () {
            return User.findOne({ id: this.userid }).done(function (err, user) {
                console.log("XXXXX");
                console.log(user);
//                console.log(this);
                return user;
            });
        }
    },
//    beforeCreate: function (values, next) {
//        console.log = "beforecreate";
//        values.modified = new Date();
//        next();
//    },
//    beforeUpdate: function (values, next) {
////        console.log = "beforeupdate";
//        values.modified = new Date();
//        next();
//    }

//        userobj: function () {
////            return "xxxxx";
//            return User.findOne({ id: userid }).done(function (err, user) {
//                return user;
//            });
//        }()

    /* e.g.
     nickname: 'string'

     lawrencm updated requirement ABCD

     */


};
