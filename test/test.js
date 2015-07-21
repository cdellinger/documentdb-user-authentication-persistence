var assert = require('assert');
var should = require('should');

var host = process.env.TEST_DOCUMENTDB_HOST_URL;
var masterKey = process.env.TEST_DOCUMENTDB_MASTER_KEY;
var collectionUrl = process.env.TEST_DOCUMENTDB_COLLECTION_URL;



var documentdb_user_authentication_persistence = require('../lib/index');
var db = new documentdb_user_authentication_persistence(host, masterKey, collectionUrl);

/*
db.get('5c31903f-23a6-8fc9-2cc9-bab2d510b7a9', function(err, data){
	console.log(err);
	console.log(data);
});
*/

/*
db.create('TWITTER', 'gdellinger', 'token2345', 'gdellinger', 'gdellinger@gmail.com', function(err, data){
	console.log(err);
	console.log(data);
});
*/


describe('DB Test', function() {
	before(function(){
		console.log("BEFORE!!!!");
	});
	describe('Save With Tenant', function () {
		it('should persist without error', function (done) {
			db.create('TWITTER', 'adellinger', 'token12345', 'adellinger', 'adellinger@gmail.com', 'TENANT1', function(err, data){
				if (err) throw err;

				done();
			});
		});
	});

	describe('Get By Strategy Without Tenant', function () {
		it('should retrieve matching user', function (done) {
			db.getByStrategy('TWITTER', 'gdellinger', function(err, user){
				if (err) throw err;
				user.sid.should.equal('gdellinger');
				done();
			});
		});
	});

	describe('Get By Strategy Without Tenant with Invalid Strategy Id', function () {
		it('should retrieve matching user', function (done) {
			db.getByStrategy('TWITTER', 'INVALID_USER_STRATEGY_ID', function(err, user){
				if (err) throw err;
				should.equal(user, undefined);
				done();
			});
		});
	});

	describe('Get By Strategy With Valid Tenant', function () {
		it('should retrieve matching user', function (done) {
			db.getByStrategy('TWITTER', 'adellinger', 'TENANT1', function(err, user){
				if (err) throw err;
				user.sid.should.equal('adellinger');
				done();
			});
		});
	});

	describe('Get By Strategy With Invalid Tenant', function () {
		it('should retrieve undefined value', function (done) {
			db.getByStrategy('TWITTER', 'adellinger', 'TENANT2', function(err, user){
				if (err) throw err;
				should.equal(user, undefined);
				done();	
			});
		});
	});


	describe('Update User', function () {
		it('should update successfully', function (done) {
			console.log('NEED TO CLEANUP');
			db.get('d7d906d5-5276-edc3-53ea-843fca1ee2f3', function(err, user){
				if (err) throw err;
				user.email = 'adellinger2@gmail.com';
				db.update(user, function(err2, data){
					if (err2) throw err;
					console.log(data);
					done();	
				});
			});
		});
	});


	after(function(){
		console.log('AFTER!!!');
	});

});