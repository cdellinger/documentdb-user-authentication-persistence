"use strict";

module.exports = function(host, masterKey, collectionUrl){

	var docDBClient = require('documentdb').DocumentClient;
	var _client = new docDBClient(host, {masterKey: masterKey}); 	
	var _collectionUrl = collectionUrl;


	this.create = function(strategyKey, strategyId, token, displayName, email, tenant, cb){
		if (cb === undefined){
			cb = tenant;
			tenant = null;
		}
		var user = {
			docType: 'USER',
			userHandle: displayName, 
			email: email,
			strategies: [{
				id: strategyId, 
				key: strategyKey, 
				token: token
			}]
		};

		if (tenant != null) user.tenant = tenant;
		
		_client.createDocument(_collectionUrl, user, cb);
	};



	this.findOrCreate = function(strategyKey, strategyId, token, displayName, email, tenant, cb){

		if (cb === undefined){
			cb = tenant;
			tenant = null;
		}

		getByStrategy(strategyKey, strategyId, tenant, function(err, retrievedUser){
			if (err) return cb(err, null);
			if (retrievedUser != null){
				return cb(null, retrievedUser);
			}
			else{
				create(strategyKey, strategyId, token, displayName, email, tenant, cb);
			}
		});
	};


	this.get = function(id, cb){
		var querySpec = {
			query: 'SELECT * FROM u WHERE u.id = @id AND u.docType = "USER"',
			parameters: [{name: '@id', value: id}]
		};

		_client.queryDocuments(_collectionUrl, querySpec).toArray(function(err, results){
			if (err) return cb(err, null);
			return cb(null, results[0]);
        });

	};


	this.getByStrategy = function(strategyKey, strategyId, tenant, cb){
		var querySpec = {
			query: 'SELECT u.id, u.displayName, s.key, s.id sid, s.token FROM u JOIN s IN u.strategies WHERE s.key = @strategyKey AND s.id = @strategyId AND u.docType = "USER"',
			parameters: [
				{name: '@strategyKey', value: strategyKey},
				{name: '@strategyId', value: strategyId}
			]
		};
		if (cb === undefined){
			cb = tenant;
			tenant = null;
		}

		if (tenant != null){
			querySpec.query += ' AND u.tenant = @tenant';
			querySpec.parameters.push({name: '@tenant', value: tenant});
		}

		_client.queryDocuments(_collectionUrl, querySpec).toArray(function(err, results){
			if (err) return cb(err, null);
			return cb(null, results[0]);			
		});
	};

	this.update = function(user, cb){
		_client.replaceDocument(user._self, user, cb);

	};
};
