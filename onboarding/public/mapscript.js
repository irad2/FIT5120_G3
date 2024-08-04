/// <reference types="@types/googlemaps" />
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -37.81, lng: 144.96 },
        zoom: 13,
    });
    const bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);
    console.log("Map initialized");

        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
    

        setupDirections(directionsService, directionsRenderer);
    }
    
    function setupDirections(directionsService, directionsRenderer) {
        const originInput = document.getElementById("startingInput");
        const destinationInput = document.getElementById("destinationInput");
        const findDirectionsButton = document.getElementById("search_btn");

        const originAutocomplete = new google.maps.places.Autocomplete(originInput);
        //originAutocomplete.bindTo("bounds", map);
        const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
        //destinationAutocomplete.bindTo("bounds", map);
    
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
                        directionsRenderer.setDirections(response);
                        console.log("Directions found");
                    } else {
                        console.error("Directions request failed due to " + status);
                    }
                }
            );
        });
    }


window.onload = function() {
    if (typeof google === 'object' && typeof google.maps === 'object') {
        initMap();
    } else {
        console.error("Google Maps API not loaded");
    }
};