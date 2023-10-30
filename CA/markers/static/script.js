var map; // Define the map variable in a scope accessible to both functions
function add_bike_locations() {
    map = L.map('bikes', { attributionControl: false }).setView([53.34594613825005, -6.26139945607668], 13);
    // Add a tile layer for the map background
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        zoomControl: false,
        attributionControl: false
    }).addTo(map);

    var fontAwesomeIcon = L.divIcon({
        className: 'font-awesome-icon',
        html: '<i class="fa fa-map-pin fa-2x" style="color: blue;"></i>', // Use your Font Awesome class and color
        iconSize: [24, 24], // Adjust the size as needed
    });
    // Fetch bike data from the Django view using AJAX
    var bikeDataUrl = document.getElementById('bikes').getAttribute('data-url');
    $.ajax({
        url: bikeDataUrl,
        method: "GET",
        success: function(bikeData) {
            bikeData.forEach(function(bike) {
                var marker = L.marker([bike.latitude, bike.longitude], {icon: fontAwesomeIcon})
                    .bindPopup('Name: ' + bike.name + '<br>Address: ' + bike.address);
                marker.addTo(map);
            });
        }
    });
}

function getLocation() {
    var csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            // Create a red marker for the user's location
            var fontAwesomeIcon = L.divIcon({
                className: 'font-awesome-icon',
                html: '<i class="fa fa-map-pin fa-2x" style="color: blue;"></i>', // Use your Font Awesome class and color
                iconSize: [24, 24], // Adjust the size as needed
            });

            // Create a marker for the current location
            var marker = L.marker([latitude, longitude], { icon: fontAwesomeIcon }).addTo(map);
            
            // Update the map view to the current location
            map.setView([latitude, longitude], 13);

            // Display a circle showing the accuracy of the fix
            var circle = L.circle([latitude, longitude], {
                color: 'none',
                fillColor: 'blue',
                fillOpacity: 0.2,
                radius: position.coords.accuracy * 0.2
            }).addTo(map);

             // Send the latitude and longitude to the server with the CSRF token
             $.ajax({
                url: '/update_user_location/',
                type: 'POST',
                data: {
                    latitude: latitude,
                    longitude: longitude,
                    csrfmiddlewaretoken: csrfToken
                }, // Include the CSRF token
                success: function (data) {
                    console.log(data.message); // Log the response from the server
                }
            });
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

function addLocationToMap(name, address, latitude, longitude) {
    // Create a marker for the user-provided location
    var fontAwesomeIcon = L.divIcon({
        className: 'font-awesome-icon',
        html: '<i class="fa fa-map-pin fa-2x" style="color: green;"></i>', // Use your Font Awesome class and color
        iconSize: [24, 24], // Adjust the size as needed
    });

    // Create a marker at the provided latitude and longitude
    var marker = L.marker([latitude, longitude], { icon: fontAwesomeIcon, name: name  }).bindPopup('Name: ' + name + '<br>Address: ' + address);
    marker.addTo(map);

    // Update the map view to the user-provided location
    map.setView([latitude, longitude], 13);
}

function get_Location_Prompt() {
    let name = prompt("Please enter the name:");
    if (name == null || name == "") {
      text = "User cancelled the prompt.";
    } else {
      let address = prompt("Please enter the address:");
      if (address == null || address == "") {
        text = "User cancelled the prompt.";
      } else {
        let latitude = parseFloat(prompt("Please enter the latitude:"));
        if (isNaN(latitude)) {
          text = "Invalid latitude input.";
        } else {
          let longitude = parseFloat(prompt("Please enter the longitude:"));
          if (isNaN(longitude)) {
            text = "Invalid longitude input.";
          } else {
            // At this point, you have valid input values
            text = "Name: " + name + "<br>Address: " + address + "<br>Latitude: " + latitude + "<br>Longitude: " + longitude;
            
            // Now, you can proceed to add this location to your Leaflet map
            addLocationToMap(name, address, latitude, longitude);
          }
        }
      }
    }
  }

function findMarkerByName(name) {
    var targetMarker = null;

    // Iterate through the layers on the map
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            // Check if the layer (marker) has a custom property called 'name'
            if (layer.options.name && layer.options.name === name) {
                targetMarker = layer;
            }
        }
    });

    return targetMarker;
}

  function updateLocationOnMap(name, address, latitude, longitude) {
    // Find the existing marker to update (you might need to iterate through all markers and find the one with the matching name)
    // Remove the existing marker from the map
    // Create a new marker with the updated data
    // Add the new marker to the map

    // For example:
    var existingMarker = findMarkerByName(name); // Implement this function to find the marker by name
    if (existingMarker) {
        map.removeLayer(existingMarker); // Remove the existing marker
        addLocationToMap(name, address, latitude, longitude); // Add the updated marker
    } else {
        alert("Location not found on the map.");
    }
}


  function editLocationOnMap() {
    var name = prompt("Please enter the marker name:", "Existing Name");
    if (name == null || name == "") {
        text = "User cancelled the prompt.";
    } else {
        var address = prompt("Please enter new address:", "Existing Address");
        if (address == null || address == "") {
            text = "User cancelled the prompt.";
        } else {
            var latitude = parseFloat(prompt("Please enter the latitude:"));
            if (isNaN(latitude)) {
                text = "Invalid latitude input.";
            } else {
                var longitude = parseFloat(prompt("Please enter the longitude:"));
                if (isNaN(longitude)) {
                    text = "Invalid longitude input.";
                } else {
                    // At this point, you have valid edited input values
                    text = "Edited Name: " + name + "<br>Edited Address: " + address + "<br>Edited Latitude: " + latitude + "<br>Edited Longitude: " + longitude;
                    
                    // Now, you can proceed to update the existing location on your Leaflet map
                    updateLocationOnMap(name, address, latitude, longitude);
                }
            }
        }
    }
}


function deleteLocationFromMap(name) {
    var name = prompt("Please enter the marker name:", "Existing Name");
    if (name == null || name == "") {
        text = "User cancelled the prompt.";
    } else
    {// Find the existing marker by name and remove it
        var marker = findMarkerByName(name);
        if (marker) {
            map.removeLayer(marker);
        } else {
            alert("Location not found on the map.");
        }
    } 
}

// function getLocation() {
//         var map = L.map("map");

//     // Use map.locate to get the user's location
//     map.locate({ setView: true, maxZoom: 13 });

//     // When the location is found, handle the 'locationfound' event
//     map.on("locationfound", function (e) {
//         var marker = L.marker(e.latlng).addTo(map);
//         var circle = L.circle(e.latlng, {
//             color: "blue",
//             fillColor: "blue",
//             fillOpacity: 0.2,
//             radius: e.accuracy,
//         }).addTo(map);
//     });

//     // When the location is not found, handle the 'locationerror' event
//     map.on("locationerror", function (e) {
//         alert("Error finding your location: " + e.message);
//     });
// }