(function () {
    'use strict';

    albumapp.controller('albumController',
        ['$scope', 'Image', 'popupService', '$exceptionHandler', '$http', 'AuthenticationService',
        function ($scope, Image, popupService, $exceptionHandler, $http, AuthenticationService) {


            $scope.images = [];
            $scope.imageLarg = '';
            $scope.angle = 0;
            $scope.message = '';

            $scope.options = [
                {
                    degree: 0,
                    description: '--- Select Rotation if y0ou need to ---'
                },
                {
                    degree: 90,
                    description: 'rotate by 90  degrees'
                },
                {
                    degree: 180,
                    description: 'rotate by 180  degrees'
                },
                {
                    degree: 270,
                    description: 'rotate by 270  degrees'
                },
                {
                    degree: 360,
                    description: 'rotate by 360  degrees'
                }
            ];
            $scope.selectedOption = $scope.options[0];

            $scope.init = function () {
                var promise = Image.query();
                promise.$promise.then(function (payload) {
                    $scope.images = payload;
                    //$scope.mainImageUrl = payload[0].ImageLarge;
                    $scope.setImage(1429); // default imageId=1429 for Large Image
                },
                function (error) {
                    $exceptionHandler(error.data.message, error.status + ' - ' + error.statusText);
                });
            };

            $scope.setImage = function (imageId) {
                var promise = Image.get({ id: imageId });
                promise.$promise.then(function (payload) {
                    $scope.imageLarge = payload.ImageLarge;
                },
                function (error) {
                    $exceptionHandler(error.data.message, error.status + ' - ' + error.statusText);
                })
            };

            // Add photo
            $scope.addImage = function (input) {
                $scope.message = '';
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $('#photo-id').attr('src', e.target.result);
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            };


            $scope.saveImage = function () {
                $scope.message = '';
                var canvas = document.createElement("canvas");
                var imageElement = document.getElementById("photo-id");

                // Convert to small image                  
                var newWidth = 30;
                var newHeight = newWidth / imageElement.width * imageElement.height;
                var context = canvas.getContext("2d");
                if ($scope.angle == 180) {

                    newHeight = newWidth / imageElement.width * imageElement.height;
                    var cx = newWidth;
                    var cy = newHeight;

                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    context = canvas.getContext("2d");
                    context.translate(cx, cy);
                    context.rotate(parseInt($scope.angle) * Math.PI / 180);
                    context.drawImage(imageElement, 0, 0, newWidth, newHeight);
                }
                else if ($scope.angle != 0) {
                    var cx = newHeight;
                    var cy = 0;

                    // since it turns 90 degree, width becomes height and height becomes width
                    canvas.width = newHeight;  //newWidth;
                    canvas.height = newWidth;  //newHeight;
                    context = canvas.getContext("2d");
                    context.translate(cx, cy);
                    context.rotate(parseInt($scope.angle) * Math.PI / 180);
                    context.drawImage(imageElement, 0, 0, newWidth, newHeight);
                }
                else {
                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    context = canvas.getContext("2d");
                    context.drawImage(imageElement, 0, 0, newWidth, newHeight);
                    context.drawImage(imageElement, 0, 0, newWidth, newHeight);
                }
                var base64Image = canvas.toDataURL("image/jpeg");
                var ImageSmall = base64Image.replace(/data:image\/jpeg;base64,/g, '');

                // Convert to large image
                newWidth = 550;
                newHeight = newWidth / imageElement.width * imageElement.height;
                //if ($scope.angle != 0) {
                //    var cx = newHeight;
                //    var cy = 0;

                //    // since it turns 90 degree, width becomes hight and hight becomes width
                //    canvas.width = newHeight;  //newWidth;
                //    canvas.height = newWidth;  //newHeight;
                //    context = canvas.getContext("2d");
                //    context.translate(cx, cy);
                //    context.rotate(parseInt($scope.angle) * Math.PI / 180);
                //    context.drawImage(imageElement, 0, 0, canvas.height, canvas.width);
                //}
                if ($scope.angle == 180) {

                    newHeight = newWidth / imageElement.width * imageElement.height;
                    var cx = newWidth;
                    var cy = newHeight;

                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    context = canvas.getContext("2d");
                    context.translate(cx, cy);
                    context.rotate(parseInt($scope.angle) * Math.PI / 180);
                    context.drawImage(imageElement, 0, 0, newWidth, newHeight);
                }
                else if ($scope.angle != 0) {
                    if (imageElement.width - imageElement.height > 1) {
                        newWidth = 733;
                    }
                    else {
                        newWidth = 550;
                    }

                    newHeight = newWidth / imageElement.width * imageElement.height;
                    var cx = newHeight;
                    var cy = 0;

                    // since it turns 90 degree, width becomes height and height becomes width
                    canvas.width = newHeight;  //newWidth;
                    canvas.height = newWidth;  //newHeight;
                    context = canvas.getContext("2d");
                    context.translate(cx, cy);
                    context.rotate(parseInt($scope.angle) * Math.PI / 180);
                    context.drawImage(imageElement, 0, 0, canvas.height, canvas.width);
                }
                else {
                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    context = canvas.getContext("2d");
                    context.drawImage(imageElement, 0, 0, newWidth, newHeight);
                }

                base64Image = canvas.toDataURL("image/jpeg");
                var ImageLarge = base64Image.replace(/data:image\/jpeg;base64,/g, '');

                // Call web api POST
                var promise = Image.save({ 'ImageSmall': ImageSmall, 'ImageLarge': ImageLarge });
                promise.$promise.then(function () {
                    $scope.message = "Add photo succeeded! You may continue to add another photo or go to Album to see the changes.";
                },
                function (error) {
                    $exceptionHandler(error.data.message, error.status + ' - ' + error.statusText);
                })

            };

            $scope.deleteImage = function (image) {
                if (popupService.showPopup('Are you sure to delete this photo?')) {
                    //AuthenticationService.setHeader($http);

                    //$http(
                    //    {
                    //        method: 'DELETE',
                    //        url: 'http://restfulws.lottotry.com/api/Images?id=:id',
                    //        data: image.ImageId,
                    //        //headers: $http.defaults.headers
                    //    }).then(function (response) {
                    //        var index = $scope.images.indexOf(image);
                    //        $scope.images.splice(index, 1);
                    //    },
                    //    function (response) {
                    //        $exceptionHandler(response, response);
                    //    });

                    //AuthenticationService.setHeader($http);
                    //var head = {'Content-Type':'text/plain; charset=UTF-8',
                    //    'Access-Control-Allow-Origin': 'http://localhost:57412/',
                    //    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE'};
                    //var url = 'http://restfulws.lottotry.com/api/Images';
                    //$http.delete(url + '?id=' + image.ImageId, { headers: head }).then(
                    //    function (response) {
                    //        var index = $scope.images.indexOf(image);
                    //        $scope.images.splice(index, 1);
                    //    },
                    //    function (response) {
                    //        $exceptionHandler(response, response);
                    //    });

                    var promise = Image.remove({ id: image.ImageId });
                    promise.$promise.then(function () {
                        var index = $scope.images.indexOf(image);
                        $scope.images.splice(index, 1);
                    },
                    function (error) {
                        $exceptionHandler(error.data, error.data);
                    });
                }
            };
        }]);


    // Code exmples
    function encodeImageFileAsURL() {

        var filesSelected = document.getElementById("photo-id").files;
        if (filesSelected.length > 0) {
            var fileToLoad = filesSelected[0];

            var fileReader = new FileReader();

            fileReader.onload = function (fileLoadedEvent) {
                var srcData = fileLoadedEvent.target.result; // <--- data: base64

                var newImage = document.createElement('img');
                newImage.src = srcData;

                document.getElementById("imgTest").innerHTML = newImage.outerHTML;
                alert("Converted Base64 version is " + document.getElementById("imgTest").innerHTML);
                console.log("Converted Base64 version is " + document.getElementById("imgTest").innerHTML);
            }
            fileReader.readAsDataURL(fileToLoad);
        }
    }


    /**
     * Convert an image 
     * to a base64 url
     * @param  {String}   url         
     * @param  {Function} callback    
     * @param  {String}   [outputFormat=image/png]           
     */
    function convertImgToBase64URL(url, callback, outputFormat) {
        var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            var dataURL;
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
            canvas = null;
        };
        img.src = url;
    }

    // Usage
    convertImgToBase64URL('http://bit.ly/18g0VNp', function (base64Img) {
        // Base64DataURL
    });
})();