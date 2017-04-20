Wishginee.controller("ContributionCtrl",["$scope","$window", "AuthenticationService","CampaignService","S3Client", function ($scope, $window, AuthenticationService,CampaignService, S3Client) {

    $scope.isLoggedIn = false;
    $scope.isLoggedIn = AuthenticationService.isUserAuthenticated();

    $scope.error = '';

    if($scope.isLoggedIn){
        AuthenticationService.getLoggedInUser().then(function (response) {
            $scope.user = response;
        });
    }else{
        $window.location.href = "#!/";
    }
    

    $scope.logout = function () {
        if(AuthenticationService.logout()){
            return $window.location.href = "#!/";
        }
    }

}]);
