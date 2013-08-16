/**
 * Requirement
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
  	title:'string',
    importance:'string',
    priority: 'string'

  	
  	/* e.g.
  	nickname: 'string'
  	*/
    
  },

//Lifecycle Callbacks
    afterUpdate: function(values, next) {
       console.log("update occured");
        next();
    }

};
