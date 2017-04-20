Wishginee.service("CampaignService", ['$http', 'API_URL', '$cookies', function ($http, API_URL, $cookies) {
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
        
        getAllCampaigns : function () {
            var promise = $http.get(API_URL+"/campaigns",{headers: {'Authorization' : "Bearer "+self.getToken()} }).then(function (success) {
                return success.data.data;
            });
            return promise;
        },

        createCampaign : function () {
            var promise = $http.post(API_URL+"/campaigns",[],{headers: {'Authorization' : 'Bearer '+self.getToken()}}).then(function (success) {
                return success.data.data;
            });
            return promise;
        },

        getCampaignById : function (id) {
            var promise = $http.get(API_URL+"/campaigns/"+id,{headers: {'Authorization' : "Bearer "+self.getToken()} }).then(function (success) {
                return success.data.data;
            });
            return promise;
        },

        submitForApproval : function (id, details) {
            var promise = $http.put(API_URL+"/campaigns/"+id,details,{headers: {'Authorization' : "Bearer "+self.getToken()} }).then(function (success) {
                return success.data.data;
            });
            return promise;
        },

        save : function (id, details) {
            var promise = $http.put(API_URL+"/campaigns/"+id,details,{headers: {'Authorization' : "Bearer "+self.getToken()} }).then(function (success) {
                return success.data.data;
            });
            return promise;
        },

        adminSideCampaignDetails : function () {
            
            var promise = $http.get(API_URL+"/admin/campaigns",{headers: { 'Authorization' : 'Bearer '+self.getToken()}}).then(function (success) {
                return success.data.data;
            });
            return promise;
        },
        
        approveCampaign : function (id) {
            var promise = $http.post(API_URL+"/campaigns/approve/"+id,{},{headers: { 'Authorization' : 'Bearer '+self.getToken()}}).then(function (success) {
                return success.data.data;
            });
            return promise;
        },
        
        deleteCampaign : function (id) {
            var promise = $http.delete(API_URL+"/campaigns/"+id,{headers: { 'Authorization' : 'Bearer '+self.getToken()}}).then(function (success) {
                return success.data.data;
            });
            return promise;
        },
        
        getUsersDetails : function (id) {
            var promise = $http.get(API_URL+"/users/"+id,{headers: { 'Authorization' : 'Bearer '+self.getToken()}}).then(function (success) {
                return success.data.data;
            });
            return promise;
        },

        createCampaignFollow : function (id) {
            var promise = $http.post(API_URL+"/follows/"+id,[],{headers: { 'Authorization' : 'Bearer '+self.getToken()}}).then(function (success) {
                return success.data.data;
            });
            return promise;
        },

        deleteCampaignFollow : function (id) {
            var promise = $http.delete(API_URL+"/follows/"+id,{headers: { 'Authorization' : 'Bearer '+self.getToken()}}).then(function (success) {
                return success.data.data;
            });
            return promise;
        }
    }

}]);