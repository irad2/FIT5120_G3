/// <reference types="@types/googlemaps" />
document.addEventListener('DOMContentLoaded', function() {
let chart;
function loadGeoJson(map) {
    fetch('../data/suburb.geojson')
      .then(response => response.json())
      .then(data => {
        const polygonFeatures = {
            type: "FeatureCollection",
            features: data.features.filter(feature => feature.geometry.type === "Polygon")
        };
        map.data.addGeoJson(polygonFeatures);
        map.data.setStyle({
            fillColor: 'green',
        });
      })
      .catch(error => console.error('Error loading GeoJSON:', error));
  }

  function showChart() {
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.style.display = 'block';

    const ctx = document.getElementById('accidentChart').getContext('2d');
    
    const data = {
        labels: ["12AM-2AM", "2AM-4AM", "4AM-6AM", "6AM-8AM", "8AM-10AM", "10AM-12PM", "12PM-2PM", "2PM-4PM", "4PM-6PM", "6PM-8PM", "8PM-10PM", "10PM-12AM"],
        datasets: [{
            label: 'Number of Accidents',
            data: [146, 108, 113, 215, 219, 247, 301, 368, 337, 252, 198, 169],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    processData();
}
function closeChart() {
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.style.display = 'none';
    if (chart) {
        chart.destroy();
    }
}
function showSeverityAreas(map) {
    Promise.all([
        fetch('../data/suburb.geojson').then(response => response.json()),
        fetch('../data/postcode_counts.json').then(response => response.json())
    ]).then(([geoJsonData, postcodeData]) => {
        const postcodeMap = new Map(postcodeData.map(item => [item.POSTCODE.toString(), item.COUNT]));
        console.log(postcodeMap);
                const counts = postcodeData.map(item => item.COUNT);
                const minCount = Math.min(...counts);
                const maxCount = Math.max(...counts);
                const polygonFeatures = {
                    type: "FeatureCollection",
                    features: geoJsonData.features.filter(feature => feature.geometry.type === "Polygon")
                };
                map.data.addGeoJson(polygonFeatures);
                map.data.setStyle(feature => {
                    const postcode = feature.getProperty('postal_code');
                    const count = postcodeMap.get(postcode) || 0;
                    const normalizedCount = (count - minCount) / (maxCount - minCount);
                    const color = getColorForPercentage(normalizedCount);
                    return {
                        fillColor: color,
                        fillOpacity: 0.4,
                        strokeWeight: 1,
                        strokeColor: '#000000'
                    };
                }); });
}

function loadGoogleMapsScript() {
    const script = document.getElementById('google-maps-script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsApiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
}
loadGoogleMapsScript();

var map, directionsService, directionsRenderer, autocompleteStart, autocompleteEnd, unsafeZones = [];

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -37.81, lng: 144.96 },
        zoom: 11,
    });
    const bikeLayer = new google.maps.BicyclingLayer();
    var button = document.createElement('button');
    button.textContent = 'Bicycle Layer';
    button.className = 'map-button';
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(button);

    button.onclick = function() {
        if (bikeLayer.getMap()) {
            bikeLayer.setMap(null);
            button.textContent = 'Bicycle Layer';
        } else {
            bikeLayer.setMap(map);
            button.textContent = 'Hide Bicycle Layer';
        }
    };
    console.log("Map initialized");

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    var riskbutton = document.createElement('button');
    riskbutton.textContent = 'Risk Areas';
    riskbutton.className = 'map-button';
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(riskbutton);

    riskbutton.onclick = function() {
        showUnsafeZones = !showUnsafeZones;
        if (showUnsafeZones) {
            fetchUnsafeZones().then(data => {
                displayUnsafeZones(data, map);
            });
            showSeverityAreas(map);
            riskbutton.textContent = 'Hide Risk Areas';
        } else {
            hideUnsafeZones(map);
            riskbutton.textContent = 'Risk Areas';
        }
    };

    var chartbutton = document.createElement('button');
    chartbutton.textContent = 'Show Insights';
    chartbutton.className = 'map-button';
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(chartbutton);
    chartbutton.onclick = function() {
        showInsights = !showInsights;
        if (showInsights) {
            showChart();
            chartbutton.textContent = 'Hide Insights';
        } else {
            closeChart();
            chartbutton.textContent = 'Show Insights';
        }


        
    };

    setupDirections(directionsService, directionsRenderer);


    

    // loadGeoJson(map);

}
function getColorForPercentage(pct) {
    const hue = ((1 - pct) * 120).toString(10);
    return `hsl(${hue}, 100%, 50%)`;
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
async function fetchData() {
    try {
        const response = await fetch('../data/age_range.json');
        return await response.json();


    } catch (error) {
        console.error("failed to fetch age range data");
        return [];
    }
}

async function processData() {
    const data = await fetchData();
    var labels = [];
    var values = [];

    data.forEach(item => {
        labels.push(item['Age Range']);
        values.push(item['Count']);
    });

    console.log(labels);
    console.log(values);

    var ctx = document.getElementById('ageChart').getContext('2d');
    var ageChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Count of Range',
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}
processData();

function displayUnsafeZones(data, map) {
    var infoWindow = new google.maps.InfoWindow();

    data.forEach(zone => {
        var zonePosition = { lat: zone.Latitude, lng: zone.Longitude };
        var marker = new google.maps.Marker({
            position: zonePosition,
            map: map,
            title: "Unsafe Zone: " + zone.Road,
            icon: {
                url: "images/risk-icon.svg",
                scaledSize: new google.maps.Size(20, 20),
                anchor: new google.maps.Point(10, 10)
            }
        });

        marker.addListener('click', function() {
            infoWindow.setContent('<strong>' + zone.Road + '</strong><br>' +
                'Issues Raised: ' + zone['Issues Raised'] + '</div>'
            );

            infoWindow.open(map, marker);
        });




        var circle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map,
            center: zonePosition,
            radius: 500, // radius should be adjusted based on your specific needs,
            label: "Unsafe Zone: " + zone.Road
        });

        console.log("Unsafe zone added: " + zone.Latitude + ", " + zone.Longitude);

        // Store the circle object for later use in routing checks
        unsafeZones.push({ marker, circle });
    });
}
var showUnsafeZones = false;
var unsafeZones = [];
var showInsights = false;

function hideUnsafeZones(map) {
    unsafeZones.forEach(({ marker, circle }) => {
        marker.setMap(null);
        circle.setMap(null);
    });
    unsafeZones = [];
    map.data.setStyle({
        fillOpacity: 0,
        strokeWeight: 0
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

        directionsService.route({
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.BICYCLING,
            },
            (response, status) => {
                if (status === "OK") {
                    var routePath = response.routes[0].overview_path;
                    if (!checkRouteSafety(routePath)) {

                        console.log("Directions found");
                    } else {
                        alert('Your route passes through a notably high-risk area. Please be careful');
                    }
                    directionsRenderer.setDirections(response);
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
};});