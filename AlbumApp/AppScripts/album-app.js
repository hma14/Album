'use strict';

var serviceBase = 'http://restfulws.lottotry.com/';

var albumapp = angular.module('albumApp', ['ngRoute', 'apiServicesApp']);

albumapp.config(function ($routeProvider, $locationProvider) {
    $routeProvider.
        when('/', {
            templateUrl: '/AppScripts/views/Login.html',
            controller: 'loginController'
        }).
        when('/album', {
            templateUrl: '/AppScripts/views/album.html',
            controller: 'albumController'
        }).
        when('/login', {
            templateUrl: '/AppScripts/views/Login.html',
            controller: 'loginController'
        }).
       when('/addphoto', {
           templateUrl: '/AppScripts/views/addphoto.html',
           controller: 'albumController'
       }).
       when('/deletephoto', {
           templateUrl: '/AppScripts/views/deletephoto.html',
           controller: 'albumController'
       }).
       when('/videopugs', {
           templateUrl: '/AppScripts/views/video_pugs.html',
           controller: ''
       }).
       when('/videoski', {
           templateUrl: '/AppScripts/views/video_ski.html',
           controller: ''
       }).
       when('/videogranvilleisland', {
           templateUrl: '/AppScripts/views/video_granville_island.html',
           controller: ''
       }).
    otherwise({
        redirectTo: '/'
    })
    $locationProvider.html5Mode(true);
});

albumapp.config(['$httpProvider', function ($httpProvider) {

    $httpProvider.interceptors.push(function ($q, $rootScope, $window, $location) {

        return {
            request: function (config) {

                return config;
            },
            requestError: function (rejection) {

                return $q.reject(rejection);
            },
            response: function (response) {
                if (response.status == "401") {
                    $location.path('/login');
                }
                //the same response/modified/or a new one need to be returned.
                return response;
            },
            responseError: function (rejection) {

                if (rejection.status == "401") {
                    $location.path('/login');
                }
                return $q.reject(rejection);
            }
        };
    });
}]);

albumapp.factory('$exceptionHandler', function ($injector) {
    return function (exception, cause) {
        var $rootScope = $injector.get('$rootScope');
        $rootScope.errors = $rootScope.errors || [];
        if (exception != undefined) {
            $rootScope.errors.push('Cause: ' + cause + ', Details: ' + exception);
        }
        else {
            $rootScope.errors.push('Cause: ' + cause);
        }


        console.log($rootScope.errors);
    }
})
.run(function ($http) {
    function onSuccess(result) {
        console.log(result.data.length, result.data);
        result.count();
    }

    function onFailure(info) {
        console.log(info);
    }
})

albumapp.directive('rotate', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.degrees, function (rotateDegrees) {
                console.log(rotateDegrees);
                var r = 'rotate(' + rotateDegrees + 'deg)';
                element.css(
                    {
                        '-moz-transform': r,
                        '-webkit-transform': r,
                        '-o-transform': r,
                        '-ms-transform': r
                    });
            });
        }
    }
});

albumapp.service('popupService', function ($window) {
    this.showPopup = function (message) {
        return $window.confirm(message);
    }
});

albumapp.directive('newHeight', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            scope.$watch(attrs.id.innerHeight, function () {
                console.log(scope.angle);
                if (scope.angle > 0) {
                    attrs.id.css('height', '800px');
                }
            });
        }
    };
});
