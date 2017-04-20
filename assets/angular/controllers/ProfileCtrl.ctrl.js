Wishginee.controller("ProfileCtrl",["$scope","$window","$filter", "AuthenticationService","EventService","CampaignService","UserService","Socket","NotificationService","S3Client", function ($scope, $window, $filter, AuthenticationService,EventService, CampaignService, UserService, Socket, NotificationService, S3Client) {

    $scope.isLoggedIn = false;
    $scope.isLoggedIn = AuthenticationService.isUserAuthenticated();

    $scope.isAuthenticated = false;

    if(AuthenticationService.getUser()["sub"] == $window.location.hash.split("/")[2]){
        $scope.isAuthenticated = true;
    }

    if($scope.isLoggedIn){
        AuthenticationService.getLoggedInUser().then(function (response) {
            $scope.user = response;
            $scope.first_name = response.first_name;
            $scope.last_name = response.last_name;
            $scope.website = response.website;
            $scope.description = response.description;
            $scope.city = response.city;
            $scope.country = response.country;
        });
    }else{
        $window.location.href = "#!/";
    }

    $scope.loadEvent = function () {

        $scope.isFollowing = false;
        var id = $window.location.hash.split("/")[2];
        var userId = AuthenticationService.getUser().sub;
        EventService.getEventById(id).then(function (response) {
            $scope.event = response;
            var followers = response.followers;
            angular.forEach(followers, function (object) {
                if(object.follower_id == userId){
                    $scope.isFollowing = true;
                }
            });
        }, function (error) {
           console.log(error);
        });
    };

    $scope.loadCampaign = function () {
        $scope.isFollowing = false;
        var userId = AuthenticationService.getUser().sub;
        var id = $window.location.hash.split("/")[2];
        CampaignService.getCampaignById(id).then(function (response) {
            $scope.campaign = response;
            var followers = response.followers;
            angular.forEach(followers, function (object) {
                if(object.follower_id == userId){
                    $scope.isFollowing = true;
                }
            });
        }, function (error) {
            console.log(error);
        });
    };
    
    $scope.loadUser = function () {
        var id = $window.location.hash.split("/")[2];
        var userId = AuthenticationService.getUser().sub;
        $scope.isFollowing = false;
        $scope.currentUserId = userId;
        $scope.id = id;
        UserService.getUsersDetails(id).then(function (response) {
            $scope.userProfile = response;
            var followers = response.followers;
            angular.forEach(followers, function (object) {
                if(object.follower_id == userId){
                    $scope.isFollowing = true;
                }
            });
            console.log($scope.userProfile);
        }, function (error) {
            console.log(error);
        })
    };

    $scope.edit = function (id) {
        $window.location.href = "#!/update/events/"+id;
    };
    
    $scope.followUser = function (id) {
        UserService.createUserFollow(id).then(function (response) {
            if(response){
                Socket.emit("update_notification",{'to_user_id' : id});
                $window.location.reload();
            }
        }, function (error) {
            console.log(error);
        });
    };

    $scope.unFollowUser = function (id) {
        UserService.deleteUserFollow(id).then(function (response) {
            if(response){
                $window.location.reload();
            }
        }, function (error) {
            console.log(error);
        });
    };

    $scope.followCampaign = function (id, user_id) {
        CampaignService.createCampaignFollow(id).then(function (response) {
            if(response){
                Socket.emit("update_notification",{'to_user_id' : user_id});
                $window.location.reload();
            }
        }, function (error) {
            console.log(error);
        });
    };

    $scope.unFollowCampaign = function (id) {
        CampaignService.deleteCampaignFollow(id).then(function (response) {
            if(response){
                $window.location.reload();
            }
        }, function (error) {
            console.log(error);
        });
    };

    $scope.followEvent = function (id, user_id) {
        EventService.createEventFollow(id).then(function (response) {
            if(response){
                Socket.emit("update_notification",{'to_user_id' : user_id});
                $window.location.reload();
            }
        }, function (error) {
            console.log(error);
        });
    };

    $scope.unFollowEvent = function (id) {
        EventService.deleteEventFollow(id).then(function (response) {
            if(response){
                $window.location.reload();
            }
        }, function (error) {
            console.log(error);
        });
    };

    $scope.initialize = function () {
        
    };

    $scope.uploadProfile = function (files) {
        var id = $window.location.hash.split("/")[2];
        var params = {
            'Body' : files[0],
            'Key' : 'profile_photos/'+id,
            'Bucket' : 'wishginee-api',
            'ContentType' : files[0].type,
            'ACL' : 'public-read'
        };

        S3Client.uploadPhoto(params).then(function (response) {
            if(response){
                console.log(response);
                UserService.updateUserDetails(id,{'profile_photo' : response}).then(function (response) {
                    $window.location.reload();
                }, function (error) {
                    $window.alert("Unable to change profile photo!");
                });
            }
        }, function (error) {
            console.log(error);
        });
    };

    $scope.uploadCover = function (files) {
        var id = $window.location.hash.split("/")[2];
        var params = {
            'Body' : files[0],
            'Key' : 'cover_photos/'+id,
            'Bucket' : 'wishginee-api',
            'ContentType' : files[0].type,
            'ACL' : 'public-read'
        };

        S3Client.uploadPhoto(params).then(function (response) {
            if(response){
                UserService.updateUserDetails(id,{'cover_photo' : response}).then(function (response) {
                    $window.location.reload();
                }, function (error) {
                    $window.alert("Unable to change cover photo!");
                });
            }
        }, function (error) {
            console.log(error);
        });
    };

    $scope.updateUser = function (id) {
        var data = {
            'first_name' : $scope.first_name,
            'last_name' : $scope.last_name,
            'description' : $scope.description,
            'password' : $scope.password,
            'city' : $scope.city,
            'country' : $scope.country
        };
        if($scope.website.substr(0,7) == "http://" || $scope.website.substr(0,8) == "https://"){
            data.website = $scope.website;
        }else{
            data.website = "http://"+$scope.website;
        }
        UserService.updateUserDetails(id,data).then(function (response) {
            $scope.user = response;
            $window.location.reload();
        }, function (error) {
            $window.alert(error.data.error.website[0])
        })
    };

    $scope.logout = function () {
        if(AuthenticationService.logout()){
            return $window.location.href = "#!/";
        }
    };
}]);
