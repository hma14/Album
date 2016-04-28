(function () {
    'use strict';
    albumapp.controller('loginController', ['$scope', '$rootScope', '$http', 'LoginService', '$location', 'AuthenticationService',
        function ($scope, $rootScope, $http, loginService, $location, AuthenticationService) {

        $scope.loginData = {
            userName: "",
            password: ""
        };

        $scope.login = function () {
            loginService.login($scope.loginData.userName, $scope.loginData.password).then(function (response) {
                if (response != null && response.error != undefined) {
                    $scope.message = response.error_description;
                }
                else {
                    $rootScope.errors = [];
                    AuthenticationService.setHeader($http);
                    $location.path('/album');
                }
            });
        }
    }]);
})();