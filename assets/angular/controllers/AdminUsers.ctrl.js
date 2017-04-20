Wishginee.controller("AdminUsersCtrl", ["$scope", "UserService","$window","AuthenticationService", function ($scope, UserService, $window, AuthenticationService) {

    $scope.isLoggedIn = false;
    $scope.isLoggedIn = AuthenticationService.isUserAuthenticated();

    if($scope.isLoggedIn){
        AuthenticationService.getLoggedInUser().then(function (response) {
            $scope.user = response;
        });
    }else{
        $window.location.href = "#!/";
    }

    $scope.ngos = [];
    $scope.socialCorps = [];
    $scope.helpingHands = [];
    $scope.superUsers = [];
    $scope.publicUserCount = 0;
    $scope.unApprovedNGOs = 0;
    $scope.unApprovedSCs = 0;
    $scope.unApprovedHHs = 0;

    $scope.loadUserDetails = function () {
        UserService.getAdminSideUserDetails().then(function (response) {
            $scope.ngos = response.ngos;
            $scope.socialCorps = response.social_corporates;
            $scope.helpingHands = response.helping_hands;
            $scope.superUsers = response.super_users;
            $scope.publicUserCount = response.public_users;
            $scope.unApprovedNGOs = response.unapproved_ngos;
            $scope.unApprovedSCs = response.unapproved_sc;
            $scope.unApprovedHHs = response.unapproved_HH;
            $scope.allUsers = $scope.ngos.concat($scope.socialCorps).concat($scope.helpingHands).concat($scope.superUsers);
            console.log($scope.allUsers);
        }, function (error) {
            console.log(error);
        });
    };

    $scope.loadView = function (group, id) {
        $window.location.href = "#!/users/"+id;
    };

    $scope.logout = function () {
        if(AuthenticationService.logout()){
            return $window.location.href = "#!/";
        }
    }
}]);