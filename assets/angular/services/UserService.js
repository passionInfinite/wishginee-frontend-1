Wishginee.service("UserService", ['$http', 'API_URL', '$cookies', function ($http, API_URL, $cookies) {
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
        
        getUsersDetails : function (id) {
            var promise = $http.get(API_URL+"/users/"+id,{headers: { 'Authorization' : 'Bearer '+self.getToken()}}).then(function (success) {
                return success.data.data;
            });
            return promise;
        },
        
        getAdminSideUserDetails : function () {
            var promise = $http.get(API_URL+"/admin/users",{headers: { 'Authorization' : 'Bearer '+self.getToken()}}).then(function (success) {
                return success.data.data;
            });
            return promise;            
        },
        
        createUserFollow : function (id) {
            var promise = $http.post(API_URL+"/follows/"+id,[],{headers: { 'Authorization' : 'Bearer '+self.getToken()}}).then(function (success) {
                return success.data.data;
            });
            return promise;
        },
        
        deleteUserFollow : function (id) {
            var promise = $http.delete(API_URL+"/follows/"+id,{headers: { 'Authorization' : 'Bearer '+self.getToken()}}).then(function (success) {
                return success.data.data;
            });
            return promise;
        },

        updateUserDetails : function (id,data) {
            var promise = $http.put(API_URL+"/users/"+id,data,{headers: { 'Authorization' : 'Bearer '+self.getToken()}}).then(function (success) {
                return success.data.data;
            });
            return promise;
        }
    }

}]);