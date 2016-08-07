/** My Script */
var JOSE = require('./jose');
var Q = require('q');

// global jose instance
jose = new JOSE('userId', 'password');

/** creates an user on all the virtual machines */
function createUser(username, password, publicKey) {

    return jose.getVMs().then(function(data) {
        // retrieve vm list
        return data.vmList;
    }).then(function(vms) {
        var d = Q.defer();

        // create a working list
        var count = vms.length;

        // callback
        var cb = (function(count, d) {
            return function() {
                if (--count <= 0) {
                    d.resolve();
                }
            };
        })(count, d);

        // for all vms
        vms.forEach(function(vm) {
            // retrieve user list
            jose.getVMUsers(vm).then(function(data) {
                return data.userList;
            }).then(function(users) {
                // if user does not exist
                if (users.indexOf(username) <= -1) {
                    jose.createVMUser(vm, username, password, publicKey).then(function(data) {
                        console.log('created ' + username + ' on ' + vm.hostName);
                        cb();
                    }, function(err) {
                        console.error(err);
                        cb();
                    });
                }
                // if user exists
                else {
                    console.log('skipping ' + vm.hostName);
                    cb();
                }
            });
        });

        return d.promise;
    }).then(function() {
        console.log('done');
    });

}

function reboot() {

    return jose.getVMs().then(function(data) {
        // retrieve vm list
        return data.vmList;
    }).then(function(vms) {
        var d = Q.defer();

        var count = vms.length;

        // callback
        var cb = (function(count, d) {
            return function () {
                if (--count <= 0) {
                    d.resolve();
                }
            }
        })(count, d);

        // for all vms
        vms.forEach(function(vm) {
            // reboot
            console.log('stopping ' + vm.hostName);
            jose.stopVM(vm).then(function() {
                setTimeout((function(vm) {
                    return function() {
                        console.log('starting ' + vm.hostName);
                        jose.startVM(vm).then(function() {
                            cb();
                        });
                    };
                })(vm), 10 * 1000)
            });
        });

        return d.promise;
    }).then(function() {
        console.log('done');
    });

}

function main() {
    // createUser('hogeuser', 'hogepass', '');
    reboot();
}
main();