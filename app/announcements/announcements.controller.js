"use strict";

angular.module("forum").controller('announcementsController',
    ["$scope", "$http", "toastr", "localStorageService", "$uibModal", "$state",
        function ($scope, $http, toastr, localStorageService, $uibModal, $state) {
            // $scope.rowCollection = [
            //     {
            //         firstName: 'Laurent',
            //         lastName: 'Renard',
            //         birthDate: new Date('1987-05-21'),
            //         balance: 102,
            //         email: 'whatever@gmail.com'
            //     },
            //     {
            //         firstName: 'Blandine',
            //         lastName: 'Faivre',
            //         birthDate: new Date('1987-04-25'),
            //         balance: -2323.22,
            //         email: 'oufblandou@gmail.com'
            //     },
            //     {
            //         firstName: 'Francoise',
            //         lastName: 'Frere',
            //         birthDate: new Date('1955-08-27'),
            //         balance: 42343,
            //         email: 'raymondef@gmail.com'
            //     }
            // ];

            $scope.announcements = [];
            $scope.show=function () {
                $http.post(SERVER_URL + "/admin/getAnnouncement").then(function (response) {
                    $scope.announcements = response.data;
                }).catch(function (error) {
                    if (error.data) {
                        toastr.error(error.data.err);
                    } else {
                        toastr.error("连接服务器失败!");
                    }
                });
            };
            $scope.show();


            $scope.removeAnnouncement = function (index) {
                if ($scope.announcements[index]["a_id"] === undefined) {
                    //$scope.announcements.splice(index, 1);
                    toastr.info("删除成功");
                    $scope.show();
                } else {
                    $http.post(SERVER_URL + "/admin/deleteAnnouncement", {"a_id": $scope.announcements[index]["a_id"]}).then(function (response) {
                        //$scope.announcements.splice(index, 1);
                        toastr.info("删除成功");
                        $scope.show();
                    }).catch(function (error) {
                        if (error.data) {
                            toastr.error("已删除");
                        } else {
                            toastr.error("连接服务器失败!");
                        }
                    });
                }


            };
            $scope.saveAnnouncement = function (data, fruit) {
                //$scope.user not updated yet
                angular.extend(data, {a_id: fruit.a_id});
                if (fruit.a_id) {
                    var ret = $http.post(SERVER_URL + '/admin/updateAnnouncement', data);
                    ret.then(function (response) {
                        toastr.info("更新成功");
                    }).catch(function (error) {
                        if (error.data) {
                            toastr.error(error.data.err);
                        } else {
                            toastr.error("连接服务器失败!");
                        }
                    });
                    return ret;
                } else {
                    var ret = $http.post(SERVER_URL + '/admin/createAnnouncement', data);
                    ret.then(function (response) {
                        console.log(response.data.a_id);
                        fruit.a_id = response.data.a_id;
                        toastr.info("插入成功");
                    }).catch(function (error) {
                        if (error.data) {
                            toastr.error(error.data.err);
                        } else {
                            toastr.error("连接服务器失败!");
                        }
                    });
                    return ret;
                }

            };


            $scope.addAnnouncement = function () {
                $scope.inserted = {
                    "title": "",
                    "content": "",
                    "a_id": undefined,
                    "deleted_at":null
                };
                $scope.announcements.push($scope.inserted);
            };
        }]);
