(function () {

'use strict';
albumapp.controller('indexController', ['$scope', '$location', 'authData', 'LoginService',
    function ($scope, $location, authData, loginService) {

    $scope.logOut = function () {
        loginService.logOut();
        $location.path('/login');
    }
    $scope.authentication = authData.authenticationData;

}]);
})();