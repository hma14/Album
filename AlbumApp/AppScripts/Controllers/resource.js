'use strict';

var apiServicesApp = angular.module('apiServicesApp', ['ngResource']);


apiServicesApp.factory('Image', ['$resource', 'AuthenticationService', function ($resource, AuthenticationService) {
    return $resource(serviceBase + 'api/Images/:id', {}, {
        query: { method: "GET", isArray: true },
        create: { method: "POST" },
        get: { method: "GET", url: serviceBase + "api/Images?id=:id" },
        remove: { method: "DELETE", url: serviceBase + "api/Images?id=:id" },
        update: { method: "PUT", url: serviceBase + "api/Images?id=:id" }
    })
}]);

apiServicesApp.factory('MyAuth', function () {
    return {
        accessTokenId:null
    }
})



// above will create the following methods:

//Image.query(); // Will return array of  students
//Image.get({ id: 2 }); // Returns Image with id 2
//Image.create(Image); //Adds new Image entry
//Image.update({ id: 2 }, course); //Updates Image 2 info
//Image.remove({ id: 2 }); //Removes Image with id 2



