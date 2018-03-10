"use strict";


angular.module('forum').controller('commentsController',
    ["$scope", "$uibModalInstance", "items", "toastr","$http","$state","$stateParams",
        function ($scope, $uibModalInstance, items, toastr,$http,$state,$stateParams) {


            $scope.topic={};
            // $scope.comments={};

            $scope.initQuill=function () {

                if(typeof items === "object"){
                    $scope.topic=items;
                    //console.log($scope.topic);
                    // $scope.quill.root.innerHTML=$scope.topic.content;

                }
            };
            $scope.initQuill();

/*
            $scope.shows=[];
            $scope.page=0;

            $scope.beforePage = function(){
                $scope.page = $scope.page -1;
                if($scope.page<0){
                    $scope.page = 0;
                }

                for (var i=0;i<($scope.comments.length>8 ? 8 : $scope.comments.length);i++){
                    $scope.shows[i]=$scope.comments[$scope.page*8+i];
                }
                console.log($scope.shows);

            };
            $scope.afterPage = function(){
                $scope.page = $scope.page+1;
                if($scope.page >= $scope.comments.length/8)
                {
                    $scope.page = $scope.page-1;
                }
                else {
                    var  i=0;
                    var s= $scope.comments.length-$scope.page*8;
                    if (s<8 && s>0){

                        while (s>0)
                        {

                          $scope.shows[i] = $scope.comments[$scope.page*8+i];
                          i++;
                          s--;

                    }
                        var j=8-i;
                        while (j>0){
                            $scope.shows[j]=null;
                         j--;
                        }

                    }
                    else {
                        for (var i=0;i<($scope.comments.length> 8 ? 8 : $scope.comments.length);i++){
                            $scope.shows[i]=$scope.comments[$scope.page*8+i];
                        }
                    }

                }

                console.log($scope.shows);


            }

*/


            $scope.getComments=function () {
                $http.post(SERVER_URL + "/admin/getCommentByForumId", {"f_id": $scope.topic.f_id})
                    .then(function (response) {

                       //$scope.topic = response.data;
                        $scope.comments = response.data;

                        /*$scope.shows=[];

                        for (var i=0;i<($scope.comments.length> 8 ? 8 : $scope.comments.length);i++){
                            $scope.shows[i]=$scope.comments[i];
                        }
                   */
                    })
                    .catch(function (error) {
                        toastr.error(error.data.err);
                    });
            };

            $scope.addComment = function() {
                $scope.inserted = {
                    "index": $scope.comments.length+1,
                    "c_id": undefined,
                    "username": "admin",
                    "comment": '',
                    "deleted_at":null
                };
                $scope.comments.push($scope.inserted);
            };

            $scope.getComments();


            $scope.saveComment=function (data,content) {
                data.c_id=content.c_id;
                data.f_id=$scope.topic.f_id;
                data.content=data.comment;
                // data.f_id=comment.f_id;
                window.console.log(data);
                if(data.c_id) {
                     $http.post(SERVER_URL + "/admin/updateComment", data)
                        .then(function (response) {
                           // console.log(comment);
                            toastr.info("保存成功");
                            //console.log(data.f_id);

                        })
                        .catch(function (error) {
                            toastr.error(error.data.err);
                        });
                }
                else{



                     $http.post(SERVER_URL + "/comment/createComment", data)
                        .then(function (response) {
                            //console.log(response.data.c_id);
                            data.c_id = response.data.c_id;

                            toastr.info("添加成功");
                        })
                        .catch(function (error) {
                            // console.log(data);
                            toastr.error(error.data.err);
                        });

                }

            };



            $scope.deleteComment=function(index) {
                if ($scope.comments[index]["c_id"] === undefined) {
                    $scope.comments.splice(index, 1);
                    toastr.info("删除成功");
                } else {
                    $http.post(SERVER_URL + "/admin/deleteComment", {"c_id": $scope.comments[index]["c_id"]}).then(function (response) {
                        toastr.info("删除成功");
                        $scope.getComments($scope.index);
                    }).catch(function (error) {
                        if (error.data) {
                            toastr.error("已删除");
                        } else {
                            toastr.error("连接服务器失败!");
                        }
                    });
                }

            };


            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

           $scope.searchcomment=function(searchss){



           };



        }]);