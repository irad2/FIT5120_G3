const apiKey = "c2aed035e49c4245d30e762f6d5a9e9c"

document.addEventListener("DOMContentLoaded", () => {

    // Get users's latitude and longtitude, throws error if not supported
    function getGeolocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lon: position.coords.longitude,
                        });
                    },
                    (error) => {
                        reject(error);
                    }
                );
            } else {
                reject(new Error("Geolocation is not supported by this browser."));
            }
        });
    }

    // Fetches the current UV index
    function getUVIndex(lat, lon) {
        console.log(lat, lon, apiKey);
        return fetch(
            `/openweather/api/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
        ).then((response) => {
            if (!response.ok) {
                throw new Error('Failed to get UV index');
            }
            return response.json();
        })
        .then((data) => data.value)
        .catch((error) => {
            console.error(error);
            return null;
        });
    }

    // Updates the UI
    function updateUVIndex(uvIndex) {
        const uvIndexElement = document.getElementById('uv-index');

        if(uvIndexElement !== null) {    
            uvIndexElement.textContent = uvIndex;
            if (uvIndex < 3) {
                uvIndexElement.style.backgroundColor = 'green';
            } else if (uvIndex < 6) {
                uvIndexElement.style.backgroundColor = 'yellow';
            } else if (uvIndex < 8) {
                uvIndexElement.style.backgroundColor = 'orange';
            } else if (uvIndex < 11) {
                uvIndexElement.style.backgroundColor = 'red';
            } else {
                uvIndexElement.style.backgroundColor = 'purple';
            }
        } else {
            uvIndexElement.textContent = 'N/A';
        }

    }

    async function displayUVIndex() {
        try {
            const { lat, lon } = await getGeolocation();
            const uvIndex = await getUVIndex(lat, lon);
            updateUVIndex(uvIndex);
        } catch (error) {
            console.error(error);
            updateUVIndex(null);
        }
    }

    displayUVIndex();
});