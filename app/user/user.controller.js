"use strict";

angular.module("forum").controller('UserController',
    ["$scope", "$stateParams","$http", "toastr", "localStorageService", "$uibModal","$state","$filter" ,"editableOptions",
        function ($scope, $stateParams,$http, toastr, localStorageService, $uibModal, $state, $filter ,editableOptions){

            $scope.serverurl=SERVER_URL;
            $scope.username = localStorageService.get("username");


            $scope.statuses = [
                {value: "男", text: '男'},
                {value: "女", text: '女'}
            ];

            $scope.users=[];
            $scope.times=[];
            $scope.times.push(null);
            $scope.index=0;
            $scope.usersinfo=function (offset) {
                $http.post(SERVER_URL + "/admin/getUserList",{"offset":offset,"limit":10} )
                    .then(function (response) {
                        $scope.users = response.data;
                    }).catch(function (error) {
                    toastr.error(error.data.err);
                });
            };
            //分页
            $scope.usersinfo(null);

            $scope.loadMore=function () {
                if($scope.users.length==10){
                    $scope.usersinfo($scope.users[$scope.users.length-1].updated_at);
                    $scope.times.push($scope.users[$scope.users.length-1].updated_at);
                    $scope.index = $scope.index+1;

                }
            };
             $scope.first= function(){
                 $scope.index=0;
                 $scope.usersinfo($scope.times[$scope.index]);
             }
             $scope.backTo= function(){
                 if($scope.times.length>0&&$scope.index!=0){
                     $scope.usersinfo($scope.times[$scope.index-1]);
                     $scope.index=$scope.index-1;

                 }else if($scope.index==0){
                     toastr.info("已是第一页");
                 }

             }

            //用户增加
            $scope.addUser = function() {
                $scope.inserted = {
                    index: $scope.users.length+1,
                    user_id:undefined,
                    username:null,
                    gender: null,
                    realname: null,
                    sign:null,
                    user_img:$scope.users.user_img,
                    deleted_at:null
                };
                $scope.users.push($scope.inserted);
            };

            /* $scope.addTopic=function () {
                 $http.post(SERVER_URL + "/forum/createForum" )
                     .then(function (response) {
                         toastr.info("添加成功");
                         $scope.topicsinfo();
                     })
                     .catch(function (error) {
                         toastr.error(error.data.err);
                     });
             };
*/
            $scope.usersinfo();
            $scope.saveusers=function (data,user) {
                data.user_id=user.user_id;
                data.user_img=  $scope.users.user_img;
                if(data.user_id) {
                    var ret = $http.post(SERVER_URL + "/admin/updateUser", data)
                        .then(function (response) {
                            toastr.info("保存成功");
                            $scope.usersinfo($scope.times[$scope.index]);
                        })
                        .catch(function (error) {
                            toastr.error(error.data.err);
                        });
                    return ret;
                }
                else{

                    var ret=  $http.post(SERVER_URL + "/admin/addUser", data)
                        .then(function (response) {
                            data.user_id = response.data.user_id;
                            console.log(response.data.user_id);
                            toastr.info("添加成功");
                            $scope.usersinfo(null);
                        })
                        .catch(function (error) {
                            toastr.error(error.data.err);
                        });
                    return ret;
                }

            };


            //用户删除
            $scope.removeUsers=function(index) {

                if ( $scope.users[index]["user_id"] === undefined) {
                    $scope.users.splice(index,1);
                    toastr.info("删除成功");

                } else {
                    $http.post(SERVER_URL + "/admin/deleteUser", {"user_id": $scope.users[index]["user_id"]}).then(function (response) {
                        $scope.users.splice(index,1);
                        toastr.info("删除成功");
                        $scope.usersinfo($scope.times[$scope.index]);

                    }).catch(function (error) {
                        if (error.data) {
                            toastr.error("已删除");
                        } else {
                            toastr.error("连接服务器失败!");
                        }
                    });
                }

            };



            $scope.searchuser=function (search) {
                if(search) {
                    $scope.index=0;
                    $http.post(SERVER_URL + "/searchForUser", {"exp": search})
                        .then(function (response) {
                            $scope.users = response.data;
                        })
                        .catch(function (error) {
                            toastr.error(error.data.err);
                        });
                }else{
                    $scope.usersinfo($scope.times[$scope.index]);
                }

            };




            $scope.postImg = function($index){

                var reader= new FileReader();

                var file =document.getElementById("inp"+$index).files[0];//获得input选择的图片文件



                reader.addEventListener("load", function(e) {

                    document.getElementById("img"+$index).src  = e.target.result;
                    $scope.users.user_img = e.target.result;



                });

                reader.readAsDataURL(file);// base64 编码

            }

        }]);