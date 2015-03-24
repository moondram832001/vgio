tt.directive('svgscreen', function (resourceCache) {
    

    var controller_func = function($scope, $element,$interval,$http,resourceCache,$window) {
    
    
      $scope.svg = Snap($element[0]);
      $scope.svg_root = $scope.svg.select('svg');;
    
      $scope.ggf = $scope.svg.select("g");
    
      $scope.toggle = false;
      $scope.color = "green";

      $scope.viewbox = "0 0 1024.000000 476.000000"
      $scope.transform = "translate(0.000000,476.000000) scale(0.700000,-0.700000)"

      $scope.style = "fill:rgb(0,102,255);stroke-width:3;stroke:rgb(0,0,0)";
      $scope.countery = 10;
      $scope.playing = 0;
      $scope.timerfunc = function() {
   
        $scope.countery = $scope.countery + 1   
        if($scope.countery > 399)
        {
          $scope.countery = 10; 
        }
   
        $scope.pather = resourceCache.get("myData")[$scope.countery.toString()];
   
        if($scope.playing == 0 ){
             $scope.playing = 1;
        }
        
      };
      
      $http.get("path_data.json")
      .success(function(response) {
   
         resourceCache.put("myData", response);
         $scope.vg_data_ready = true;
   
      });

   
       var sound = new Howl({
        urls: ['tracks/audio.mp3'],
       // autoplay: true,
        loop: true,
        volume: 1.0,
        sprite: {
          first20: [0, 20000] 
        },
          onend: function() {
            console.log('Finished!');
          }
        });


        
        var w = angular.element($window);
        $scope.getWindowDimensions = function () {
            return {
                'h': w.height(),
                'w': w.width()
            };
        };

   
   
    }

    var directiveDefinitionObject = {
      restrict: 'EA',
      templateNamespace: 'html',
      require: '^vgio-root',
      templateUrl: 'SV.html',
      controller: controller_func,
      compile: function compile(tElement, tAttrs, transclude) {
      
        return function($scope, $element, $attrs, $controller) {
      
        $scope.funky = function() {

        }
        $scope.getElementDimensions = function () {
          return  {'w':$element.width(),'h':$element.height()};
        };

        $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
      
           newValue.w = $element.width();
           newValue.h = $element.height();
       
           $scope.wid = newValue.w + "px";
           $scope.hit = newValue.h + "px";
           $scope.viewbox = "0 0 " +  newValue.w.toString() + " " + newValue.h.toString();
           $scope.transform = "translate(0.000000,"+newValue.h+") scale("+(parseInt(newValue.w)/1540).toString()+",-"+(parseInt(newValue.h)/860).toString()+")" ; 
     
           console.log((parseInt(newValue.w)/1540).toString(),(parseInt(newValue.h)/860).toString());  
           

          }, true);

    
        }
      }
    };
    return directiveDefinitionObject;
  });


