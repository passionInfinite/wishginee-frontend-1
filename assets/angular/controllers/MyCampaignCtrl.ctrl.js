Wishginee.controller("MyCampaignCtrl",["$scope","$window", "AuthenticationService","CampaignService", function ($scope, $window, AuthenticationService,CampaignService) {

    $scope.isLoggedIn = false;
    $scope.isLoggedIn = AuthenticationService.isUserAuthenticated();

    if($scope.isLoggedIn){
        AuthenticationService.getLoggedInUser().then(function (response) {
            $scope.user = response;
        });
    }else{
        $window.location.href = "#!/";
    }

    $scope.loadCampaigns = function () {
        CampaignService.getUsersDetails("me").then(function (response) {
            $scope.campaigns = response.campaigns;
        }, function (error) {
            console.log(error);
        })
    };

    $scope.viewMore = function (id) {
      $window.location.href = "#!/campaigns/"+id;
    };

    $scope.edit = function (id) {
        $window.location.href = "#!/update/campaigns/"+id;
    };
    
    $scope.logout = function () {
        if(AuthenticationService.logout()){
            return $window.location.href = "#!/";
        }
    }


}]);
