/**
 * JOSE Api
 */
var request = require('superagent');
var Q = require('q');

// for ssl
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// --- JOSE Class
/** constructor */
var JOSE = function(userId, password) {
    this._baseUrl = 'https://portal.jose.jp';
    this._userId = userId;
    this._password = password;
    this._isAuthenticated = false;
    this._cookieCredentials = null;
};

JOSE.prototype._endpoint = function(path) {
    return this._baseUrl+path;
};

/** authenticates */
JOSE.prototype._auth = function() {
    var formdata = {
        userId: this._userId,
        password: this._password
    };
    return request
        .post(this._endpoint('/login'))
        .redirects(0)
        .type('form')
        .send(formdata);
};

JOSE.prototype._request = function(req) {
    var self = this;
    var d = Q.defer();
    var callback = (function(req, d) {
        return function() {
            req
                .set('Cookie', self._cookieCredentials)
                .end(function(err, res) {
                    if (err) d.reject(err);
                    else d.resolve(res.body);
                });
        };
    })(req, d);
    if (!this._isAuthenticated) {
        this._auth().end(function(err, res) {
            self._isAuthenticated = (res.statusCode === 302);
            if (!self._isAuthenticated) d.reject(err);
            else {
                self._cookieCredentials = res.header['set-cookie'];
                callback();
            }
        });
    } else {
        callback();
    }
    return d.promise;
};

/** returns the list of virtual machines */
JOSE.prototype.getVMs = function() {
    return this._request(
        request.get(this._endpoint('/info?command=vmachines'))
    );
};

/** returns the detail of a virtual machine */
JOSE.prototype.getVMDetail = function(vm) {
    return this._request(
        request.get(this._endpoint('/info?command=machines&vm=' + vm.macAddress))
    );
};

/** wakes up a virtual machine */
JOSE.prototype.startVM = function(vm) {
    return this._request(
        request
            .post(this._endpoint('/doctrl'))
            .type('form')
            .send({command: 'start-host', vm: vm.macAddress})
    );
};

/** shutdowns a virtual machine */
JOSE.prototype.stopVM = function(vm) {
    return this._request(
        request
            .post(this._endpoint('/doctrl'))
            .type('form')
            .send({command: 'stop-host', vm: vm.macAddress})
    );
};

/** shutdowns a virtual machine */
JOSE.prototype.forceStopVM = function(vm) {
    return this._request(
        request
            .post(this._endpoint('/doctrl'))
            .type('form')
            .send({command: 'force-stop-host', vm: vm.macAddress})
    );
};

/** returns the list of virtual machine users */
JOSE.prototype.getVMUsers = function(vm) {
    return this._request(
        request.get(this._endpoint('/info?command=vm-user-list&vm=' + vm.macAddress))
    );
};

/** creates a user on a virtual machine */
JOSE.prototype.createVMUser = function(vm, username, password, publicKey) {
    return this._request(
        request
            .get(this._endpoint('/doctrl?'))
            .query({
                command: 'create-vm-user',
                vm: vm.macAddress,
                user: username,
                password: password,
                publicKey: publicKey
            })
    );
};

/** creates a user on a virtual machine */
JOSE.prototype.deleteVMUser = function(vm, username) {
    return this._request(
        request
            .get(this._endpoint('/doctrl?'))
            .query({
                command: 'delete-vm-user',
                vm: vm.macAddress,
                user: username
            })
    );
};

module.exports = JOSE;