Wishginee.controller("MyEventCtrl",["$scope","$window", "AuthenticationService","EventService", function ($scope, $window, AuthenticationService,EventService) {

    $scope.isLoggedIn = false;
    $scope.isLoggedIn = AuthenticationService.isUserAuthenticated();

    if($scope.isLoggedIn){
        AuthenticationService.getLoggedInUser().then(function (response) {
            $scope.user = response;
        });
    }else{
        $window.location.href = "#!/";
    }

    $scope.loadEvents = function () {
        EventService.getUsersDetails("me").then(function (response) {
            $scope.events = response.events;
        }, function (error) {
            console.log(error);
        })
    };

    $scope.viewMore = function (id) {
        $window.location.href = "#!/events/"+id;
    };

    $scope.edit = function (id) {
        $window.location.href = "#!/update/events/"+id;
    };

    $scope.logout = function () {
        if(AuthenticationService.logout()){
            return $window.location.href = "#!/";
        }
    }


}]);
