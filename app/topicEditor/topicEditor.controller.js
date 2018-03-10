"use strict";


angular.module('forum').controller('topicEditorController',
    ["$scope", "$uibModalInstance", "items", "toastr","$http","$state",
        function ($scope, $uibModalInstance, items, toastr,$http,$state) {

            $scope.status={
                "edit":false
            };
            $scope.topic={};






            $scope.initQuill=function () {
                $scope.quill = new Quill('#topicEditor-editor', {
                    modules: {
                        toolbar: {
                            container: '#topicEditor-toolbar'
                        }
                    },
                    theme:"snow"
                });

                if(typeof items === "object"){
                    $scope.status.edit=true;
                    $scope.topic=items;
                    $scope.quill.root.innerHTML=$scope.topic.content;
                }
            };



            $scope.submitTopic=function(){


                $scope.topic.content=$scope.quill.root.innerHTML;

                if($scope.status.edit===false){
                    $http.post(SERVER_URL+"/forum/createForum",$scope.topic)
                        .then(function(response){
                            toastr.info("发表成功");
                            $uibModalInstance.close("add");
                            $state.go("detail",{"id":response.data.f_id});
                        })
                        .catch(function(error){
                            toastr.error(error.data.err);
                        });
                }else
                {
                    $http.post(SERVER_URL+"/forum/updateForum",$scope.topic)
                        .then(function(response){
                            toastr.info("修改成功");
                            $uibModalInstance.close("modify");
                            //$state.go("detail",{"id":$scope.topic.f_id});
                        })
                        .catch(function(error){
                            toastr.error(error.data.err);
                        });
                }




            };

            $scope.deleteTopic=function(){

                $scope.topic.content=$scope.quill.root.innerHTML;
                $http.post(SERVER_URL+"/forum/deleteForum",$scope.topic)
                    .then(function(response){
                        toastr.info("删除成功");
                        $uibModalInstance.close("delete");
                        //$state.go("detail",{"id":response.data.f_id});
                    })
                    .catch(function(error){
                        toastr.error(error.data.err);
                    });


            };



            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);