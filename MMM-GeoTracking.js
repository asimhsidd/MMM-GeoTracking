/* Magic Mirror Module: MMM-GeoTracking
 * v1.0.1 - June 2016
 *
 * By Asim Siddiqui <asimhsidd@gmail.com>
 * MIT License
 */

Module.register("MMM-GeoTracking",{
	// few defaultStatus
	defaults: {
		initialLoadDelay: 50, // to set up map & pubnub listener once the DOM is updated
		mapSTYLE:[ // map styling
					{
						"featureType": "all",
						"stylers": [
							{
								"saturation": 0
							},
							{
								"hue": "#e7ecf0"
							}
						]
					},
					{
						"featureType": "road",
						"stylers": [
							{
								"saturation": -70
							}
						]
					},
					{
						"featureType": "transit",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "poi",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "water",
						"stylers": [
							{
								"visibility": "simplified"
							},
							{
								"saturation": -60
							}
						]
					}
				]
	},
	// Request for the css
	getStyles: function() {	
		return ['MMM-GeoTracking.css']	
	},
	
	// Start the module by loading google maps API
	start: function () {
		self = this;
		self.loaded = false;
		var scripts = [
			"https://cdn.pubnub.com/sdk/javascript/pubnub.4.19.0.min.js",
			"//maps.googleapis.com/maps/api/js?key=" + self.config.gmapid
		];
        Log.info("Starting module: " + this.name);
		
		// load all the scripts AND THEN continue with the script
		loadScripts = function (scripts){
			var script = scripts.shift();
			var el = document.createElement('script');
			el.src = script;
			el.onload = function(script){
				if (scripts.length) {
					loadScripts(scripts);
				}else{
					self.loaded = true;
					self.updateDom();
				}
			};
			document.querySelector("body").append(el);
		}
		loadScripts(scripts);
    },

    // Override dom generator.
    getDom: function() {
		var self = this;
		var wrapper = document.createElement("div");
		
		// if API's are not yet loaded
		if (!self.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "dimmed light small";
			return wrapper;
		}
		// Few global variables
		var pubnub = "", map = "", mark = "";
        var mapElement = document.createElement("div");
		
		// map div creation
		self.mapId = self.identifier + "_gmap";
        mapElement.id = self.mapId;
        mapElement.classList.add("map-canvas");
        wrapper.appendChild(mapElement);
		
		// Reposition the map each time a message from PubNub is received
		var repositionMAP = function(payload) {
			lat = payload.message.lat;
			lng = payload.message.lng;
			map.setCenter({lat:lat, lng:lng, alt:0});
			mark.setPosition({lat:lat, lng:lng, alt:0});
		};

		// setting up map, mark & pubnub listener once the map div is on the DOM
		setTimeout(function() {
			// firstly, set up the map
			map  = new google.maps.Map(
					document.getElementById(self.mapId), 
					{
						center:{
								lat:parseFloat(self.config.lat),
								lng:parseFloat(self.config.lng)
						},
					zoom:15, 
					styles: self.config.mapSTYLE
				});
			// secondly, set up the marker on the map
			mark = new google.maps.Marker({
				position:{
					lat:parseFloat(self.config.lat),
					lng:parseFloat(self.config.lng)
				},
				animation: google.maps.Animation.DROP,
				label: {
					text: self.config.label, 
					color: "white",
					fontWeight: 'bold', 
					fontSize: '14px'
				},
				map:map
			});
			// set up the pubnub and initiate the listening
		    pubnub = new PubNub({ subscribeKey: self.config.pnids });
			pubnub.subscribe({channels: [self.config.pnchannel]});
			pubnub.addListener({message:repositionMAP});
		}, self.config.initialLoadDelay);
        return wrapper;
	}
});