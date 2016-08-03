var JOSE = require('./jose');

function vmListDetailTest(jose) {
    jose.getVMs().then(function(data) {
        console.log(data);

        var vms = data.vmList;
        var vm = vms[0];
        console.log(vm);

        jose.getVMDetail(vm).then(function(data) {
            console.log(data);
        });
    });
}

function vmStartStopTest(jose) {
    jose.getVMs().then(function(data) {
        var vms = data.vmList;
        var vm = vms[0];
        console.log(vm);

        jose.getVMDetail(vm).then(function(data) {
            console.log(data);

            jose.startVM(vm).then(function(data) {
                console.log(data);

                jose.getVMDetail(vm).then(function(data) {
                    console.log(data);

                    jose.stopVM(vm).then(function(data) {
                        console.log(data);

                        jose.getVMDetail(vm).then(function(data) {
                            console.log(data);
                        });

                    });

                });

            });

        });

    });
}

function vmUserCreateDeleteTest(jose) {
    jose.getVMs().then(function(data) {
        var vms = data.vmList;
        var vm = vms[0];
        console.log(vm);
        jose.getVMUsers(vm).then(function(data) {
            console.log(data);

            jose.createVMUser(vm, 'hogehoge', 'hogepass', '').then(function(data) {
                console.log(data);

                jose.getVMUsers(vm).then(function(data) {
                    console.log(data);

                    jose.deleteVMUser(vm, 'hogehoge').then(function(data) {
                        console.log(data);

                        jose.getVMUsers(vm).then(function(data) {
                            console.log(data);
                        });

                    });

                });

            });

        });

    }, function(err) {
        console.error(err);
    });
}


function test() {
    var jose = new JOSE('userId', 'password');
    vmListDetailTest(jose);
    vmStartStopTest(jose);
    vmUserCreateDeleteTest(jose);
}
test();