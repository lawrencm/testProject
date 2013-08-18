/**
 * Requirement
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

    attributes: {
        title: 'string',
        importance: 'string',
        priority: 'string',
        lastUpdatedBy:'integer'


        /* e.g.
         nickname: 'string'
         */

    },

//Lifecycle Callbacks
    afterUpdate: function (values, next) {
//        console.log("update occured");
        console.log(values);
        Activity.create({
            userid: values.lastUpdatedBy,
            verb: 'updated',
            object_type: 'requirement',
            object_id: values.id
        }).done(function(err, activity){
           console.log("did it");
        });
        next();
    }

};
