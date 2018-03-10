"use strict";


angular.module('forum').controller('topicEditorController',
    ["$scope", "$uibModalInstance", "items", "toastr","$http","$state",
        function ($scope, $uibModalInstance, items, toastr,$http,$state) {

            $scope.status = {
                "edit": false
            };
            $scope.topic = {};


            $scope.initQuill = function () {
                $scope.quill = new Quill('#topicEditor-editor', {
                    modules: {
                        toolbar: {
                            container: '#topicEditor-toolbar'
                        }
                    },
                    theme: "snow"
                });

                if (typeof items === "object") {
                    $scope.status.edit = true;
                    $scope.topic = items;
                    $scope.quill.root.innerHTML = $scope.topic.content;
                }
            };


            $scope.submitTopic = function () {


                $scope.topic.content = $scope.quill.root.innerHTML;
                if ($scope.topic.f_id) {
                   var ret= $http.post(SERVER_URL + "/admin/updateForum", $scope.topic)
                        .then(function (response) {
                            toastr.info("修改成功");
                            $uibModalInstance.close("modify");
                            //$state.go("detail",{"id":$scope.topic.f_id});
                        })
                        .catch(function (error) {
                            toastr.error(error.data.err);
                        });
                   return ret;
                }
                else{
                    var ret=  $http.post(SERVER_URL + "/forum/createForum",$scope.topic)
                        .then(function (response) {
                            //console.log(response.data.f_id);
                            $scope.topic.f_id = response.data.f_id;
                            $uibModalInstance.close("modify");
                           // toastr.info("添加成功");
                        })
                        .catch(function (error) {
                            toastr.error(error.data.err);
                        });
                    return ret;
                }

            };


            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);