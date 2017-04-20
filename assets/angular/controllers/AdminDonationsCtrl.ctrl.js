Wishginee.controller("AdminDonationsCtrl",["$scope","$window","$filter", "AuthenticationService", "DonationService", function ($scope, $window, $filter, AuthenticationService, DonationService) {

    $scope.isLoggedIn = false;
    $scope.isLoggedIn = AuthenticationService.isUserAuthenticated();

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
    };
    
    $scope.loadDonations = function () {
        DonationService.adminSideDonationsDetails().then(function (response) {
            if(response){
                $scope.donations = response;
                console.log($scope.donations);
            }
        }, function (error) {
            console.log(error);
        })  
    };
}]);
