var assert = require('assert');
var should = require('should');

var host = process.env.TEST_DOCUMENTDB_HOST_URL;
var masterKey = process.env.TEST_DOCUMENTDB_MASTER_KEY;
var collectionUrl = process.env.TEST_DOCUMENTDB_COLLECTION_URL;



var documentdb_user_authentication_persistence = require('../lib/index');
var db = new documentdb_user_authentication_persistence(host, masterKey, collectionUrl);


//test data
var UserSchema = require('../lib/schema');
var tenantlessUser = new UserSchema();
var tenantlessUserId = '';

tenantlessUser.userHandle = '|||TESTUSER1|||';
tenantlessUser.addStrategy('###TESTUSER1_TWITTER!###', 'TWITTER', '12345');


var testTenant = '#TEST_TENANT#';
var tenantUser = new UserSchema();
var tenantUserId = '';

tenantUser.userHandle = '|||TESTUSER2|||';
tenantUser.tenant = testTenant;
tenantUser.addStrategy('###TESTUSER2_TWITTER!###', 'TWITTER', '12345');
//end of test data


describe('DB Test', function() {
	before(function(){

	});
	describe('Save With Tenant', function () {
		it('should persist without error', function (done) {
			db.create(tenantUser, function(err, data){
				if (err) throw err;
				tenantUserId = data.id;
				done();
			});
		});
	});


	describe('Save Without Tenant', function () {
		it('should persist without error', function (done) {
			db.create(tenantlessUser, function(err, data){
				if (err) throw err;
				tenantlessUserId = data.id;
				done();
			});
		});
	});

	describe('Get By Strategy With Tenant', function () {
		it('should retrieve matching user', function (done) {
			db.getByStrategy(tenantUser.strategies[0].type, tenantUser.strategies[0].id, testTenant, function(err, user){
				if (err) throw err;
				user.sid.should.equal(tenantUser.strategies[0].id);
				done();
			});
		});
	});

	describe('Get By Strategy Without Tenant', function () {
		it('should retrieve matching user', function (done) {
			db.getByStrategy(tenantlessUser.strategies[0].type, tenantlessUser.strategies[0].id, '', function(err, user){
				if (err) throw err;
				user.sid.should.equal(tenantlessUser.strategies[0].id);
				done();
			});
		});
	});

	describe('Get By Strategy With Tenant with Invalid Strategy Id', function () {
		it('should retrieve matching user', function (done) {
			db.getByStrategy(tenantUser.strategies[0].id, 'INVALID_USER_STRATEGY_ID', tenantUser.tenant, function(err, user){
				if (err) throw err;
				should.equal(user, undefined);
				done();
			});
		});
	});

	describe('Get By Strategy Without Tenant with Invalid Strategy Id', function () {
		it('should retrieve matching user', function (done) {
			db.getByStrategy(tenantUser.strategies[0].id, 'INVALID_USER_STRATEGY_ID', '', function(err, user){
				if (err) throw err;
				should.equal(user, undefined);
				done();
			});
		});
	});

	describe('Get By Strategy With Invalid Tenant', function () {
		it('should retrieve undefined value', function (done) {
			db.getByStrategy(tenantUser.strategies[0].type, tenantUser.strategies[0].id, 'INVALID_TENANT', function(err, user){
				if (err) throw err;
				should.equal(user, undefined);
				done();	
			});
		});
	});


	describe('Update User with Tenant', function () {
		it('should update successfully', function (done) {
			db.get(tenantUserId, function(err, user){
				if (err) throw err;
				var newEmail = user.email + '1234';
				user.email = newEmail;
				db.update(user, function(err2, data){
					if (err2) throw err2;
					db.get(tenantUserId, function(err3, savedUser){
						if (err3) throw err3;
						user.email.should.equal(newEmail);
						done();
					});
				});
			});
		});
	});


	describe('Update User without Tenant', function () {
		it('should update successfully', function (done) {
			db.get(tenantlessUserId, function(err, user){
				if (err) throw err;
				var newEmail = user.email + '1234';
				user.email = newEmail;
				db.update(user, function(err2, data){
					if (err2) throw err2;
					db.get(tenantlessUserId, function(err3, savedUser){
						if (err3) throw err3;
						user.email.should.equal(newEmail);
						done();
					});
				});
			});
		});
	});

	describe('Remove user with tenant', function () {
		it('should remove matching user', function (done) {
			db.get(tenantUserId, function(err, user){
				if (err) throw err;
				db.remove(user._self, function(err2, data){
					if (err2) throw err2;
					done();
				});
			});
		});
	});

	describe('Remove user without tenant', function () {
		it('should remove matching user', function (done) {
			db.get(tenantlessUserId, function(err, user){
				if (err) throw err;
				db.remove(user._self, function(err2, data){
					if (err2) throw err2;
					done();
				});
			});
		});
	});

	after(function(){
	});

});