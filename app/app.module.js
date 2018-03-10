
angular.module("forum",
    ['ngAnimate', 'ngTouch', 'ngResource', "xeditable", 'ui.router', "ngSanitize", 'smart-table', 'toastr', 'satellizer', 'ui.bootstrap', "ngFileUpload", 'angular-loading-bar', 'LocalStorageModule', 'angular-carousel', 'monospaced.qrcode', 'colorpicker.module']);


var SERVER_URL = "http://hakureireimu.xyz:3000";
var ONLINE_MODE = true;

angular.module("forum").controller('appController',
    ["$scope",
        function ($scope) {

            var getLoginPartial = function () {
                var random = Math.random();
                return "loginPartial/loginPartial.template.html?r=" + random;
            };
            $scope.loginPartial = getLoginPartial();

            $scope.$on('userStateChange', function () {
                $scope.loginPartial = getLoginPartial();
            });


        }]);
