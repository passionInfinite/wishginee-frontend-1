Wishginee.controller("NotificationCtrl",["$scope","$window", "AuthenticationService","NotificationService","Socket", function ($scope, $window, AuthenticationService, NotificationService, Socket) {

    $scope.isLoggedIn = false;
    $scope.isLoggedIn = AuthenticationService.isUserAuthenticated();

    if($scope.isLoggedIn){
        AuthenticationService.getLoggedInUser().then(function (response) {
            $scope.user = response;
        });
    }else{
        $window.location.href = "#!/";
    }

    $scope.loadNotifications = function () {
        var id = AuthenticationService.getUser()["sub"];
        NotificationService.getUserNotifications(id).then(function (response) {
            $scope.notifications = response.notifications;
        }, function (error) {
            console.log(error);
        })
    };

    $scope.updateSeen = function () {
        var id = AuthenticationService.getUser()["sub"];
        NotificationService.updateSeen(id).then(function (response) {
            $scope.user.unread_notifications = 0;
        }, function (error) {
            console.log(error);
        })
    };
    
    $scope.logout = function () {
        if(AuthenticationService.logout()){
            return $window.location.href = "#!/";
        }
    };
    
    Socket.on('notification', function (data) {
        NotificationService.getUserNotifications(data.to_user_id).then(function (response) {
            $scope.notifications = response.notifications;
            $scope.user.unread_notifications = response.unread_notifications;
        }, function (error) {
            console.log(error);
        });
    });
}]);
