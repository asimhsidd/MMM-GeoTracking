# MMM-GeoTracking
A module of [MagicMirror²](https://github.com/MichMich/MagicMirror/) to live track a moving object on the map. This continuously listens to a pubnub channel where the publisher (example file attached) has to publish the new location (lat,lon) as and when moves.

## Using the module

* Navigate to the modules directory via the follow command: `cd MagicMirror/modules`
* Clone the module from github: `git clone https://github.com/asimhsidd/MMM-GeoTracking.git`
* Navigate to the MMM-GeoTracking directory: `cd MMM-GeoTracking`
* Install the dependencies: `npm install`
* Add the following configuration to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
			module: 'MMM-GeoTracking',
			position: 'top_right',
			config: {
				pnchannel: "MMM-GeoTracking", // change it to anything, like 'Car-Tracker'
				gmapid: "", // Input your google key here (btw, its free :p)
				pnids: "", // Input your pubnub subscriber key (btw, its free too :p)
				lat: "25.2048", // default latitude (its somewhere my office)
				lng: "55.2708", // default longitude
				label: "AS" // Anything you may like
			}
        }
    ]
}
```

## Configuration options for MMM-GeoTracking

| Option    	| Description
|---------------|-----------
| `position`	| *Required* The position of the screencast window. <br>**Options:** `['bottomRight', 'bottomCenter', 'bottomLeft', 'center',  'topRight', 'topCenter', 'topLeft']` <br>**Type:** `string` <br>**Note:** This module config actual sets the location, not the magic mirror position config.
| `pnchannel`  	| *Required* Pubnub channel name. <br>
| `gmapid`   	| *Required* Your google key. <br>
| `pnids`   	| *Required* Subscriber key of your pubnub account. <br>
| `lat`   		| *Optional* Latitude of the default location. <br>
| `lng`   		| *Optional* Longitude of the default location. <br>
| `label`   	| *Optional* Marker label. <br>
