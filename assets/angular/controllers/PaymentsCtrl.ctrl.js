Wishginee.controller("PaymentsCtrl",["$scope","$window","CampaignService","EventService","PaymentsService","Socket", function ($scope, $window, CampaignService, EventService, PaymentsService, Socket) {

    var self = this;

    self.successHandler = function (transaction, type, name, id, amount) {
        var data = {
            'donee_name' : name,
            'donee_id' : id,
            'donee_type' : type.toLowerCase(),
            'payment_id' : transaction.razorpay_payment_id,
            'amount' : amount
        };

        PaymentsService.capturePayment(data).then(function (response) {
            if(response){
                Socket.emit("feed",{});
            }
        }, function (error) {
            console.log(error);
        });
    };

    self.generateOptions = function(amount, description, name){
        return {
            'key': 'rzp_test_gkmGKnrkd2o2D1',
            'amount': amount * 100,
            'name': 'Wishginee',
            'description': description+" "+name,
            'handler': function (transaction) {
                self.successHandler(transaction, $scope.type, $scope.name, $scope.type_id, $scope.amount);
            }
        }
    };

    $scope.donateCampaign = function () {
        var campaignId = $window.campaignId;
        CampaignService.getCampaignById(campaignId).then(function (response) {
            $scope.name = response.name;
            $scope.type = 'Campaign';
            $scope.type_id = response._id;
            $scope.amount = $scope.donation * 100;
            var razorPay = new Razorpay(self.generateOptions($scope.donation, $scope.type, $scope.name));
            razorPay.open();
        }, function (error) {
            console.log(error);
        });
    };

    $scope.donateEvent = function () {
        var eventId = $window.eventId;
        EventService.getEventById(eventId).then(function (response) {
            $scope.name = response.name;
            $scope.type = 'Event';
            $scope.type_id = response._id;
            $scope.amount = $scope.donation * 100;
            var razorPay = new Razorpay(self.generateOptions($scope.donation, $scope.type, $scope.name));
            razorPay.open();
        }, function (error) {
            console.log(error);
        });
    }

}]);