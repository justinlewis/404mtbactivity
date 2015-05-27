
(function(){
	

			var mapObj;
			var layersArr = [];
			
			var app = angular.module("404RouteMap", ["openlayers-directive"]);   
			
			app.controller('404MapController', [ '$scope', '$http', 'olData', function($scope, $http, olData) {
            angular.extend($scope, {
                defaultCenter: {
                    lat: 39.749089,  
                    lon: -104.996966,  
                    zoom: 11
                },
                defaults: {
                    events: {
                        map: [ 'pointermove' ]
                    }
                },
                mouseposition: {},
                projection: 'EPSG:3857',
                controls: [
                	{ name: 'zoom', active: true }
            	 ],
            	 geojson: [ {
                	name: '',
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
            	} ]
            });
            ////
            ////
            //  THIS ISNT WORKING YET
            ////
            ////
            $scope.$on('openlayers.map.pointermove', function(event, coord) {
                $scope.$apply(function() {
                    if ($scope.projection === coord.projection) {
                        $scope.mouseposition = coord;
                    } else {
                        var p = ol.proj.transform([ coord.lon, coord.lat ], coord.projection, $scope.projection);
                        $scope.mouseposition = {
                            lat: p[1],
                            lon: p[0],
                            projection: $scope.projection
                        }                      
                    }
                });
         	});
       	}]);
			
			
	/*		this.init = function () {
				
				layersArr = buildLayers();
				renderMap(layersArr);
				addLayerInteractivity();
				
				attachLayerToggleEvents()
						
			}
			

						
			function attachLayerToggleEvents() {			
				$("input[name='overlayLayers']").change(function (event) {
					var layerPositionIdx = parseInt($(this).val());
					
					if(event.target.checked){
						layersArr[layerPositionIdx].setVisible(true);
					}
					else {
						layersArr[layerPositionIdx].setVisible(false);
					}
				});
			}
				
			
			function buildLayers() {
				///
				// GeoJSON 
				///			
				var image = new ol.style.Circle({
	  				radius: 5,
	  				fill: null,
	  				stroke: new ol.style.Stroke({color: 'red', width: 1})
				});
	
				var geoJsonStyles = {
					'Point': [new ol.style.Style({
	    				 image: image
	 				 })],
					 'LineString': [new ol.style.Style({
					    stroke: new ol.style.Stroke({
					      color: 'green',
					      width: 1
					    })
					  })],
					  'MultiLineString': [new ol.style.Style({
					    stroke: new ol.style.Stroke({
					      color: 'green',
					      width: 1
					    })
					  })],
					  'MultiPolygon': [new ol.style.Style({
					    stroke: new ol.style.Stroke({
					      color: 'black',
					      width: 1
					    }),
					    fill: new ol.style.Fill({
					      color: 'rgba(255, 255, 0, 0)'
					    })
					  })],
					  'Polygon': [new ol.style.Style({
					    stroke: new ol.style.Stroke({
					      color: 'blue',
					      lineDash: [4],
					      width: 3
					    }),
					    fill: new ol.style.Fill({
					      color: 'rgba(0, 0, 255, 0.1)'
					    })
					  })],
					  'GeometryCollection': [new ol.style.Style({
					    stroke: new ol.style.Stroke({
					      color: 'magenta',
					      width: 2
					    }),
					    fill: new ol.style.Fill({
					      color: 'magenta'
					    }),
					    image: new ol.style.Circle({
					      radius: 10,
					      fill: null,
					      stroke: new ol.style.Stroke({
					        color: 'magenta'
					      })
					    })
					  })],
					  'Circle': [new ol.style.Style({
					    stroke: new ol.style.Stroke({
					      color: 'red',
					      width: 2
					    }),
					    fill: new ol.style.Fill({
					      color: 'rgba(255,0,0,0.2)'
					    })
					  })]
				};
					
				var styleFunction = function(feature, resolution) {
				  return geoJsonStyles[feature.getGeometry().getType()];
				};
	
			   
			   var bikeRoutesGeoJsonSource = new ol.source.GeoJSON(
		    	({
			    		url: 'data/bike_routes_drcog_4326_geojson.json',
			    		projection: 'EPSG:3857'
			   	})
			   );
				
				var bikeRoutesGeojson = new ol.layer.Vector({
					  source: bikeRoutesGeoJsonSource,
					  style: styleFunction
				})
				
				
				///
				// TopoJSON 
				///	
				var countriesStyle = [new ol.style.Style({
				  fill: new ol.style.Fill({
				    color: 'rgba(255, 255, 255, 0)'
				  }),
				  stroke: new ol.style.Stroke({
				    color: 'black',
				    width: 1
				  })
				})];
				
			   var countriesTopoJson = new ol.layer.Vector({
		  			source: new ol.source.TopoJSON({
		    			projection: 'EPSG:3857',
		    			url: 'data/countries_topojson.json'
		  			}),
		  			style: countriesStyle, 
		  			visible: false
				});
				
				var crashTopoJson = new ol.layer.Vector({
		  			source: new ol.source.TopoJSON({
		    			projection: 'EPSG:3857',
		    			url: 'data/drcog_crash_2010_5000rec_4326_topojson.json'
		  			}),
		  			visible: false
				});
				
				var bikeRoutesTopoJson = new ol.layer.Vector({
		  			source: new ol.source.TopoJSON({
		    			projection: 'EPSG:3857',
		    			url: 'data/bike_routes_drcog_4326_topojson.json'
		  			}),
		  			style: new ol.style.Style({
				  		fill: new ol.style.Fill({
				    		color: 'rgba(255, 255, 255, 0)'
				  		}),
				  		stroke: new ol.style.Stroke({
				    		color: 'green',
				    		width: 2
				  		})
					}),
					visible: false
				});
				
				///
				// WMS 
				///	
				var usWMS = new ol.layer.Tile({
		    		source: new ol.source.TileWMS( ({
		      		url: 'http://demo.boundlessgeo.com/geoserver/wms',
		      		params: {'LAYERS': 'topp:states', 'TILED': true},
		      		serverType: 'geoserver'
		    		})),
		    		visible: false
		  		 })
		  		 
		  		 var esriWMS = new ol.layer.Tile({
		    		source: new ol.source.TileWMS( ({
		      		url: 'http://dtc-sci02.esri.com/arcgis/services/201311_OGCDemos/NofolkOSMLines/MapServer/WMSServer',
		      		params: {'LAYERS': '2,7,8'}
		    		})),
		    		visible: false
		  		 })
		  		 
		  		 ///
		  		 // Vector Tile
		  		 ///
		  				    			
				var roadStyleCache = {};
				var roadsVectorTile = new ol.layer.Vector({
				  source: new ol.source.TileVector({
				    format: new ol.format.TopoJSON(),
				    projection: 'EPSG:3857',
				    tileGrid: new ol.tilegrid.XYZ({
				      maxZoom: 19
				    }),
				    url: 'http://{a-c}.tile.openstreetmap.us/vectiles-highroad/{z}/{x}/{y}.topojson'
				  }),
				  style: function(feature, resolution) {
				    var kind = feature.get('kind');
				    var railway = feature.get('railway');
				    var sort_key = feature.get('sort_key');
				    var styleKey = kind + '/' + railway + '/' + sort_key;
				    var styleArray = roadStyleCache[styleKey];
				    if (!styleArray) {
				      var color, width;
				      if (railway) {
				        color = '#7de';
				        width = 1;
				      } else {
				        color = {
				          'major_road': 'red',
				          'minor_road': 'red',
				          'highway': 'red'
				        }[kind];
				        width = kind == 'highway' ? 1.5 : 1;
				      }
				      styleArray = [new ol.style.Style({
				        stroke: new ol.style.Stroke({
				          color: color,
				          width: width
				        }),
				        zIndex: sort_key
				      })];
				      roadStyleCache[styleKey] = styleArray;
				    }
				    return styleArray;
				  },
				  visible: false
				});

				var osmBase = new ol.layer.Tile({ source: new ol.source.OSM() });
				var layersArray = [ 
					 osmBase,
					 usWMS,
		          countriesTopoJson,    
		          bikeRoutesTopoJson,
		          crashTopoJson,
		          roadsVectorTile,
		          esriWMS
					 //bikeRoutesGeojson 
				];
				
				return layersArray;
			}
			
			
			///
			// Initialize Map
			///	
			function renderMap(layersArray) {	
		      mapObj = new ol.Map({
		        target: 'map',
		        layers: layersArray,
		        view: new ol.View({
		          center: [-11684615.727661774, 4826163.882669482], 
		          zoom: 4
		        })
		      });
	      }
	   	      
	      
	      ////
	      // Interactive Events
	      ////
	      function addLayerInteractivity() {
			      // Hover hightlight event      
					var hoverEvent = new ol.interaction.Select({
			  			condition: ol.events.condition.mouseMove,
//			  			layers: [bikeRoutesTopoJson],
			  			style: new ol.style.Style({
							  fill: new ol.style.Fill({
							    color: 'rgba(255, 255, 255, 1)'
							  }),
							  stroke: new ol.style.Stroke({
							    color: 'red',
							    width: 4
							  }),
							  zIndex: 1
							})
					});
			      mapObj.addInteraction(hoverEvent);
			      
			      // Hover get feature attribution
			      var displayFeatureInfo = function(pixel) {
						  var feature = mapObj.forEachFeatureAtPixel(pixel, function(feature, layer) {
						    return feature;
						  });
						
						  var infoTarget = document.getElementById('fixed-hover-window-text');
						  if (feature) {
						    infoTarget.innerHTML = feature.get('name');
						  } else {
						    infoTarget.innerHTML = '&nbsp;';
						  }		
					};
					
					$(mapObj.getViewport()).on('mousemove', function(evt) {
			  			var pixel = mapObj.getEventPixel(evt.originalEvent);
			  			displayFeatureInfo(pixel);
					});
			      
			      
			      // Map drag end event
			      function onMoveEnd(evt) {
			      	console.log(evt.map.getView().getCenter());
			      }
			      
			      mapObj.on('moveend', onMoveEnd);   
	      }
	      
	      
	      // Initialize
	      this.init();*/
//	});

})();