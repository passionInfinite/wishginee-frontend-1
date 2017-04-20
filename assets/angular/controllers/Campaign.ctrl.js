Wishginee.controller("CampaignCtrl",["$scope","$window", "AuthenticationService","CampaignService","S3Client", function ($scope, $window, AuthenticationService,CampaignService, S3Client) {

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


    $scope.campaigns = [];
    $scope.campaigns = CampaignService.getAllCampaigns().then(function (response) {
        $scope.campaigns = response;
    }, function (error) {
        $window.location.href = "#!/";
    });
    
    $scope.setUpCampaign = function () {
        CampaignService.createCampaign().then(function (response) {
            if(response._id){
                $window.location.href = "#!/update/campaigns/"+response._id;
            }
        }, function (error) {
            $window.alert("Unable to Setup Campaign!");
        })
    };

    $scope.loadCampaign = function () {
        var id = $window.location.hash.split("/")[3];
        CampaignService.getCampaignById(id).then(function (response) {
            if(response.status == 'approved' || (response.is_approval == true && response.status == "pending")){
                $window.location.href = "#!/my_campaigns";
            }else{
                $scope.campaign = response;
            }
        }, function (error) {
            if(error.status == 404){
                $window.location.href = "#!/campaigns";
            }
        });
    };

    $scope.requestForApproval = function () {
        var details = {
            'name' : $scope.campaign_name,
            'abstract' : $scope.campaign_abstract,
            'category' : $scope.campaign_category,
            'contact_email' : $scope.campaign_email,
            'contact_mobile' : $scope.campaign_mobile,
            'story' : $scope.campaign_story,
            'date' : $scope.campaign_date,
            'location' : $scope.campaign_location,
            'fund_needed' : $scope.campaign_fund_needed,
            'is_approval' : true
        };
        if(($scope.campaign_name === undefined ||
            $scope.campaign_abstract === undefined ||
            $scope.campaign_category == "0" ||
            $scope.campaign_email === undefined ||
            $scope.campaign_mobile === undefined ||
            $scope.campaign_story === undefined ||
            $scope.campaign_date === undefined ||
            $scope.campaign_location === undefined ||
            $scope.campaign_fund_needed === undefined ||
            $scope.campaign_name === null ||
            $scope.campaign_abstract === null ||
            $scope.campaign_email === null ||
            $scope.campaign_mobile === null ||
            $scope.campaign_story === null ||
            $scope.campaign_date === null ||
            $scope.campaign_location === null ||
            $scope.campaign_fund_needed === null
        )){
            $window.alert("All details should be completed before sending for approval.");
        }else{
            CampaignService.submitForApproval($window.location.hash.split("/")[3], details).then(function (response) {
                if(response._id && response.is_approval){
                    $window.location.href = "#!/my_campaigns";
                }
            }, function (error) {
                if(error.status === 422){
                    $window.alert("All fields are required!");
                }
                if(error.status === 400){
                    if(AuthenticationService.logout()){
                        $window.location.href = "#!/";
                    }
                }
            });
        }
    };

    $scope.save = function () {
        var details = {
            'name' : $scope.campaign_name,
            'abstract' : $scope.campaign_abstract,
            'category' : $scope.campaign_category,
            'contact_email' : $scope.campaign_email,
            'contact_mobile' : $scope.campaign_mobile,
            'story' : $scope.campaign_story,
            'date' : $scope.campaign_date,
            'location' : $scope.campaign_location,
            'fund_needed' : $scope.campaign_fund_needed
        };

        CampaignService.save($window.location.hash.split("/")[3], details).then(function (response) {
            if(response._id && response.is_approval){
                $window.location.href = "#!/my_campaigns";
            }
        }, function (error) {
            if(error.status ===422){
                $window.alert("All Fields are required!");
            }
        });

    };

    $scope.uploadCover = function (files) {
        var id = $window.location.hash.split("/")[3];
        var params = {
            'Body' : files[0],
            'Key' : 'cover_photos/'+id,
            'Bucket' : 'wishginee-api',
            'ContentType' : files[0].type,
            'ACL' : 'public-read'
        };

        S3Client.uploadPhoto(params).then(function (response) {
            if(response){
                CampaignService.save(id,{'cover_photo' : response}).then(function (response) {
                    $window.location.reload();
                }, function (error) {
                    $window.alert("Unable to change cover photo!");
                });
            }
        }, function (error) {
            console.log(error);
        });
    };

    
    $scope.logout = function () {
        if(AuthenticationService.logout()){
            return $window.location.href = "#!/";
        }
    }
    
}]);
