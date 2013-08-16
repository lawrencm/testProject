/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */

(function (io) {
    // as soon as this file is loaded, connect automatically,
    var socket = io.connect();
    if (typeof console !== 'undefined') {
        log('Connecting to Sails.js...');
    }

    socket.on('connect', function socketConnected() {
        // Listen for Comet messages from Sails
        socket.on('message', function messageReceived(message) {
            log('New comet message received :: ', message);
        });

        // log(
        //     'Socket is now connected and globally accessible as `socket`.\n' +
        //     'e.g. to send a GET request to Sails, try \n' +
        //     '`socket.get("/", function (response) ' +
        //     '{ console.log(response); })`'
        // );
    });


    // Expose connected `socket` instance globally so that it's easy
    // to experiment with from the browser console while prototyping.
    window.socket = socket;


    // Simple log function to keep the example simple

    function log() {
        if (typeof console !== 'undefined') {
            console.log.apply(console, arguments);
        }
    }


})(

        // In case you're wrapping socket.io to prevent pollution of the global namespace,
        // you can replace `window.io` with your own `io` here:
        window.io

    );



/*static vars*/

var REQ_ENDPOINT = "/requirement/";
var REQ_ENDPOINT_D = REQ_ENDPOINT + "destroy/";


/* re-usable directives*/

var contentEditable = function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            // view -> model
            elm.on('blur', function () {
                scope.$apply(function () {
//                    console.log("bluring");
                    //setting the value in the model
                    ctrl.$setViewValue(elm.text());
                });
            });

            // model -> view
            ctrl.$render = function () {
                console.log("render");
                elm.html(ctrl.$viewValue);
            };


            // load init value from DOM
//            ctrl.$setViewValue(elm.text());
        }
    }
}

/*
 controller module for requirement view
 */
var RequirementDetail = angular.module("RequirementDetail", ["ngAnimate"]);

RequirementDetail.controller("requirementController", function ($scope) {
    $scope.title = "this is the header";
    $scope.content = "coming from controller";
    $scope.masterRecord = null;

    $scope.moscowOptions = [
        {
            name: 'Must Have',
            value: 'M'
        },
        {
            name: 'Should Have',
            value: 'S'
        },
        {
            name: 'Could Have',
            value: 'C'
        },
        {
            name: 'Won\'t Have',
            value: 'W'
        }
    ];


    //init the sockets for messaging
    /*connect sockets*/
    socket.on("connect", function () {
        console.log("Socket Connected");
        socket.get(REQ_ENDPOINT, {}, function (resp) {
            console.log("Getting the initial data");
        });

        socket.on("message", function (msg) {
            console.log(msg);
            if (msg.model && msg.model == "requirement") {
//
                //if requirement has been updated
                if (msg.verb == "update" && msg.data.id == $scope.masterRecord.id) {
                    //find the element and update it
                    console.log("hey");
                    $scope.masterRecord =$.extend({}, msg.data);
                    $scope.$apply();
                }
//
//
//                $scope.sortData();
//            }
        }


    });


    });




    $scope.getMasterRecord = function (id) {

        socket.get('/requirement', {}, function (resp) {
            console.log("creating a socket for messaging");
        });

        socket.get(REQ_ENDPOINT, {id: id}, function (resp) {
            $scope.masterRecord = resp;
            $scope.$apply();
        })
    };

    /**
     * save the record back to the server
     */
    $scope.saveRecord = function () {
        // update the last updated
        $scope.masterRecord.updatedAt = new Date();

        //make a copy to send to server
        var rec = $.extend({}, $scope.masterRecord);

        //delete some of the values //
        delete(rec["createdAt"]);
        delete(rec["updatedAt"]);
        delete(rec["$$hashKey"]);

        socket.put(REQ_ENDPOINT, rec, function () {
            console.log("Record Updated");
        });
    }




});
RequirementDetail.directive('contenteditable', contentEditable);


var RequirementMaster = angular.module("RequirementMaster", ["ngAnimate"]);



RequirementMaster.controller("requirementMasterController", function ($scope) {
    $scope.status = 'Not Intitialized';
    $scope.inited = false;
    $scope.data = [
        {}
    ];
    $scope.activeRec = {
        title: "My Title"
    };
    $scope.moscowOptions = [
        {
            name: 'Must Have',
            value: 'M'
        },
        {
            name: 'Should Have',
            value: 'S'
        },
        {
            name: 'Could Have',
            value: 'C'
        },
        {
            name: 'Won\'t Have',
            value: 'W'
        }
    ];

    /*connect sockets*/
    socket.on("connect", function () {
        console.log("Socket Connected");
        socket.get(REQ_ENDPOINT, {}, function (resp) {
            console.log("Getting the initial data");
            $scope.data = resp;
            $scope.sortData();
        });

        socket.on("message", function (msg) {
            console.log(msg);
            if (msg.model && msg.model == "requirement") {

                ////////////////////////////////////////
                // a new requirement has been created //
                ////////////////////////////////////////

                if (msg.verb == "create") {
                    $scope.data.push(msg.data);

                }
                //////////////////////////////////////
                // a requirement has been destroyed //
                //////////////////////////////////////
                else if (msg.verb == "destroy") {
                    //remove item from local data
                    $scope.updateLocalDataItem(msg.id, "destroy");
                }

                ///////////////////////////////////
                //a requirement has been updates //
                ///////////////////////////////////
                else if (msg.verb == "update") {
                    //find the element and update it
                    $.each($scope.data, function (i) {
                        if ($scope.data[i].id === msg.id) {
                            for (var k in msg.data){
//                                if ( $scope.data[i][k] != msg.data[k]){
//                                    delete($scope.data[i][k]);
//                                    $scope.$apply();
//
//                                }
                                $scope.data[i][k] = msg.data[k];
                            }
//                            $scope.data[i] = msg.data;
                        }
                    });
                }


                $scope.sortData();
            }
        });


    });


    $scope.saveActiveRecord = function () {
            // update the last updated
            $scope.activeRec.updatedAt = new Date();

            //make a copy to send to server
            var rec = $.extend({}, $scope.activeRec);

            //delete some of the values //
            delete(rec["createdAt"]);
            delete(rec["updatedAt"]);
            delete(rec["$$hashKey"]);

            socket.put(REQ_ENDPOINT, rec, function () {
//                alert("Record Updated");
            });
    }

    $scope.viewRequirement = function (reqId) {
        location.href = "/requirement/detail/" + reqId;
    }
    $scope.updateLocalDataItem = function (reqId, action) {
        $.each($scope.data, function (i) {
            if ($scope.data[i].id === reqId) {
                //destroy the item locally
                if (action == "destroy") {
                    $scope.data.splice(i, 1);
                    $scope.sortData();
                }

                //set the active data index
                else if (action == "active") {
                    $scope.activeRecMaster = angular.copy($scope.data[i]);
                    $scope.activeRec = $scope.data[i];
                }

                return false;
            }
        });
    };

    $scope.showActions = function (reqId) {
        console.log(reqId);
    }


    ///////////////////////////////////////////////
    //reset the data if cancel button is clicked //
    ///////////////////////////////////////////////
    $scope.closeEditForm = function () {
        //loop throught the values and reset the row
        for (var i in $scope.activeRec) {
            $scope.activeRec[i] = $scope.activeRecMaster[i];
        }
    };

    ////////////////////////////////////////////////////
    //destroy the record if deletr button is cliecked //
    ////////////////////////////////////////////////////
    $scope.destroyReq = function (reqId) {
        var status = "Deleting requirement: " + reqId;
        //TODO use the delete method instead
        socket.delete(REQ_ENDPOINT, {
                id: reqId
            },
            function (resp) {
                $scope.updateLocalDataItem(reqId, "destroy");
                $scope.status = status;
            });
    };


    $scope.sortData = function () {
        console.log("Sorting the data");

        console.log($scope.data);
        $scope.data.sort(function (a, b) {
            return a.id - b.id;
        });
        $scope.$apply();
//        $scope.initActions();

    };

});
/**
 * notify chnage directive
 * watches for value chnage and causes css3 effect in page
 */


RequirementMaster.directive('contenteditable', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            // view -> model

            elm.on('click',function(){
                scope.$apply(function () {
                    scope.updateLocalDataItem(scope.req.id,'active');

                });
//                console.log(scope.req.id);
            });

            elm.on('blur', function () {
                scope.$apply(function () {
//                    console.log("bluring");
                    //setting the value in the model
                    ctrl.$setViewValue(elm.text());
                    scope.saveActiveRecord();

                });
            });

            // model -> view
            ctrl.$render = function () {
                console.log("render");
                elm.html(ctrl.$viewValue);
            };


            // load init value from DOM
//            ctrl.$setViewValue(elm.text());
        }
    }});

RequirementMaster.directive('notifychange', function() {
    return function(scope, elm, attr) {
        attr.$observe('ngBindTemplate', function(value) {
            //if class of clean do nothing
            if (elm.hasClass("clean")){
                elm.removeClass("clean");
            }else{
                elm.addClass("notify");
                elm.bind('webkitAnimationEnd', function(){
                    elm.removeClass("notify");
                });
            }
        });
    };
});




RequirementMaster.filter('moscow', function () {
    return function (input) {
        var s = "";
        switch (input) {
            case "M":
                s = "Must Have";
                break;
            case "S":
                s = "Should Have";
                break;
            case "C":
                s = "Could Have";
                break;
            case "W":
                s = "Won't Have";
                break;
            default:
                s = "";
                break;
        }
        return s;
    };
});

























