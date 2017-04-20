Wishginee.service("AuthenticationService", ['$http', 'API_URL', '$cookies', function ($http, API_URL, $cookies) {
    var self = this;

    self.parseJwt = function(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    };

    self.getToken = function () {
        return $cookies.getObject("wishginee");
    };

    self.isLoggedIn = function (token) {
        if(token) {
            var params = self.parseJwt(token);
            return Math.round(new Date().getTime() / 1000) <= params.exp;
        } else {
            return false;
        }
    };

    return {

        loginWithFacebook : function (facebook_access_token) {
            var promise = $http.post(API_URL+"/auth", {
                'authType' : "facebook",
                "fb_access_code" : facebook_access_token,
                "group" : "PU"
            }).then(function (success) {
                if(success.data.data.access_token != null) {
                    $cookies.putObject("wishginee", success.data.data.access_token);
                    if(self.getToken() != null){
                        return self.getToken();
                    }
                }
            });
            return promise;
        },
        
        customSignUp : function (user) {
            var promise = $http.post(API_URL+"/users",user).then(function (success) {
                return success.data.data;
            });
            return promise;
        },
        
        customLogin : function (user) {
            var promise = $http.post(API_URL+"/auth",user).then(function (success) {
                if(success.data.data.access_token != null) {
                    $cookies.putObject("wishginee", success.data.data.access_token);
                    if(self.getToken() != null){
                        return self.getToken();
                    }
                }
            });
            return promise;  
        },
        
        logout : function () {
            $cookies.remove("wishginee");
            if(self.getToken() == null){
                return true;
            }else{
                return false;
            }
        },
        
        isUserAuthenticated : function () {
            var param = self.getToken();
            if(param != null){
                return self.isLoggedIn(param);
            }
        },
        
        getLoggedInUser : function () {
            if(self.getToken() != null){
                var promise  = $http.get(API_URL+"/users/me",{headers: {'Authorization' : "Bearer "+self.getToken()} }).then(function (success) {
                    return success.data.data;
                });
                return promise;
            }
        },
        
        getUser : function () {
            return self.parseJwt(self.getToken());
        }
    }

}]);