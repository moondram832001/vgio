var tt = angular.module('vgio-demo', []);
 tt.factory("resourceCache",["$cacheFactory",
    function($cacheFactory) { 
      return $cacheFactory("myData"); 
    }
  ]);

angular.module('vgio-demo').controller('AccordionDemoCtrl', function ($scope,$rootScope,$interval) {
  $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];
  
  $rootScope.active_panel = "";
  $rootScope.scope_array = [];
  $scope.stack4 = 0;


  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

   $scope.callAtInterval = function() {
          
           console.log($scope.stack4 + " " +  $rootScope.scope_array[$scope.stack4].indexer);  
           var fff = $rootScope.scope_array[$scope.stack4].linker;
           fff.click();
           $scope.stack4 = $scope.stack4 + 1;
           if($scope.stack4 > 3) {
            $scope.stack4 = 0;
           }    
     

   }
   
  $rootScope.player = new Howl({
  urls: ['tracks/audio.mp3'],
  loop: false,
  sprite: {
    intro: [100000, 3000],
    ax: [20000, 3000],
    cruz: [50000, 3000],
    fag: [150000, 3000]
  },
//  onend: function() {}
  });

  $rootScope.sprite_object = {};




});

tt.directive('vgio', function ($rootScope,$timeout,$http,resourceCache) {
  return {
    templateUrl: 'vg_partial.html',
    replace: true,
    transclude: true,
    restrict: 'E',
    controller: function($scope, $element, $attrs, $transclude) {

    },
    link: function postLink(scope, iElement, iAttrs,controllers) {
        
        scope.$watch(function() { return scope.vgio_player}, function(value) {
            console.log($rootScope.sprite_object);
       });
    }
  };
});


tt.directive('vgioH1', function ($rootScope,resourceCache,$interval) {
  return {
    restrict: 'E',
    transclude: true,
    replace:true,
    scope: {},
    require: ['^vgio','^vgio-root'],
    controller: function($scope, $element, $attrs, $transclude,$interval) {  
    console.log("control value" + $scope.control_value);
    $scope.vg_data_ready = false;
    $scope.sound_id  = "";
    $scope.clicked_panel = "";
    $scope.active_panel = "false";
    
    $scope.buttonDisabled = false;

    $scope.indexer = angular.element($element).index();
    $scope.linker = angular.element($element).find('#link'+$scope.indexer);
    $scope.howl_player = new Howl({
      urls: ['tracks/audio.mp3'],
      loop: false
    });

    $scope.playit = function() {
          $scope.howl_player.play("sprite");
    }
   
    $scope.setHeight = {  };

    var iScope = angular.element($element).isolateScope();
    $rootScope.scope_array[$scope.indexer] = iScope;

    $rootScope.sprite_object[$scope.indexer] = [ parseInt($attrs.from) , parseInt($attrs.duration) ] ;

    var panel_height = angular.element($element).outerHeight();
    console.log("panel_height" + panel_height);
    panel_height = panel_height.toString() + "px";

    $scope.howl_player.sprite({ "sprite" : [ parseInt($attrs.from) , parseInt($attrs.duration) ] });
 
          $scope.clicker = function() {
                 $rootScope.active_panel = $scope.indexer;
          };
    },
    template: function(tElement, tAttrs) { 
              var indexer = angular.element(tElement).index();    
              var active_class = (tAttrs.active == "true") ? "in" : "";
              var template_str = '<div class="panel panel-default panel-custom">' +
                                    '<div class="panel-heading">' + 
                                      '<h4 class="panel-title">' + 
                                          '<button id="link'+ indexer +'" data-toggle="collapse" ng-disabled="buttonDisabled" data-parent="#accordion" "  href="#collapse'+ indexer +'">'+ tAttrs.heading +'</button>' + 
                                       '</h4>' + 
                                    '</div>' +
                                    '<div id="collapse'+ indexer +'" class="panel-collapse collapse "  >' +
                                        '<div id="panel-body'+ indexer +'" class="panel-body panel-body-custom" ng-transclude></div>' + 
                                    '</div>' + 
                                  '</div>'  
              return template_str;
    },
    link: function (scope, iElm, iAttrs, controllers) {
      
      if(iAttrs.active == "true") {
          scope.active_panel = iAttrs.active;  
      }
      
       scope.$watch(function() { return controllers[1].checkDataReady();}, function(value) {
              console.log("DATA READY!! "  + value);
              scope.vg_data_ready = value;

              var ff = controllers[1].getHeight();

              var panel_height = angular.element(iElm).outerHeight();

              panel_height = panel_height.toString() + "px";
              angular.element(iElm).find('#panel-body'+scope.indexer).css("height", "calc("+ff+" - ("+ panel_height+" * 5))"); 

              if(scope.active_panel == "true" && scope.vg_data_ready) {
                  scope.linker.click();
              }

              controllers[1].setTransitionState(true);

       });      

        scope.countery = 25;
        scope.vg_funk_control;
        scope.play_pause_flag = true;
        scope.frames_per_second = 20;
        scope.frame_interval = 50;
        scope.startframe = parseInt(iAttrs.from)/1000 * scope.frames_per_second;
        scope.play_duration = parseInt(parseInt(iAttrs.duration)/scope.frame_interval);
        scope.is_shown = false;

        scope.vg_pause= function() {
          
          if(scope.play_pause_flag) {
              $interval.cancel(scope.vg_funk_control);  
              scope.play_pause_flag = false;
              console.log("pausing!!! with " + scope.countery);
              console.log("pausing!!! with " + scope.countery);
          } else {
              scope.vg_funk_control = $interval(function(){scope.vg_funk(scope.startframe + scope.play_duration,scope.startframe);},scope.frame_interval,scope.play_duration);
              scope.play_pause_flag = true;
              console.log("playing!!! with " + scope.countery);
              console.log("plagin!!! with " + scope.countery);
          }

        }

        scope.vg_funk = function(arg1,arg2){
        
              scope.countery = scope.countery + 1   
              if(scope.countery > arg1)
              {
                scope.countery = arg2; 
              }
              controllers[1].setData(resourceCache.get("myData")[(scope.countery).toString()]);
        };

        

        scope.vg_play = function() {
             
             controllers[1].setTransitionState(false);  
              scope.howl_player.stop("sprite").play("sprite");
              scope.countery = scope.startframe;

              scope.vg_funk_control = $interval(function(){scope.vg_funk(scope.startframe + scope.play_duration,scope.startframe);},scope.frame_interval,scope.play_duration);

        };

        angular.element(iElm).find('#collapse'+scope.indexer).on('show.bs.collapse', function () {
          scope.is_shown = true;      
          
          scope.buttonDisabled = true;

          if(scope.active_panel == "false") {
            scope.vg_play();
          }else {
            scope.countery = scope.startframe;
            controllers[1].setData(resourceCache.get("myData")[(scope.countery).toString()]);
            scope.active_panel = "false";
          }

        });

        angular.element(iElm).find('#collapse'+scope.indexer).on('hide.bs.collapse', function () {
            scope.is_shown = false;
            scope.buttonDisabled = false;
            scope.howl_player.stop();    
            $interval.cancel(scope.vg_funk_control);
        });

    }

  };
});

