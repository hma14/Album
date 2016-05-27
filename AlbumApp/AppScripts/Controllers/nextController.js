(function () {
    'use strict';
    albumapp.controller('nextController', ['$scope', 'AuthenticationService', '$location',
        function ($scope, authenticationService, $location) {
            authenticationService.validateRequest();
            $location.path('/album');
    }]);
})();
