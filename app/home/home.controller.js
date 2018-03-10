"use strict";

angular.module("forum").controller('homeController',
    ["$scope", "$http", "toastr", "localStorageService", "$uibModal","$state",'$timeout', '$interval',
        function ($scope, $http, toastr, localStorageService, $uibModal,$state,$interval,$timeout) {

            $scope.serverurl=SERVER_URL;
            $scope.username = localStorageService.get("username");


            //写一个方法获取当前时间
            $scope.SetTimer=function(){
                $scope.$apply(function(){
                    var now=new Date();
                    $scope.Now1=now.getFullYear();
                    $scope.Now2=now.getMonth()+1;
                    $scope.Now3=now.getDate();
                    //$scope.Now4=now.get();
                    var hour=now.getHours().toString();
                    var minutes=now.getMinutes().toString();
                    var seconds=now.getSeconds().toString();
                    hour=hour.length===2?hour:"0"+hour;
                    minutes=minutes.length===2?minutes:"0"+minutes;
                    seconds=seconds.length===2?seconds:"0"+seconds;

                    $scope.Now5=hour+':'+minutes+':'+seconds;

                });
            };


            $scope.getdata=function () {
                $http.post(SERVER_URL + "/admin/getOverview").then(function (response) {
                    $scope.usernum=response.data.user_num;
                    $scope.filenum=response.data.file_num;
                    $scope.forumnum=response.data.forum_num;
                    $scope.commentnum=response.data.comment_num;
                    $scope.announcenum=response.data.announce_num;
                }).catch(function (error) {
                    if (error.data) {
                        toastr.error(error.data.err);
                    } else {
                        toastr.error("连接服务器失败!");
                    }
                });
            };
            $scope.getdata();

            //每隔1秒刷新一次时间
            $scope.SetTimerInterval=setInterval($scope.SetTimer,1000);


        }]);
