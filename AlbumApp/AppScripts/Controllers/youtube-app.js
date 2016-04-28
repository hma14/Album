var youtubeApp = angular.module('YouTubeApp', []);
var player;

youtubeApp.constant('YT_event', {
    STOP: 0,
    PLAY: 1,
    PAUSE: 2,
    STATUS_CHANGE: 3
});


youtubeApp.controller('YouTubeCtrl', function ($scope, YT_event) {
    //initial settings
    $scope.yt = {
        width: 900,
        height: 550,
        //videoid: "uA_gwSkKTxU",
        loadPlaylist: {
            listType: 'playlist',
            list: ['qbIPs7sGt7c', '-r8l4oTE1a4', 'DqyJfSU_4bA', 'VPrgyZqhNFI', 'CN4cETBfEoA', '6smlSmzX9LM', 'SD13q2f8HEA', 'uA_gwSkKTxU',
                   'XWgrtPVf2AA', '6kGMqGqge7A', 'osfci82hFEI', '-1dF3eJP7Rg', 'CvILgE8-EYU', 'MDgcpQFp8Pg'],
            index: parseInt(0),
            suggestedQuality: 'large'
            //playerStatus: "NOT PLAYING"
        },
    };

    $scope.YT_event = YT_event;

    $scope.sendControlEvent = function (ctrlEvent) {
        this.$broadcast(ctrlEvent);
    }

    $scope.$on(YT_event.STATUS_CHANGE, function (event, data) {
        $scope.yt.playerStatus = data;
    });

});



function onPlayerReady(event) {
    event.target.loadPlaylist(['qbIPs7sGt7c', '-r8l4oTE1a4', 'DqyJfSU_4bA', 'VPrgyZqhNFI', 'CN4cETBfEoA', '6smlSmzX9LM', 'SD13q2f8HEA',
                               'uA_gwSkKTxU', 'XWgrtPVf2AA', '6kGMqGqge7A', 'osfci82hFEI', '-1dF3eJP7Rg', 'CvILgE8-EYU', 'MDgcpQFp8Pg']);
};



youtubeApp.directive('youtube', function ($window, YT_event) {
    return {
        restrict: "E",

        scope: {
            height: "@",
            width: "@",
            videoid: "@"
        },

        template: '<div></div>',

        link: function (scope, element, attrs, $rootScope) {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            

            $window.onYouTubeIframeAPIReady = function () {

                player = new YT.Player(element.children()[0], {
                    playerVars: {
                        autoplay: 0,
                        html5: 1,
                        theme: "light",
                        modesbranding: 0,
                        color: "white",
                        iv_load_policy: 3,
                        showinfo: 1,
                        controls: 1
                    },

                    height: scope.height,
                    width: scope.width,
                    videoId: scope.videoid,

                    events: {
                        'onReady': function (event) {
                            onPlayerReady(event)
                        },
                        'onStateChange': function (event) {

                            var message = {
                                event: YT_event.STATUS_CHANGE,
                                data: ""
                            };

                            switch (event.data) {
                                case YT.PlayerState.PLAYING:
                                    message.data = "PLAYING";
                                    break;
                                case YT.PlayerState.ENDED:
                                    message.data = "ENDED";
                                    break;
                                case YT.PlayerState.UNSTARTED:
                                    message.data = "NOT PLAYING";
                                    break;
                                case YT.PlayerState.PAUSED:
                                    message.data = "PAUSED";
                                    break;
                            }

                            scope.$apply(function () {
                                scope.$emit(message.event, message.data);
                            });
                        }
                    }
                });
            };

            scope.$watch('height + width', function (newValue, oldValue) {
                if (newValue == oldValue) {
                    return;
                }

                player.setSize(scope.width, scope.height);

            });

            scope.$watch('videoid', function (newValue, oldValue) {
                //if (newValue == oldValue) {
                //    return;
                //}

                player.cueVideoById(scope.videoid);
                //player.lo(scope.videoid, 5, 60, large);

            });

            scope.$on(YT_event.STOP, function () {
                player.seekTo(0);
                player.stopVideo();
            });

            scope.$on(YT_event.PLAY, function () {
                player.playVideo();
            });

            scope.$on(YT_event.PAUSE, function () {
                player.pauseVideo();
            });

        }
    };
});

