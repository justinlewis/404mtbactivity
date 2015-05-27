describe("Map", function(){
	it("Should not have any layers", function() {
		var map = new Map();
		var mapObj = map.mapObj;
		var layers = mapObj.getLayers();
		var layersCt = layers.getLength();
		expect(layersCt).toBe(0);
	})
	it("Should have  layers", function() {
		var map = new Map();
		var mapObj = map.mapObj;
		var layers = mapObj.getLayers();
		var layersCt = layers.getLength();
		expect(layersCt).toBe(1);
	})
})