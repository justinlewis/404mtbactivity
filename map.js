
(function(){
	
			var mapObj;
			var layersArr = [];
			
			var app = angular.module("404RouteMap", ["openlayers-directive"]);   
			
			app.controller('GeoJSONController', [ '$scope', '$http', 'olData', function($scope, $http, olData) {
            angular.extend($scope, {
                defaultCenter: {
                    lat: 39.756797,  
                    lon: -105.222344,  
                    zoom: 11
                },
                nTableMtn: {
                    lat: 39.772997, 
                    lon: -105.196747,
                    onClick: function (event, properties) {
    							OpenInNewTab("https://goo.gl/maps/vhnZs");
  						  },                    
                    label: {
                        message: 'North Table Mountain Meeting Spot',
                        show: false,
                        showOnMouseOver: true
                    }
                },
                apex: {
                    lat: 39.716166,  
                    lon: -105.209572,
                    onClick: function (event, properties) {
    							OpenInNewTab("https://goo.gl/maps/1xV48");
  						  },
                    label: {
                        message: 'Apex Meeting Spot',
                        show: false,
                        showOnMouseOver: true
                    }
                }, 
                mtFalcon: {
                    lat: 39.646849, 
                    lon: -105.196365,                   
                    onClick: function (event, properties) {
    							OpenInNewTab("https://goo.gl/maps/vm3QQ");
  						  },
                    label: {
                        message: 'Mt. Falcon Meeting Spot',
                        show: false,
                        showOnMouseOver: true
                    }
                },  
                greenMt: {
                    lat: 39.696784, 
                    lon: -105.192362,
                    onClick: function (event, properties) {
    							OpenInNewTab("https://goo.gl/maps/SklG3");
  						  },
                    label: {
                        message: 'Green Mountain Meeting Spot',
                        show: false,
                        showOnMouseOver: true
                        //showOnMouseClick: true
                    }
                },         
                defaults: {
                    events: {    
                    		map: ['pointermove'],                
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
		                	label: 'MTB Routes',
		                	active: true,
		                	source: {
		                    type: 'GeoJSON',
		                    url: 'data/routes-merge.geojson'
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
		          ],
                changeLayer: function(layer) {
	              		if(layer.source.type === "OSM" || layer.source.type === "GeoJSON"){
	              			if(layer.active){
	              				layer.active = false;
	              			}
	              			else{
	              				layer.active = true;
	              			}
	              		}
	              		else{
	                  	layer.active = (l === layer);
	                  }
                }
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
				
				function OpenInNewTab(url) {
  					var win = window.open(url, '_blank');
  					win.focus();
				}
				
				
	/*			var highlightStyleCache = {};

				var featureOverlay = new ol.FeatureOverlay({
					//
					// MAPOBJ IS NEVER SET. FIGURE OUT HOW ANGULAR IS HANDLING IT
					//
				  map: mapObj,
				  style: function(feature, resolution) {
				    var text = resolution < 5000 ? feature.get('name') : '';
				    if (!highlightStyleCache[text]) {
				      highlightStyleCache[text] = [new ol.style.Style({
				        stroke: new ol.style.Stroke({
				          color: '#f00',
				          width: 1
				        }),
				        fill: new ol.style.Fill({
				          color: 'rgba(255,0,0,0.1)'
				        }),
				        text: new ol.style.Text({
				          font: '12px Calibri,sans-serif',
				          text: text,
				          fill: new ol.style.Fill({
				            color: '#000'
				          }),
				          stroke: new ol.style.Stroke({
				            color: '#f00',
				            width: 3
				          })
				        })
				      })];
				    }
				    return highlightStyleCache[text];
				  }
				});


				var highlight;
				var displayFeatureInfo = function(pixel) {	
					//
					// MAPOBJ IS NEVER SET. FIGURE OUT HOW ANGULAR IS HANDLING IT
					//			
				  var feature = mapObj.forEachFeatureAtPixel(pixel, function(feature, layer) {
				    return feature;
				  });
				
				  if (feature !== highlight) {
				    if (highlight) {
				      featureOverlay.removeFeature(highlight);
				    }
				    if (feature) {
				      featureOverlay.addFeature(feature);
				    }
				    highlight = feature;
				  }			
				};*/
            
            ////
            // Bind the mouse move event to the layer
            ////
            $scope.$on('openlayers.layers.routes.mousemove', function(event, feature) {
                 $scope.$apply(function(scope) {      					
		                if(feature && $scope.routes[feature.getProperties().id]) {
		                	//feature.setStyle(highlightStyle);
		                	
		                	$("#fixed-hover-window").show();
		                	
		                  $scope.mouseMoveRoute = feature?$scope.routes[feature.getProperties().id].properties.name:'';
		                  if(!$scope.mouseMoveRoute){
		                  	$scope.mouseMoveRoute = 'n/a';
		                  }
		                }          
		            });
         	});
         	
         	////
            // Bind the pointer move event to the map
            ////
            $scope.$on('openlayers.map.pointermove', function(event) {
                 $scope.$apply(function(scope) {      					
       					if (event.dragging) {
							    return;
							}
							$scope.mouseMoveRoute = '';
							$("#fixed-hover-window").hide();
							//
							// MAPOBJ IS NEVER SET. FIGURE OUT HOW ANGULAR IS HANDLING IT
							//
							/*var pixel = mapObj.getEventPixel(event.originalEvent);
							displayFeatureInfo(pixel);*/
						});
         	});
         	
           // Get the routes data and append it to the $scope variable
	        $http.get("data/routes-merge.geojson").success(function(data, status) {
	            // Put the countries on an associative array
	            $scope.routes = {};
	            for (var i=0; i< data.features.length; i++) {
	                var route = data.features[i];
	                $scope.routes[data.features[i].properties.id] = route;
	            }
	        });
         	
       	}]);

})();