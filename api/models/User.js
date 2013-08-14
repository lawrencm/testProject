/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

	attributes: {
		provider: 'STRING',
		uid: 'INTEGER',
		userName: 'STRING',
        displayName: 'STRING',
        profileUrl: 'STRING',
        avatar: "STRING",
        appDisplayName: function(){
            return (this.displayName === null)?this.userName:this.displayName;
        }

	}

};