"use strict";


angular.module('forum').controller('shareEditorController',
    ["$scope", "$uibModalInstance", "items", "toastr","$http","$state","Upload",
        function ($scope, $uibModalInstance, items, toastr,$http,$state,Upload) {

            $scope.status={
                "edit":false
            };
            $scope.file={};




            if(typeof items === "object"){
                $scope.status.edit=true;
                $scope.file=items;

            }



            $scope.upload = function () {
                if($scope.file.file!==undefined){
                    console.log($scope.file.file);
                    Upload.upload({
                        url: SERVER_URL+'/file/upload',
                        data: $scope.file
                    }).then(function (resp) {
                        toastr.info("上传成功");
                        $uibModalInstance.close("add");
                        //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                    }, function (resp) {
                        //console.log('Error status: ' + resp.status);
                    }, function (evt) {
                        //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    });
                }





            };

            $scope.submitFile=function(){

                if($scope.status.edit===false){
                    $scope.upload();
                }else
                {
                    $http.post(SERVER_URL+"/file/updateFile",$scope.file)
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

            $scope.deleteFile=function(){
                $http.post(SERVER_URL+"/file/deleteFile",$scope.file)
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