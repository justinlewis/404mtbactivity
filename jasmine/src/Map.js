function Map() {};


Map.prototype.mapObj = new ol.Map({
								     target: 'map',
								     layers: [
								       new ol.layer.Tile({
								         source: new ol.source.Stamen({layer: 'terrain'})			
								       }) 
								     ],
								     view: new ol.View({center: [-11684615.727661774, 4826163.882669482], zoom: 10})
								});
