"use strict";

angular.module("forum").controller('forumsController',
    ["$scope", "$stateParams","$http", "toastr", "localStorageService", "$uibModal","$state","$filter" ,"editableOptions",
        function ($scope, $stateParams,$http, toastr, localStorageService, $uibModal, $state, $filter ,editableOptions){

            $scope.serverurl=SERVER_URL;

            $scope.statuses = [
                {value: "技术分享", text: '技术分享'},
                {value: "问题求助", text: '问题求助'},
                {value: "灌水闲聊", text: '灌水闲聊'}
            ];

            $scope.username = localStorageService.get("username");



            /*显示列表*/
            $scope.topics=[];
            //$scope.tmpTopics=[];
            $scope.topicsinfo=function (offset) {
                $http.post(SERVER_URL + "/admin/getForumList",{"offset":offset} )
                    .then(function (response) {
                        $scope.topics=response.data;
                        //Array.prototype.push.apply($scope.topics,$scope.tmpTopics);
                    })
                    .catch(function (error) {
                        if (error.data) {
                            toastr.error(error.data.err);
                        } else {
                            toastr.error("连接服务器失败!");
                        }
                    });
            };
            $scope.topicsinfo(null);


            $scope.saveoffset=[];
            $scope.index=0;
            $scope.saveoffset[$scope.index]=null;
            $scope.loadMore=function () {
                if($scope.topics.length==10){
                    $scope.topicsinfo($scope.topics[$scope.topics.length-1].updated_at);
                    $scope.index=$scope.index+1;
                    $scope.saveoffset.push($scope.topics[$scope.topics.length-1].updated_at);
                }
                else {
                    toastr.info("已没有更多");
                }
            };

            /*首页*/
            $scope.firstPage=function(){
                $scope.index=0;
                $scope.topicsinfo($scope.index);
            };

            /*上一页*/
            $scope.backTo=function(){
                if($scope.saveoffset.length>1 && $scope.index!=0){
                    $scope.topicsinfo($scope.saveoffset[$scope.index-1]);
                    $scope.index=$scope.index-1;
                }
                else if($scope.index==0){
                    toastr.info("已是第一页");
                }

            };




            /*添加*/
            $scope.addTopic = function() {
                $scope.inserted = {
                    "index": $scope.topics.length+1,
                    "f_id":undefined,
                    "title": "",
                    "username": $scope.username,
                    "content": null,
                    "category":null,
                    "comment":0,
                    "deleted_at":null
                };
                $scope.topics.push($scope.inserted);
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
             };*/

            /*修改*/
            $scope.saveTopics=function (data,topic) {
                data.f_id=topic.f_id;
                //angular.extend(data, {f_id: topic.f_id});
                if(data.f_id) {
                    var ret = $http.post(SERVER_URL + "/admin/updateForum", data);
                        ret.then(function (response) {
                            toastr.info("保存成功");
                        }).catch(function (error) {
                                if (error.data) {
                                    toastr.error(error.data.err);
                                } else {
                                    toastr.error("连接服务器失败!");
                                }
                            });
                    return ret;
                }
                else{
                    var ret=  $http.post(SERVER_URL + "/forum/createForum", data);
                        ret.then(function (response) {
                            console.log(response.data.f_id);
                            topic.f_id = response.data.f_id;
                            toastr.info("添加成功");
                            //$scope.topicsinfo();
                            $scope.topicsinfo(null)
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

            /*帖子编辑框*/
            $scope.openTopicEditor=function (topic) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/forums/topicEditor.template.html',
                    controller: 'topicEditorController',
                    size: "xm",
                    resolve: {
                        items: function () {
                            return topic;
                        }
                    }
                });
            };



            /*评论编辑框*/
            $scope.openCommentEditor=function (topic) {
               // console.log(topic);
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/forums/comments.template.html',
                    controller: 'commentsController',
                    size: "xm",
                    resolve: {
                        items: function () {
                            return topic;
                        }
                    }
                })};


            /*删除*/
            $scope.removeTopics=function(index) {
                if ($scope.topics[index]["f_id"] === undefined) {
                    $scope.topics.splice(index, 1);
                    toastr.info("删除成功");
                    //$scope.topicsinfo();
                } else {
                    $http.post(SERVER_URL + "/admin/deleteForum", {"f_id": $scope.topics[index]["f_id"]}).then(function (response) {
                       // $scope.topics.splice(index, 1);
                        toastr.info("删除成功");
                        $scope.topicsinfo($scope.index);
                    }).catch(function (error) {
                        if (error.data) {
                            toastr.error("已删除");
                        } else {
                            toastr.error("连接服务器失败!");
                        }
                    });
                }

            };

            /*搜索*/
            $scope.searchtopic=function (searchss) {
                if(searchss) {
                    $scope.index=0;
                    $http.post(SERVER_URL + "/searchForForum", {"exp": searchss})
                        .then(function (response) {
                            $scope.topics = response.data;
                        })
                        .catch(function (error) {
                            toastr.error(error.data.err);
                        });
                }else{
                    $scope.topicsinfo($scope.index);
                }

            };
        }]);