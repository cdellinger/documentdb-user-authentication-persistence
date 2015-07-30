// for inspiration https://github.com/Automattic/mongoose/blob/master/lib/schema.js
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#The_property_(object_attribute)

var bcryptjs = require('bcryptjs');

var User = function(customSchema){
	this.id = '';
	this.docType = 'USER';
	this.userHandle = '';
	this.email = '';
	this.tenant = '';
	this.strategies = [];
};

User.prototype.addStrategy = function(strategyId, strategyType, strategyToken){
	this.strategies.push({id: strategyId, type: strategyType, token: strategyToken});
};

User.prototype.addLocalStrategy = function(userName, password){
	var salt = bcryptjs.genSaltSync(10);
	var hash = bcryptjs.hashSync(password, salt);
	this.strategies.push({id: userName, type: 'LOCAL', hash: hash});
};




module.exports = User;