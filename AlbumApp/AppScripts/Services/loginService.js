(function () {
    //'use strict';
    albumapp.service('LoginService', ['$http', '$q', 'AuthenticationService', 'authData', '$location', '$timeout', '$window',
    function ($http, $q, authenticationService, authData, $location, $timeout, $window) {
        var userInfo;
        var loginServiceURL = serviceBase + 'token';
        var deviceInfo = [];
        var deferred;

        var successCallBack = function (response) {
            var o = response;
            userInfo = {
                accessToken: response.data.access_token,
                userName: response.data.userName
            };
            authenticationService.setTokenInfo(userInfo);
            authData.authenticationData.IsAuthenticated = true;
            authData.authenticationData.userName = response.userName;
            deferred.resolve('success');
        };

        var errorCallBack = function (err) {
            authData.authenticationData.IsAuthenticated = false;
            authData.authenticationData.userName = "";
            deferred.resolve(err);
        };

        this.login = function (userName, password) {
            deferred = $q.defer();

            var data = "grant_type=password&username=" + userName + "&password=" + password;
            $http.post(loginServiceURL, data, {
                headers:
                   { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(successCallBack, errorCallBack);
 
            return deferred.promise;
        }

        this.logOut = function () {
            authenticationService.removeToken();
            authData.authenticationData.IsAuthenticated = false;
            authData.authenticationData.userName = "";
            $window.location.reload();
        }
    }
    ]);
})();