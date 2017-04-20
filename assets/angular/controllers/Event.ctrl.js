Wishginee.controller("EventCtrl",["$scope","$window", "AuthenticationService","EventService","S3Client", function ($scope, $window, AuthenticationService,EventService, S3Client) {

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
    $scope.events = EventService.getAllEvents().then(function (response) {
        $scope.events = response;
    }, function (error) {
        $window.alert("Events were not loaded! Please make sure you are logged in!");
    });

    $scope.setupEvent = function () {
        EventService.createEvent().then(function (response) {
            if(response._id){
                $window.location.href = "#!/update/events/"+response._id;
            }
        }, function (error) {
            $window.alert("Unable to Setup Campaign!");
        })  
    };
    
    $scope.loadEvent = function () {
        var id = $window.location.hash.split("/")[3];
        EventService.getEventById(id).then(function (response) {
            if(response.status == 'approved' || (response.is_approval == true && response.status == "pending")){
                $window.location.href = "#!/my_events";
            }else{
                $scope.event = response;
            }
        }, function (error) {
            if(error.status == 404){
                $window.location.href = "#!/events";
            }
        });
    };

    $scope.requestForApproval = function () {
        var details = {
            'name' : $scope.event_name,
            'abstract' : $scope.event_abstract,
            'category' : $scope.event_category,
            'contact_email' : $scope.event_email,
            'contact_mobile' : $scope.event_mobile,
            'story' : $scope.event_story,
            'date' : $scope.event_date,
            'location' : $scope.event_location,
            'fund_needed' : $scope.event_fund_needed,
            'is_approval' : true
        };
        if(($scope.event_name === undefined ||
                $scope.event_abstract === undefined ||
                $scope.event_category == "0" ||
                $scope.event_email === undefined ||
                $scope.event_mobile === undefined ||
                $scope.event_story === undefined ||
                $scope.event_date === undefined ||
                $scope.event_location === undefined ||
                $scope.event_fund_needed === undefined ||
                $scope.event_name === null ||
                $scope.event_abstract === null ||
                $scope.event_email === null ||
                $scope.event_mobile === null ||
                $scope.event_story === null ||
                $scope.event_date === null ||
                $scope.event_location === null ||
                $scope.event_fund_needed === null
            )){
            $window.alert("All details should be completed before sending for approval.");
        }else{
            EventService.submitForApproval($window.location.hash.split("/")[3], details).then(function (response) {
                if(response._id && response.is_approval){
                    $window.location.href = "#!/my_events";
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
            'name' : $scope.event_name,
            'abstract' : $scope.event_abstract,
            'category' : $scope.event_category,
            'contact_email' : $scope.event_email,
            'contact_mobile' : $scope.event_mobile,
            'story' : $scope.event_story,
            'date' : $scope.event_date,
            'location' : $scope.event_location,
            'fund_needed' : $scope.event_fund_needed
        };

        CampaignService.save($window.location.hash.split("/")[3], details).then(function (response) {
            if(response._id && response.is_approval){
                $window.location.href = "#!/my_events";
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
                EventService.save(id,{'cover_photo' : response}).then(function (response) {
                    $window.location.reload();
                }, function (error) {
                    $window.alert("Unable to change cover photo!");
                });
            }
        }, function (error) {
            console.log(error);
        });
    };

    // $scope.uploadProfile = function (files) {
    //     var id = $window.location.hash.split("/")[3];
    //     var params = {
    //         'Body' : files[0],
    //         'Key' : 'profile_photos/'+id,
    //         'Bucket' : 'wishginee-api',
    //         'ContentType' : files[0].type,
    //         'ACL' : 'public-read'
    //     };
    //
    //     S3Client.uploadPhoto(params).then(function (response) {
    //         if(response){
    //             EventService.save(id,{'profile_photo' : response}).then(function (response) {
    //                 $window.location.reload();
    //             }, function (error) {
    //                 $window.alert("Unable to change cover photo!");
    //             });
    //         }
    //     }, function (error) {
    //         console.log(error);
    //     });
    // };

    $scope.logout = function () {
        if(AuthenticationService.logout()){
            return $window.location.href = "#!/";
        }
    }
    
}]);
