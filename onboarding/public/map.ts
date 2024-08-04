/// <reference types="@types/googlemaps" />

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */


function initMap(): void {
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const directionsService = new google.maps.DirectionsService();
  const map = new google.maps.Map(
    document.getElementById("map2") as HTMLElement,
    {
      zoom: 14,
      center: { lat: 37.77, lng: -122.447 },
    }
  );

  directionsRenderer.setMap(map);

  calculateAndDisplayRoute(directionsService, directionsRenderer);
  (document.getElementById("mode") as HTMLInputElement).addEventListener(
    "change",
    () => {
      calculateAndDisplayRoute(directionsService, directionsRenderer);
    }
  );
}

function calculateAndDisplayRoute(
  directionsService: google.maps.DirectionsService,
  directionsRenderer: google.maps.DirectionsRenderer
) {
  const selectedMode = (document.getElementById("mode") as HTMLInputElement)
    .value;

  directionsService
    .route({
      origin: { lat: -37.81, lng: 144.9631 },
      destination: { lat: -37.908, lng: 145.127 }, // Ocean Beach.
      // Note that Javascript allows us to access the constant
      // using square brackets and a string value as its
      // "property."
      travelMode: google.maps.TravelMode["BICYCLING"],
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + status));
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
