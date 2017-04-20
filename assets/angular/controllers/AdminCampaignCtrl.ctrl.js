Wishginee.controller("AdminCampaignCtrl", ["$scope", "CampaignService","$window","AuthenticationService","Socket", function ($scope, CampaignService, $window, AuthenticationService, Socket) {

    $scope.isLoggedIn = false;
    $scope.isLoggedIn = AuthenticationService.isUserAuthenticated();

    if($scope.isLoggedIn){
        AuthenticationService.getLoggedInUser().then(function (response) {
            $scope.user = response;
        });
    }else{
        $window.location.href = "#!/";
    }

    $scope.campaigns = [];
    $scope.approvedCampaignsCount = 0;
    $scope.pendingCampaignsCount = 0;
    $scope.savedCampaignsCount = 0;
    $scope.totalDonation = 0;
    $scope.totalCampaigns = 0;

    $scope.loadDetails = function () {
        CampaignService.adminSideCampaignDetails().then(function (response) {
            $scope.campaigns = response.campaigns;
            $scope.approvedCampaignsCount = response.approved_campaigns.length;
            $scope.pendingCampaignsCount = response.pending_campaigns.length;
            $scope.savedCampaignsCount = response.saved_campaigns.length;
            $scope.totalCampaigns = response.total_campaigns;
            $scope.totalDonation = response.total_donation;
        }, function (error) {
            $window.alert("Unable to load details!");
        });
    };
    
    $scope.approve = function (id) {
        CampaignService.approveCampaign(id).then(function (response) {
            if(response){
                $window.location.reload();
                Socket.emit("feed",{'id': id});
            }
        },function (error) {
            if(error){
                $window.alert("Unable to approve campaign!");
            }
        });
    };

    $scope.delete = function (id) {
        CampaignService.deleteCampaign(id).then(function (response) {
            if(response){
                $window.location.reload();
            }
        }, function (error) {
            if(error){
                $window.alert("Unable to delete campaign!");
            }
        });
    };

    $scope.viewMore = function (id) {
        $window.location.href = "#!/campaigns/"+id;
    };

    $scope.logout = function () {
        if(AuthenticationService.logout()){
            return $window.location.href = "#!/";
        }
    }
}]);