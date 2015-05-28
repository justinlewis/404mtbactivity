
(function(){
	
			var mapObj;
			var layersArr = [];
			
			var app = angular.module("404RouteMap", ["openlayers-directive"]);   
			
			app.controller('GeoJSONController', [ '$scope', '$http', 'olData', function($scope, $http, olData) {
            angular.extend($scope, {
                defaultCenter: {
                    lat: 39.749089,  
                    lon: -104.996966,  
                    zoom: 11
                },
                defaults: {
                    events: {                    
                        layers: [ 'mousemove' ]
                    },
                    interactions: {
                      mouseWheelZoom: true
                    }
                },
                projection: 'EPSG:3857',
                controls: [
                	{ name: 'zoom', active: true }
            	 ],
            	 layers: [
            	 		 {
		                    name: 'osm',
		                    active: true,
		                    "visible": true,
		                    source: {
		                        type: 'OSM',
		                        //url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
		                    }
		                },
		            	 {
		                	name: 'routes',
		                	active: true,
		                	source: {
		                    type: 'GeoJSON',
		                    url: 'data/routes.geojson'
		                	},
		                	style: {
		                    fill: {
		                        color: 'rgba(255, 0, 255, 0.6)'
		                    },
		                    stroke: {
		                        color: 'green',
		                        width: 3
		                    }
		                	}
		            	}
		            
		          ] 
            });
            
            var highlightStyle = new ol.style.Style({
				  stroke: new ol.style.Stroke({
				    color: 'yellow',
				    width: 3
				  })
				});
				
				var defaultStyle = new ol.style.Style({
				  stroke: new ol.style.Stroke({
				    color: 'green',
				    width: 3
				  })
				});
            
            ////
            // Bind the mouse move event to the layer
            ////
            $scope.$on('openlayers.layers.routes.mousemove', function(event, feature) {
                 $scope.$apply(function(scope) {      					
		                if(feature && $scope.routes[feature.getProperties().OBJECTID]) {
		                	//feature.setStyle(highlightStyle);
		                  $scope.mouseMoveRoute = feature?$scope.routes[feature.getProperties().OBJECTID].properties.NAME:'';
		                }           
		            });
         	});
         	
           // Get the routes data and append it to the $scope variable
	        $http.get("data/routes.geojson").success(function(data, status) {
	            // Put the countries on an associative array
	            $scope.routes = {};
	            for (var i=0; i< data.features.length; i++) {
	                var route = data.features[i];
	                $scope.routes[data.features[i].properties.OBJECTID] = route;
	            }
	        });
         	
       	}]);

})();