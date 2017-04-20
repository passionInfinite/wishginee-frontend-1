Wishginee.controller("HomeCtrl",["$scope", "$window","AuthenticationService", function ($scope, $window, AuthenticationService) {
    
    $scope.isLoggedIn = false;  
    $scope.isLoggedIn = AuthenticationService.isUserAuthenticated();

    if($scope.isLoggedIn){
        $window.location.href = "#!/dashboard";
    }
    
}]);
