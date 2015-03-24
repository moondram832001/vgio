tt.directive('vgioRoot', function ($rootScope,$timeout,$window) {
	return {

		restrict: 'E',
		scope: true,
		controller: function($scope, $element, $attrs, $transclude) {
			
        $scope.control_value = 10;
        $scope.vgio_player = "stop";  
        $scope.pause_position = 0;
        $scope.timeout_array = [];
        $scope.play_label = "Play";
        $scope.stop_label = "Stop";
        $scope.pather = "";
        $scope.vg_data_ready = false;
        $scope.last_timeout = "";
        $scope.wid = "";
        $scope.hit = "";
        $scope.vgio_style  = { "height" : ($window.innerHeight/2  ) + "px" };
        $scope.player_started = false;
        $scope.transition_control = true;

        var promise;

        this.getState = function() {
              return $scope.pather;
        };

        this.setPlayerState = function(value) {
              $scope.player_started = value;
        };
        
        this.setTransitionState = function(value) {
              $scope.transition_control = value;
        };

        this.checkDataReady = function() {
              return $scope.vg_data_ready;
        };

        this.setData = function(value) {
              $scope.pather = value;
        };

        this.getHeight = function() {
              return $scope.hit;
        }

        $scope.starter = function () {
            $scope.player_started = true;
            console.log("starting....");
            console.log($scope.viewbox);
            if($scope.vgio_player == "stop" ) {
              $scope.play_label = "Pause";
              $scope.current_index = 0;
              $scope.vgio_player = "play";  
              play();
            }
            else if($scope.vgio_player == "play"){
               $scope.play_label = "Play";
               $scope.vgio_player = "pause";      
               $scope.pause_position = $rootScope.scope_array[($scope.current_index - 1).toString()].howl_player.pos();
               console.log($scope.pause_position);
               $rootScope.scope_array[($scope.current_index - 1).toString()].howl_player.pause("sprite");    
               $rootScope.scope_array[($scope.current_index - 1).toString()].vg_pause();    
               $timeout.cancel($scope.last_timeout);
               //play();
            }
            else {
                $scope.vgio_player = "pause_play";   
                $scope.play_label = "Pause";
                console.log("pause play");    
                play();
            }
        };

        $scope.current_index = 0;
        var play = function() {
          
                if($scope.vgio_player == "play") {
                    var current_panel_scope = $rootScope.scope_array[$scope.current_index.toString()];

                    console.log("index " + $scope.current_index);
                    if(current_panel_scope.is_shown)
                    {
                        current_panel_scope.vg_play();
                    } else
                    {
                        current_panel_scope.linker.click();  
                    }
                    
                    $scope.current_index = $scope.current_index + 1 ;
                    if($scope.current_index ==  $rootScope.scope_array.length) {
                      //$scope.stopper();
                      $timeout($scope.stopper,$rootScope.sprite_object[($scope.current_index - 1 ).toString()][1]);  
                      return;
                    }
                   
                    $scope.last_timeout = $timeout(play,$rootScope.sprite_object[($scope.current_index - 1 ).toString()][1]);  
                    $scope.timeout_array.push($scope.last_timeout);
                    //$scope.last_timeout = promise;
               }
               else if($scope.vgio_player == "pause_play") {
                    //$rootScope.scope_array[($scope.current_index - 1).toString()].howl_player.pos($scope.pause_position);

                    $rootScope.scope_array[($scope.current_index - 1).toString()].howl_player.play("sprite");        
                    $scope.vgio_player = "play"
                    $scope.last_timeout = $timeout(play,$rootScope.sprite_object[($scope.current_index - 1 ).toString()][1] - parseInt($scope.pause_position * 1000) ); 
                    $rootScope.scope_array[($scope.current_index - 1).toString()].vg_pause();     
                    $scope.timeout_array.push($scope.last_timeout);
               } 
         };

       $scope.stopper = function () {
                  $scope.vgio_player = "stop";
                  $scope.player_started = false;
                  $scope.transition_control = true;

                  for (var i = $scope.timeout_array.length - 1; i >= 0; i--) {
                      console.log($scope.timeout_array[i]);
                      $timeout.cancel($scope.timeout_array[i]);
                  };
                  $scope.timeout_array = [];
                  $scope.play_label = "Play";
                //  $scope.pather = "";
       };

       $scope.pauser = function () {
            $scope.vgio_player = "pause";
            $rootScope.scope_array[($scope.current_index - 1).toString()].howl_player.pause();
       };

      

		},	
		compile: function compile(tElement, tAttrs, transclude) {
			

			return function postLink(scope, iElement, iAttrs, controller) {

			}
		},
		link: function postLink(scope, iElement, iAttrs) {
		

		}
	};
});