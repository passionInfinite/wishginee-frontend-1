Wishginee.controller("AdminEventCtrl", ["$scope", "EventService","$window","AuthenticationService","Socket", function ($scope, EventService, $window, AuthenticationService, Socket) {

    $scope.isLoggedIn = false;
    $scope.isLoggedIn = AuthenticationService.isUserAuthenticated();

    if($scope.isLoggedIn){
        AuthenticationService.getLoggedInUser().then(function (response) {
            $scope.user = response;
        });
    }else{
        $window.location.href = "#!/";
    }

    $scope.events = [];
    $scope.approvedEventsCount = 0;
    $scope.pendingEventsCount = 0;
    $scope.savedEventsCount = 0;
    $scope.totalDonation = 0;
    $scope.totalEvents = 0;

    $scope.loadDetails = function () {
        EventService.adminSideEventDetails().then(function (response) {
            $scope.events = response.events;
            $scope.approvedEventsCount = response.approved_events.length;
            $scope.pendingEventsCount = response.pending_events.length;
            $scope.savedEventsCount = response.saved_events.length;
            $scope.totalEvents = response.total_events;
            $scope.totalDonation = response.total_donation;
        }, function (error) {
            $window.alert("Unable to load details!");
        });
    };

    $scope.approve = function (id) {
        EventService.approveEvent(id).then(function (response) {
            if(response){
                $window.location.reload();
                Socket.emit("feed",{'id': id});
            }
        },function (error) {
            if(error){
                $window.alert("Unable to approve event!");
            }
        });
    };

    $scope.delete = function (id) {
        EventService.deleteEvent(id).then(function (response) {
            if(response){
                $window.location.reload();
            }
        }, function (error) {
            if(error){
                $window.alert("Unable to delete event!");
            }
        });
    };

    $scope.viewMore = function (id) {
        $window.location.href = "#!/events/"+id;
    };

    $scope.logout = function () {
        if(AuthenticationService.logout()){
            return $window.location.href = "#!/";
        }
    }
}]);