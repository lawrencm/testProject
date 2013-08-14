/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */


// $(document).ready(function(){
//   $(".req-edit").tootip({
//       title:"Hello"
//   });
// });



(function(io) {



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

/**
 * Controls individual requirement records
 * @param  Angular Scope Object $scope
 * @return Null
 */



var REQ_ENDPOINT = "/requirement/";
var REQ_ENDPOINT_D = REQ_ENDPOINT + "destroy/";

function FetchRequirements($scope, $http, $templateCache) {

  $scope.status = 'Not Intitialized';
  $scope.data = [{}];
  $scope.activeRec = {
    title: "My Title"
  };
  $scope.moscowOptions = [{
    name: 'Must Have',
    value: 'M'
  }, {
    name: 'Should Have',
    value: 'S'
  }, {
    name: 'Could Have',
    value: 'C'
  }, {
    name: 'Won\'t Have',
    value: 'W'
  }];

  socket.on("connect", function() {
    console.log("Socket Connected");

    socket.get(REQ_ENDPOINT, {}, function(resp) {
      console.log("Getting the initial data");
      $scope.data = resp;
      $scope.sortData();
    });

    socket.on("message", function(msg) {
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
            $scope.updateLocalDataItem(msg.id,"destroy");
          }

          ///////////////////////////////////
          //a requirement has been updates //
          ///////////////////////////////////
          else if (msg.verb == "update") {
            //find the element and update it
            $.each($scope.data, function(i) {
              if ($scope.data[i].id === msg.id) {
                $scope.data[i] = msg.data;
              }
            });
          }



          $scope.sortData();
        }
    });
    
  });

    $scope.viewRequirement = function(reqId){
        console.log("xxxx");
        location.href = "/requirement/detail/"+ reqId;
    }

  $scope.updateLocalDataItem = function(reqId, action) {

      console.log(reqId);

    $.each($scope.data, function(i) {
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

  $scope.showActions = function(reqId){
      console.log(reqId);
  }


  ///////////////////////////////////////////////
  //reset the data if cancel button is clicked //
  ///////////////////////////////////////////////
  $scope.closeEditForm = function(){
    //loop throught the values and reset the row
    for (var i in $scope.activeRec){
      $scope.activeRec[i] = $scope.activeRecMaster[i];
    }
  };

  ////////////////////////////////////////////////////
  //destroy the record if deletr button is cliecked //
  ////////////////////////////////////////////////////
  $scope.destroyReq = function(reqId) {
    var status = "Deleting requirement: " + reqId;
    //TODO use the delete method instead
    socket.delete(REQ_ENDPOINT, {
        id: reqId
      },
      function(resp) {
        $scope.updateLocalDataItem(reqId, "destroy");
        $scope.status = status;
      });
  };



  $scope.sortData = function() {
    console.log("Sorting the data");

      console.log($scope.data);
    $scope.data.sort(function(a, b) {
      return a.id - b.id;
    });
    $scope.$apply();
    $scope.initActions();

  };


  $scope.initActions = function(){

//
//        $(".req-edit,.req-destroy").each(function(){
//            $(this).tooltip({placement:"left"});
//        });


//        $("#req-table tr").click(function(){
//            console.log($scope);
//        });


//      $(".req-actions").each(function(){
//            var aId = $(this).attr("id").replace("req-action-","");
//            $(this).popover({
//                placement:"top",
//                title:"Actions for requirement " + aId,
//                html:true,
//                content: function(){
//                  var lId = "#req-actions-list-" + aId;
//                  return $compile($(lId).html());
//
//                }
//            })
//      });
  };

  // $scope.getEditReq = function(reqId) {
  //   //dont get it fom the socket, get it from the result set
  //   //socket.get("/requirement",{id:reqId},function(resp){
  //   $.each($scope.data, function(i) {
  //     if ($scope.data[i].id === reqId) {
  //       $scope.activeRecId = i;
  //     }
  //   });
  // };

  $scope.setEditReq = function() {

    // console.log($scope.activeRec);
    $scope.activeRec.updatedAt = new Date();

    var rec = $.extend({},$scope.activeRec);
    
        //////////////////////////////
    //delete some of the values //
    //////////////////////////////
    delete(rec["createdAt"]);
    delete(rec["updatedAt"]);
    delete(rec["$$hashKey"]);

    socket.put(REQ_ENDPOINT, rec, function() {
      $scope.status = "Record Updated";
    });
  };


};





/**
 * return the moscow string given a value
 * @param  {string} string input
 * @return {string} the formated label
 */
/**
 * filter modules for requirements listing
 */
var requirementModule = angular.module('requirementModule', [], function($compileProvider){});



requirementModule.directive('requirementAction', function($compile) {
    var linkFn;

//    console.log(this);
    linkFn = function(scope, element, attrs) {

//        var id = scope.req.id;
//
//        var actionString = '<a data-toggle="modal" title="Edit requirement {{req.id}}" href="#myModal" class="glyphicon glyphicon-pencil req-edit" ng-click="updateLocalDataItem(req.id,\'active\')">Edit Requirement</a>';
//        actionString += '<a ng-click="destroyReq(req.id)" title="Delete requirement {{req.id}}"  class="glyphicon glyphicon-trash req-destroy">Delete Requirement</a>';
//        $(element).popover({
//            html:true,
//            placement:'left',
//            content:$compile(actionString)(scope)
//            }
//        )


//        $(element).css({"border":"1px solid red"})
//        $(element).on('click', log);
    };
    return {
        restrict: 'E',
        link: linkFn
    };
});

requirementModule.filter('moscow', function() {
  return function(input) {
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


$(document).on('ready',function(){
    console.log("Doc Ready");
    console.log($("#req-table tr"));
})
























