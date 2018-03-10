"use strict";

angular.module("forum").controller('fileManagementController',
    ["$scope", "$http", "toastr", "localStorageService", "$uibModal", "$state","$filter" ,"editableOptions",
        function ($scope, $http, toastr, localStorageService, $uibModal, $state,$filter ,editableOptions) {

            $scope.serverurl=SERVER_URL;
            $scope.username = localStorageService.get("username");


            /*显示文件管理列表*/
            $scope.fileshares = [];
            //$scope.tmfileshares = [];
            $scope.showlist=function (offset) {
                $http.post(SERVER_URL + "/admin/getFileList",{"offset":offset}).then(function (response) {
                    $scope.fileshares = response.data;
                }).catch(function (error) {
                    if (error.data) {
                        toastr.error(error.data.err);
                    } else {
                        toastr.error("连接服务器失败!");
                    }
                });
            };
            $scope.showlist(null);




            $scope.saveoffset=[];
            $scope.index=0;
            $scope.saveoffset[$scope.index]=null;


            /*下一页*/
            $scope.loadMore=function () {
                if($scope.fileshares.length==10){
                    $scope.showlist($scope.fileshares[$scope.fileshares.length-1].updated_at);
                    $scope.index=$scope.index+1;
                    $scope.saveoffset.push($scope.fileshares[$scope.fileshares.length-1].updated_at);
                }
                else {
                    toastr.info("已没有更多");
                }
            };

            /*首页*/
            $scope.firstPage=function(){
                $scope.index=0;
                $scope.showlist($scope.saveoffset[$scope.index]);
            };

            /*上一页*/
            $scope.backTo=function(){
                if($scope.saveoffset.length>1 && $scope.index!=0){
                    $scope.showlist($scope.saveoffset[$scope.index-1]);
                    $scope.index=$scope.index-1;
                }
                else if($scope.index==0){
                    toastr.info("已是第一页");
                }

            };






            /*删除文件*/
            $scope.removeAnnouncement = function (index) {
                if ($scope.fileshares[index]["_id"] === undefined) {
                    $scope.fileshares.splice(index, 1);
                    toastr.info("删除成功");
                    $scope.showlist($scope.saveoffset[$scope.index]);
                } else {
                    $http.post(SERVER_URL + "/admin/deleteFile", {"_id": $scope.fileshares[index]["_id"]}).then(function (response) {
                        //$scope.fileshares.splice(index, 1);
                        toastr.info("删除成功");
                        $scope.showlist($scope.saveoffset[$scope.index]);
                    }).catch(function (error) {
                        if (error.data) {
                            toastr.error(error.data.err);
                        } else {
                            toastr.error("连接服务器失败!");
                        }
                    });
                }


            };

            /*保存文件*/
            $scope.saveFileshare = function (data, fruit) {
                //$scope.user not updated yet
                data.originalname=fruit.originalname;
                angular.extend(data, {_id: fruit._id});
                if (fruit._id) {
                    var ret = $http.post(SERVER_URL + "/admin/updateFile", data);
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
                }

            };


            /*添加文件*/
            /*$scope.addFilemanagement = function () {
                $scope.inserted = {
                    "title": "",
                    "username":"",
                    "originalname": "",
                    "comment":"",
                    "created_at":"",
                    "download_times":"",
                    "_id": undefined
                };
                $scope.fileshares.push($scope.inserted);
            };*/


            /*上传--弹框*/
            $scope.openFileEditor=function (file) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'fileManagement/newFile.template.html',
                    controller: 'newFileCtrl',
                    size: "lg",
                    resolve: {
                        items: function () {
                            return file;
                        }
                    }
                });

                modalInstance.result.then(function (item) {
                    if(item==="delete" || item==="modify"){
                        //$state.go("home",null,{"reload":true});
                    }


                    $scope.showlist(null);
                    //toastr.info("请不要忘记保存修改!");
                }, function () {
                    //alert('Modal dismissed at: ' + new Date());
                });
            };

            /*搜索文件*/
            $scope.searchFile=function (searchFor) {
                if(searchFor){
                    $scope.index=0;
                    $http.post(SERVER_URL + "/searchForFile",{"exp" :searchFor})
                        .then(function (response) {
                            $scope.fileshares =response.data;
                        })
                        .catch(function (error) {
                            toastr.error(error.data.err);
                        });}
                else {
                    $scope.showlist($scope.saveoffset[$scope.index]);
                }
            };
        }]);

