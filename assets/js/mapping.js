let map;
function initMap() {
	map = new google.maps.Map(document.getElementById("map"), {
		center: { lat: 30.24732, lng: -97.81255 },
		zoom: 11,
	});
	// Recorded locations
        const barton = { lat: 30.24469, lng: -97.80212};
	const roy = {lat: 30.24616, lng: -97.70495};
	const onion = {lat: 30.15890, lng:- 97.75528};

	const bartonContent = 
		"<h1>Barton Creek Greenbelt</h1>" +
		"<audio controls>" +
		'<source src="/assets/audio/barton_bridge.flac" type="audio/flac">' + 
		"Error: Your browser does not support audio." +
		"</audio>";

	const royContent = 
		"<h1>Roy Guerrero Disc Golf Course</h1>" +
		"<audio controls>" +
		'<source src="/assets/audio/roy.flac" type="audio/flac">' + 
		"Error: Your browser does not support audio." +
		"</audio>";

	const onionContent =
		"<h1>Onion Creek Metropolitan Park</h1>" +
		"<audio controls>" +
		'<source src="/assets/audio/onion.flac" type="audio/flac">' + 
		"Error: Your browser does not support audio." +
		"</audio>";

	const windowBarton = new google.maps.InfoWindow({
		content: bartonContent,
	});
	const windowRoy = new google.maps.InfoWindow({
		content: royContent,
	});
	const windowOnion = new google.maps.InfoWindow({
		content: onionContent,
	});

	const markerBarton = new google.maps.Marker({
		position: barton,
		map,
		title: "Barton Creek GreenBelt",
	});

	const markerRoy = new google.maps.Marker({
		position: roy,
		map,
		title: "Roy Guerrero Disc Golf Course",
	});

	const markerOnion = new google.maps.Marker({
		position: onion,
		map,
		title: "Onion Creek Metropolitain Park",
	});
	
	markerBarton.addListener("click", () => {
		windowBarton.open(map, markerBarton);
		});
		
	markerRoy.addListener("click", () => {
		windowRoy.open(map, markerRoy);
		});

	markerOnion.addListener("click", () => {
		windowOnion.open(map, markerOnion);
		});
}


