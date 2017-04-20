var Wishginee = angular.module('Wishginee', ['ngRoute', 'ngCookies']);

Wishginee.constant('API_URL', 'http://wishginee.herokuapp.com/api');

Wishginee.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/',{
            templateUrl : "partials/homepage.html",
            controller: "HomeCtrl"
        })
        .when('/dashboard', {
            templateUrl: "partials/dashboard.html",
            controller: "DashboardCtrl"
        })
        .when('/campaigns', {
            templateUrl: "partials/campaigns.html",
            controller: "CampaignCtrl"
        })
        .when('/my_campaigns', {
            templateUrl: "partials/my_campaigns.html",
            controller: "MyCampaignCtrl"
        })
        .when('/events', {
            templateUrl: "partials/events.html",
            controller: "EventCtrl"
        })
        .when('/my_events', {
            templateUrl: "partials/my_events.html",
            controller: "MyEventCtrl"
        })
        .when('/update/campaigns/:id',{
            templateUrl : 'partials/update_campaign.html',
            controller: "CampaignCtrl"
        })
        .when('/admin/campaigns', {
            templateUrl: "partials/admin_campaign.html",
            controller: "AdminCampaignCtrl"
        })
        .when('/admin/events',{
            templateUrl: "partials/admin_event.html",
            controller: "AdminEventCtrl"
        })
        .when('/admin/users',{
            templateUrl: "partials/admin_user.html",
            controller: "AdminUsersCtrl"
        })
        .when('/admin/donations',{
            templateUrl: "partials/admin_user_donation.html",
            controller: "AdminDonationsCtrl"
        })
        .when('/update/events/:id', {
            templateUrl : "partials/update_event.html",
            controller : "EventCtrl"
        })
        .when('/events/:id', {
            templateUrl : "partials/event_profile.html",
            controller: "ProfileCtrl"
        })
        .when('/aboutUs', {
            templateUrl : "partials/aboutUs.html"
        })
        .when('/team', {
            templateUrl : "partials/team.html"
        })
        .when('/explore-campaigns', {
            templateUrl : "partials/explore_campaigns.html"
        })
        .when('/explore-events', {
            templateUrl : "partials/explore_events.html"
        })
        .when('/FAQs', {
            templateUrl : "partials/FAQs.html"
        })
        .when('/explore-donations', {
            templateUrl : "partials/explore_donations.html"
        })
        .when('/campaigns/:id', {
            templateUrl : "partials/campaign_profile.html",
            controller : "ProfileCtrl"
        })
        .when('/users/:id', {
            templateUrl : "partials/user_profile.html",
            controller : "ProfileCtrl"
        })
        .when('/notifications',{
            templateUrl : "partials/notifications.html",
            controller : "NotificationCtrl"
        })
        .when('/settings', {
            templateUrl : "partials/settings.html",
            controller : "ProfileCtrl"
        })
        .when('/donations', {
            templateUrl : "partials/contributions.html",
            controller : "ContributionCtrl"
        })

        .when('/contact-us', {
            templateUrl : "partials/contact_us.html"
        })
}]);

Wishginee.directive('onFileChange', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.onFileChange);

            element.bind('change', function() {
                scope.$apply(function() {
                    var files = element[0].files;
                    if (files) {
                        onChangeHandler(files);
                    }
                });
            });

        }
    };
});
