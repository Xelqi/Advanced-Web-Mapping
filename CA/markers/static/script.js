var map; // Define the map variable in a scope accessible to both functions
var map2;
function add_bike_locations() {
    map2 = L.map('bikes', { attributionControl: false }).setView([53.34594613825005, -6.26139945607668], 13);
    // Add a tile layer for the map background
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        zoomControl: false,
        attributionControl: false
    }).addTo(map2);

    // Fetch bike data from the Django view using AJAX
    var bikeDataUrl = document.getElementById('bikes').getAttribute('data-url');
    $.ajax({
        url: bikeDataUrl,
        method: "GET",
        success: function(bikeData) {
            bikeData.forEach(function(bike) {
                var marker = L.marker([bike.latitude, bike.longitude])
                    .bindPopup('id: ' + bike.id + '<br>Name: ' + bike.name + '<br>Address: ' + bike.address + '<br>Latitude: ' + bike.latitude + '<br>Longitude: ' + bike.longitude);
                marker.addTo(map2);
            });
        }
    });

        // Load markers from local storage
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);

        // Check if the key starts with "userLocation"
        if (key.startsWith("userLocation")) {
            // Retrieve marker data from local storage
            var markerData = JSON.parse(localStorage.getItem(key));

            // Create a marker for the location and add it to the map
            L.marker([markerData.latitude, markerData.longitude])
            .bindPopup('Name: ' + markerData.name + '<br>Latitude: ' + markerData.latitude + '<br>Longitude: ' + markerData.longitude)
            .addTo(map2);
        }
    }
}


function add_bike_locations2() {
    // Your map initialization code
    map = L.map('bikes', { attributionControl: false }).setView([53.34594613825005, -6.26139945607668], 13);
    // Add a tile layer for the map background
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        zoomControl: false,
        attributionControl: false
    }).addTo(map);

    // Function to fetch and update bike data
    function updateBikeData() {
        $.ajax({
            url: "https://api.jcdecaux.com/vls/v1/stations?contract=Dublin&apiKey=6be90970af6ecdefadfa5bed467da6e83e2720ef",
            method: "GET",
            success: function (bikeData) {
                // Remove existing markers before adding updated ones
                map.eachLayer(function (layer) {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer);
                    }
                });

                // Add markers for the updated bike data
                bikeData.forEach(function (bike) {
                    var marker = L.marker([bike.position.lat, bike.position.lng])
                        .bindPopup('Name: ' + bike.name + '<br>' +
                            'Latitude: ' + bike.position.lat + '<br>' +
                            'Longitude: ' + bike.position.lng + '<br>' +
                            'Available Bike Stands: ' + bike.available_bike_stands + '<br>' +
                            'Available Bikes: ' + bike.available_bikes + '<br>' +
                            'Bike Stands: ' + bike.bike_stands);
                    marker.addTo(map);
                });
            }
        });
    }

    // Initial call to fetch and display bike data
    updateBikeData();

    // Set up a timer to update bike data every 5 minutes (300,000 milliseconds)
    setInterval(updateBikeData, 300000);
}

function add_marker(name, address) {
    var csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    // Post the data to create a new marker
    $.ajax({
        url: "https://bikelocator.xyz/bikes/",
        method: "POST",
        data: {
            name: name,
            address: address,
            csrfmiddlewaretoken: csrfToken
        },
        success: function (bikeData) {
            // Add the new marker to the map
            var marker = L.marker([bikeData.latitude, bikeData.longitude])
                .bindPopup('id: ' + bikeData.id + '<br>Name: ' + bikeData.name + '<br>Address: ' + bikeData.address + '<br>Latitude: ' + bikeData.latitude + '<br>Longitude: ' + bikeData.longitude);
            marker.addTo(map2);
            // Set the view to the new marker's position
            map2.setView([bikeData.latitude, bikeData.longitude], 13);
            alert("Marker with id: " + bikeData.id + " Added!");
        }
    });
}

function findMarkerById(id) {
    var foundMarker = null;

    map2.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            // Check if the popup content contains the specified id
            var popupContent = layer.getPopup().getContent();
            if (popupContent && popupContent.indexOf('id: ' + id) !== -1) {
                foundMarker = layer;
            }
        }
    });

    return foundMarker;
}

function edit_marker_details(id, name, address) {
    var csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

    // Find the existing marker on the map
    var existingMarker = findMarkerById(id);

    if (existingMarker) {
         // Remove the existing marker from the map
         map2.removeLayer(existingMarker);
        // Post the data to create a new marker
        $.ajax({
            url: "https://bikelocator.xyz/bikes/" + id + "/",
            method: "PUT",
            headers: {
                "X-CSRFToken": csrfToken
            },
            data: {
                name: name,
                address: address,
            },
            success: function (bikeData) {
                // Add the new marker to the map
                var updatedMarker  = L.marker([bikeData.latitude, bikeData.longitude])
                    .bindPopup('id: ' + bikeData.id + '<br>Name: ' + bikeData.name + '<br>Address: ' + bikeData.address + '<br>Latitude: ' + bikeData.latitude + '<br>Longitude: ' + bikeData.longitude);
                updatedMarker.addTo(map2);
                alert("Marker with id: " + id + " changed!");
                map2.setView([bikeData.latitude, bikeData.longitude], 13);
            }
        });
    } else {
        alert("Marker not found with id: " + id);
    } 
}

function remove_marker(id) {
    var csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    // Find the existing marker on the map
    var existingMarker = findMarkerById(id);

    if (existingMarker) {
         // Remove the existing marker from the map
         map2.removeLayer(existingMarker);
          // Post the data to create a new marker
        $.ajax({
            url: "https://bikelocator.xyz/bikes/" + id + "/",
            method: "DELETE",
            headers: {
                "X-CSRFToken": csrfToken
            },
            data: {
            },
            success: function () {
                alert("Marker with id: " + id + " deleted!");
            }
        });
    } else {
        alert("Marker not found with id: " + id);
    }
}


function getLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            // Save the user's location to local storage
            var userLocation = {
                name: "Your Current Location",
                latitude: latitude,
                longitude: longitude
            };
            localStorage.setItem('userLocation', JSON.stringify(userLocation));

            // Create a marker for the current location
            var marker = L.marker([latitude, longitude])
            .bindPopup('Name: ' + userLocation.name + '<br>Latitude: ' + userLocation.latitude + '<br>Longitude: ' + userLocation.longitude)
            .addTo(map2);

            // Update the map view to the current location
            map2.setView([latitude, longitude], 22);

            // Display a circle showing the accuracy of the fix
            var circle = L.circle([latitude, longitude], {
                color: 'none',
                fillColor: 'blue',
                fillOpacity: 0.2,
                radius: position.coords.accuracy * 0.2
            }).addTo(map2);

            console.log("User location stored locally.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}


var currentRoutingControl; // Global variable to store the current routing control instance

function routingForMarkers(id1, id2) {
    var marker1 = findMarkerById(id1);
    var marker2 = findMarkerById(id2);

    if (marker1 && marker2) {
        var latLng1 = marker1.getLatLng();
        var latLng2 = marker2.getLatLng();

        // Create routing control and store the reference
        currentRoutingControl = L.Routing.control({
            waypoints: [
                latLng1,
                latLng2
            ],
        }).addTo(map2);

        // Remove the routing path after 10 seconds
        setTimeout(function () {
            if (currentRoutingControl) {
                map2.removeControl(currentRoutingControl);
            }
        }, 10000); // 10 seconds in milliseconds
    } else {
        alert("One or both markers not found.");
    }
}
