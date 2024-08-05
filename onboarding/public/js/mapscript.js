/// <reference types="@types/googlemaps" />
var map, directionsService, directionsRenderer, autocompleteStart, autocompleteEnd, unsafeZones = [];
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -37.81, lng: 144.96 },
        zoom: 11,
    });
    const bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);
    console.log("Map initialized");

        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        fetchUnsafeZones().then(data => {
            displayUnsafeZones(data, map);
        });

        setupDirections(directionsService, directionsRenderer);

        
    }
    
    async function fetchUnsafeZones() {
        try {
            const response = await fetch('/data/most_dangerous.json');
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch unsafe zones:', error);
            return [];
        }
    }

     
    function displayUnsafeZones(data, map) {
        data.forEach(zone => {
            var zonePosition = {lat: zone.Latitude, lng: zone.Longitude};
            var marker = new google.maps.Marker({
                position: zonePosition,
                map: map,
                title: "Unsafe Zone: " + zone.Road,
                icon: {
                    url: "images/risk-icon.svg",
                    scaledSize: new google.maps.Size(20, 20),
                    anchor: new google.maps.Point(10, 11)    
                }
            });


    
            var circle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map,
                center: zonePosition,
                radius: 500,  // radius should be adjusted based on your specific needs,
                label: "Unsafe Zone: " + zone.Road
            });

            console.log("Unsafe zone added: " + zone.Latitude + ", " + zone.Longitude);
    
            // Store the circle object for later use in routing checks
            unsafeZones.push(circle);
        });
    }

    function setupDirections(directionsService, directionsRenderer) {
        const originInput = document.getElementById("startingInput");
        const destinationInput = document.getElementById("destinationInput");
        const findDirectionsButton = document.getElementById("search_btn");

        const originAutocomplete = new google.maps.places.Autocomplete(originInput);
        originAutocomplete.setComponentRestrictions({ country: ["au"] });
        const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
        destinationAutocomplete.setComponentRestrictions({ country: ["au"] });
    
        findDirectionsButton.addEventListener("click", () => {
            const origin = originInput.value;
            const destination = destinationInput.value;
            console.log("Finding directions from " + origin + " to " + destination);
    
            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: google.maps.TravelMode.BICYCLING,
                },
                (response, status) => {
                    if (status === "OK") {
                        var routePath = response.routes[0].overview_path;
                        if (!checkRouteSafety(routePath)) {
                            directionsRenderer.setDirections(response);
                            console.log("Directions found");
                        } else {
                            alert('No route available that avoids all unsafe zones.');
                        }
                        
                    } else {
                        console.error("Directions request failed due to " + status);
                    }
                }
            );
        });
    }
    function checkRouteSafety(routePath) {
        return routePath.some(pathPoint => {
            return unsafeZones.some(zone => {
                return google.maps.geometry.spherical.computeDistanceBetween(pathPoint, zone.getCenter()) < zone.getRadius();
            });
        });
    }


window.onload = function() {
    if (typeof google === 'object' && typeof google.maps === 'object') {
        initMap();
    } else {
        console.error("Google Maps API not loaded");
    }
};