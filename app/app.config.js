"use strict";

angular.module("forum").config(["$stateProvider", "$urlRouterProvider", "toastrConfig","$touchProvider",
    function ($stateProvider, $urlRouterProvider, toastrConfig,$touchProvider) {

        $stateProvider.state("home", {
            url: "/",
            templateUrl: "home/home.template.html",
            controller: "homeController"
        }).state("login", {
            url: "/login",
            templateUrl: "login/login.template.html",
            controller: "loginController"
        }).state("profile", {
            url: "/profile",
            templateUrl: "profile/profile.template.html",
            controller: "profileController"
        }).state("detail", {
            url: "/detail/:id",
            templateUrl: "detail/detail.template.html",
            controller: "detailController"
        }).state("userInfo", {
            url: "/userInfo/:username",
            templateUrl: "userInfo/userInfo.template.html",
            controller: "userInfoController"
        }).state("cart", {
            url: "/cart",
            templateUrl: "cart/cart.template.html",
            controller: "cartController"
        }).state("address", {
            url: "/address",
            templateUrl: "address/address.template.html",
            controller: "addressController"
        }).state("modifyAddress", {
            url: "/modifyAddress",
            templateUrl: "modifyAddress/modifyAddress.template.html",
            controller: "modifyAddressController",
            params: {
                _id: -1,
                name: "",
                address: "",
                phone: "",
                default: 0
            }
        }).state("register", {
            url: "/register",
            templateUrl: "register/register.template.html",
            controller: "registerController",
            params: {
                reset: 0
            }
        }).state("reset", {
            url: "/reset",
            templateUrl: "register/register.template.html",
            controller: "registerController",
            params: {
                reset: 1
            }
        }).state("share", {
            url: "/share",
            templateUrl: "share/share.template.html",
            controller: "shareController"
        }).state("shareDetail",{
            url:"/shareDetail/:_id",
            templateUrl:"shareDetail/shareDetail.template.html",
            controller:"shareDetailController"
        }).state("filemanagement",{
            url:"/filemanagement",
            templateUrl:"fileManagement/fileManagement.template.html",
            controller:"fileManagementController"
        }).state("announcements",{
            url: "/announcements",
            templateUrl: "announcements/announcements.template.html",
            controller: "announcementsController"
        }).state("user",{
            url:"/user",
            templateUrl:"user/user.template.html",
            controller:"UserController"
        }).state("fileManagement", {
            url: "/fileManagement",
            templateUrl: "fileManagement/fileManagement.template.html",
            controller: "fileManagementController"
        }).state("forums", {
            url: "/forums",
            templateUrl: "forums/forums.template.html",
            controller: "forumsController"
        });


        $urlRouterProvider.otherwise("/");


        $touchProvider.ngClickOverrideEnabled(true);

        angular.extend(toastrConfig, {
            extendedTimeOut: 1000,
            timeOut: 1000
        });


    }]);

angular.module("cambricon-forum").run(["editableOptions",function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

}]);