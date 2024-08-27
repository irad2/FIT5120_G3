const apiKey = "d1e6a760f216f0d15e3041df144692ab"




document.addEventListener("DOMContentLoaded", () => {
    function getGeolocation() {
        const defaultLocation = {
            lat: -33.8688,
            lon: 151.2093
        };
        //sydney for test
        return new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lon: position.coords.longitude
                        });
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        resolve(defaultLocation);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
                resolve(defaultLocation);
            }
        });
    }

    // Fetches the current UV index
    function getUVIndexes(lat, lon, targetDates) {
        console.log(lat, lon, apiKey);
        return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=minutely,hourly,current,alerts`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                return response.json();
            })
            .then((data) => {
                return targetDates.map(targetDate => {
                    // Filter daily data to find the day matching each target date
                    const dailyData = data.daily.find(day => new Date(day.dt * 1000).toDateString() === new Date(targetDate * 1000).toDateString());
                    if (dailyData && dailyData.uvi) {
                        return dailyData.uvi; // Return the UVI for the target date
                    } else {
                        return null; // Return null if no UVI data found for a particular date
                    }
                });
            })
            .catch((error) => {
                console.error(error);
                return targetDates.map(() => null); // Return an array of nulls in case of an error
            });
    }


    // Updates the UI
    function updateUVIndexes(indexDict) {
        Object.entries(indexDict).forEach(([timestamp, uvIndex], index) => {
            const uvIndexElement = document.getElementById(`uv-index-${index}`);
            if (uvIndexElement) {
                const date = new Date(timestamp * 1000);
                const today = new Date();
                let formattedDate;
                
                if (date.toDateString() === today.toDateString()) {
                    formattedDate = 'Today';
                } else {
                    formattedDate = date.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                }

                let uvText = 'N/A';
                let bgColor = 'gray';
                var uvIndexText = "";
                var textColor = "gray";
                if (uvIndex !== null) {
                    uvText = uvIndex.toFixed(1);
                    if (uvIndex < 3) {
                        uvIndexText = "Low";
                        textColor = "green";
                    } else if (uvIndex < 6) {
                        uvIndexText = "Moderate";
                        textColor = "#Fc9731";
                    } else if (uvIndex < 8) {
                        uvIndexText = "High";
                        textColor = "orange";
                    } else if (uvIndex < 11) {
                        uvIndexText = "Very High";
                        textColor = "red";
                    } else {
                        uvIndexText = "Extreme";
                        textColor = "purple";
                    }
                }
                
                const dateElement = document.getElementById(`uv-index-${index}-date`);
                const uvIndexTextElement = document.getElementById(`uv-index-${index}-text`);
                const uvIndexUVIElement = document.getElementById(`uv-index-${index}-uvi`);
                if (dateElement) {
                    dateElement.textContent = formattedDate;
                }
                if (uvIndexTextElement) {
                    uvIndexTextElement.textContent = uvIndexText;
                }
                if (uvIndexUVIElement) {
                    uvIndexUVIElement.textContent = uvText;
                    uvIndexUVIElement.style.color = textColor; // Ensure text color is applied correctly
                }
                switchBackground(uvIndexElement, uvIndexText);
            }
        });
    }

    async function displayUVIndexes(targetTimes) {
        try {
            const { lat, lon } = await getGeolocation();
            const uvIndexes = await getUVIndexes(lat, lon, targetTimes);
            const indexDict = {}
            targetTimes.forEach((time, index) => {
                indexDict[time] = uvIndexes[index];
            });
            console.log("indexDict:", indexDict);
            updateUVIndexes(indexDict);
        } catch (error) {
            console.error(error);
            updateUVIndexes(new Array(targetTimes.length).fill(null));
        }
    }

    function switchBackground(element, uvIndexText) {
        switch(uvIndexText) {
            case "Low":
                element.style.backgroundImage = "url('Resource/bg_uv_green.png')";
                break;
            case "Moderate":
                element.style.backgroundImage = "url('Resource/bg_uv_yellow.png')";
                break;
            case "High":
                element.style.backgroundImage = "url('Resource/bg_uv_orange.png')";
                break;
            case "Very High":
                element.style.backgroundImage = "url('Resource/bg_uv_red.png')";
                break;
            case "Extreme":
                element.style.backgroundImage = "url('Resource/bg_uv_purple.png')";
                break;
            default:
                element.style.backgroundImage = "url('Resource/bg_uv_green.png')";
                break;
        }
    }

    function getNextWeekDates() {
        var dates = [];
        var today = new Date();

        for (var i = 0; i < 7; i++) {
            var nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);
            dates.push(nextDay);
        }

        return dates;
    }

    var weekDates = getNextWeekDates();
    weekDates.forEach(date => console.log(date.toDateString()));

    function getNextWeekNoonTimestamps() {
        var timestamps = [];
        for (var i = 0; i < 7; i++) {
            var date = new Date();
            date.setDate(date.getDate() + i);
            date.setHours(12, 0, 0, 0);
            timestamps.push(Math.floor(date.getTime() / 1000));
        }
        return timestamps;
    }
    var nextWeekNoonTimestamps = getNextWeekNoonTimestamps();
    console.log(nextWeekNoonTimestamps);



    displayUVIndexes(nextWeekNoonTimestamps);

    // Function to get the current UV index
    async function getCurrentUVIndex() {
        try {
            const { lat, lon } = await getGeolocation();
            const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=daily,minutely,hourly,alerts`);
            const data = await response.json();
            console.log(data);
            return data.current.uvi;
        } catch (error) {
            console.error('Error fetching current UV index:', error);
            return null;
        }
    }

    // Function to display the current UV index
    async function displayCurrentUVIndex() {
        try {
            const currentUVElement = document.getElementById('current-uv-index');
            if (currentUVElement) {
                currentUVElement.innerHTML = `
                <p>Current UV Index in:</p>
                <p>_</p>
                <p>Loading...</p>
                `;
            }
            const { lat, lon } = await getGeolocation();
            const currentUVIndex = await getCurrentUVIndex();
            console.log(lat, lon, currentUVIndex);
            
            if (currentUVElement) {
                if (currentUVIndex !== null) {
                    const locationName = await getLocationName(lat, lon);
                    const locationNameMain = document.getElementById('location-name');
                    if (locationNameMain) {
                        locationNameMain.textContent = locationName;
                    }
                    currentUVElement.innerHTML = `
                        <p>Current UV Index in</p>
                        <p>${locationName}:</p>
                        <p>${currentUVIndex.toFixed(1)}</p>
                    `;
                    const locationNameElement = document.getElementById('location-name');
                    if (locationNameElement) {
                        locationNameElement.textContent = locationName;
                    }
                } else {
                    currentUVElement.textContent = 'Current UV Index: Unavailable';
                }
            }
            const currentDateElement = document.getElementById('current-date');
            if (currentDateElement) {
                currentDateElement.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                
            }
            const currentDateMain = document.getElementById('current-date-main');
                if (currentDateMain) {
                    currentDateMain.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                }
            var uvIndexText = "";
            var uvIndexColor = "";
            if (currentUVIndex !== null) {
                if (currentUVIndex < 3) {
                    uvIndexText = "Low";
                    uvIndexColor = "green"; 
                } else if (currentUVIndex < 6) {
                    uvIndexText = "Moderate";
                    uvIndexColor = "yellow"; 
                } else if (currentUVIndex < 8) {
                    uvIndexText = "High";
                    uvIndexColor = "orange"; 
                } else if (currentUVIndex < 11) {
                    uvIndexText = "Very High";
                    uvIndexColor = "red"; 
                } else {
                    uvIndexText = "Extreme";
                    uvIndexColor = "purple"; 
                }
            }

            const currentUVIndex2Element = document.getElementById('current-uv-index-container');
            if (currentUVIndex2Element) {
                const currentUVIndex2UVIElement = document.getElementById('current-uv-index2-uvi');
                currentUVIndex2UVIElement.innerHTML = `${currentUVIndex.toFixed(1)} `;
                currentUVIndex2UVIElement.style.color = uvIndexColor; 
                const uvIndexTextElement = document.getElementById('current-uv-index-text');
                if (uvIndexTextElement) {
                    uvIndexTextElement.textContent = uvIndexText;
                    
                }
                switchBackground(currentUVIndex2Element, uvIndexText);
            }
        } catch (error) {
            console.error('Error displaying current UV index:', error);
            const currentUVElement = document.getElementById('current-uv-index');
            if (currentUVElement) {
                currentUVElement.textContent = 'Unable to fetch location and UV index';
            }
        }
    }
    async function getLocationName(lat, lon) {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();
        return data.address?.city || data.address?.town || data.address?.village || 'Unknown Location';
    }

    // Call the function to display the current UV index
    displayCurrentUVIndex();

    // Update the current UV index every 5 minutes
    setInterval(displayCurrentUVIndex, 5 * 60 * 1000);
});