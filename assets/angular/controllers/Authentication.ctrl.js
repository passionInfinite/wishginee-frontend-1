Wishginee.controller("AuthController",["$rootScope", "$scope", "$window","$timeout", "AuthenticationService","NotificationService","Socket", function ($rootScope, $scope, $window, $timeout, AuthenticationService, NotificationService, Socket) {

    $scope.isLoggedIn = AuthenticationService.isUserAuthenticated();

    if($scope.isLoggedIn){
        AuthenticationService.getLoggedInUser().then(function (response) {
            $scope.user = response;
        });
    }

    $scope.loginWithFacebook = function () {
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                AuthenticationService.loginWithFacebook(response.authResponse.accessToken).then(function (response) {
                    if(response != null){   
                        $window.location.href = "#!/dashboard";
                    }else{
                        $window.alert("Sorry unable to logging!");
                    }
                },function (error) {
                    $window.alert("Unable to login! Please try again later!");
                });
            }
            else {
                FB.login();
            }
        });
    };

    $scope.customSignUp = function () {
        var user = {
          'first_name' : $scope.custom_first_name,
          'last_name' : $scope.custom_last_name,
          'email' : $scope.custom_email,
          'password' : $scope.custom_password,
          'mobile' : $scope.custom_mobile,
          'group' : $scope.group
        };

        $scope.errors = [];
        
        AuthenticationService.customSignUp(user).then(function (response) {
            $window.alert("Successful SignUp!");
        }, function (error) {
            if(error.status == 422){
                $scope.errors = error.data.error;
            }
        });
    };

    $scope.customLogin = function () {
        var user = {
            'email' : $scope.login_email,
            'password' : $scope.login_password,
            'authType' : 'custom'
        };

        AuthenticationService.customLogin(user).then(function (response) {
            $window.location.href = "#!/dashboard";
        }, function (error) {
            if(error.status == 422){
                $scope.errors = error.data.error;
                $window.alert("Check your credentials!");
            }
        });
    };

    $scope.logout = function () {
        if(AuthenticationService.logout()){
            return $window.location.href = "#!/";
        }else{
            $window.alert("Unable to log you out!");
        }
    };


}]);
