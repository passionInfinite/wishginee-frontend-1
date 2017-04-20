Wishginee.controller("DashboardCtrl",["$scope", "$http", "API_URL","AuthenticationService", "$window","$cookies","Socket","NotificationService", function ($scope, $http, API_URL, AuthenticationService, $window, $cookies, Socket, NotificationService) {


    $scope.isLoggedIn = AuthenticationService.isUserAuthenticated();
    if($scope.isLoggedIn){
        AuthenticationService.getLoggedInUser().then(function (response) {
            $scope.user = response;
        });
    }else{
        $window.location.href = "#!/";
    }
    
    $scope.addUser = function () {
        var id = AuthenticationService.getUser()["sub"];
        if(id){
            Socket.emit('join', {'user_id': id});
        }
        NotificationService.getFeeds().then(function (response) {
            $scope.feeds = response.feeds;
        }, function (error) {
            console.log(error);
        });
    };
    
    
    $scope.logout = function () {
        if(AuthenticationService.logout()){
            return $window.location.href = "#!/";
        }
    };

    Socket.on('feed_update', function (data) {
        NotificationService.getFeeds().then(function (response) {
            $scope.feeds = response.feeds;
        }, function (error) {
            console.log(error);
        });
    });
}]);

