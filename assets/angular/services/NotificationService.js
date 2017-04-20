Wishginee.service("NotificationService", ['$http', 'API_URL', '$cookies', function ($http, API_URL, $cookies) {
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

        getUserNotifications : function (id) {
            var promise = $http.get(API_URL+"/notifications/"+id,{headers:{Authorization: 'Bearer '+self.getToken()}}).then(function (success) {
                return success.data.data;
            }, function (error) {
                console.log(error);
            });
            return promise;
        },

        updateSeen : function (id) {
            var promise = $http.put(API_URL+"/notifications/"+id,[],{headers:{Authorization: 'Bearer '+self.getToken()}}).then(function (success) {
                return success.data.data;
            }, function (error) {
                console.log(error);
            });
            return promise;
        },
        
        getFeeds : function () {
            var promise = $http.get(API_URL+"/feeds",{headers:{Authorization: 'Bearer '+self.getToken()}}).then(function (success) {
                return success.data.data;
            }, function (error) {
                console.log(error);
            });
            return promise;
        }
    }

}]);