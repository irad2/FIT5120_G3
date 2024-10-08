document.addEventListener("DOMContentLoaded", async() => {
    // Function to fetch API key
    async function fetchApiKey() {
        try {
            const response = await fetch('/get-api-key');
            const data = await response.json();
            return data.apiKey;
        } catch (error) {
            console.error("Failed to fetch API key:", error);
            return null; // Return null in case of an error
        }
    }

    // Store the API key in a variable
    const apiKey = await fetchApiKey();
    if (!apiKey) {
        console.error('API Key is not available, functionality will be limited.');
        return; // Early return if API Key couldn't be fetched
    }


    async function getGeolocation() {
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
    async function getUVIndexes(lat, lon, targetDates) {
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
    async function updateUVIndexes(indexDict) {
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
                <p>
                Location,CurrentUV:Loading...</p>

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
                        <p>${locationName},CurrentUV:${currentUVIndex.toFixed(1)}</p>
                    `;
                    const locationNameElement = document.getElementById('location-name');
                    if (locationNameElement) {
                        locationNameElement.textContent = locationName;
                    }
                } else {
                    currentUVElement.innerHTML = `
                    <p> Current UVI Unavailable</p>
                    `;
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
                currentUVElement.innerHTML = `
                <p>Unable to fetch location</p> 
                <p>and UV index</p>
                `;
            }
        }
    }

    async function displayCurrentUVI() {
        try {
            const currentUVElement = document.getElementById('cur-uv');
            const levelElement = document.getElementById('box-level-1');
            const boxElement = document.getElementById('current-uv-box');
            const numElement = document.getElementById('num-1');

            if (!currentUVElement || !levelElement || !boxElement || !numElement) {
                console.error('UI element for displaying current UV index or level not found');
                return;
            }
            const currentUVIndex = await getCurrentUVIndex();
            if (currentUVIndex !== null) {
                currentUVElement.textContent = currentUVIndex.toFixed(1);
                let bgImagePath;
                let textColor;
                if (currentUVIndex < 3) {
                    levelElement.textContent = 'Low';
                    bgImagePath = "Resource/bg_uv_green.png";
                    textColor = "#3EA72D";
                } else if (currentUVIndex < 6) {
                    levelElement.textContent = 'Moderate';
                    bgImagePath = "Resource/bg_uv_yellow.png";
                    textColor = "#FFF300";
                } else if (currentUVIndex < 8) {
                    levelElement.textContent = 'High';
                    bgImagePath = "Resource/bg_uv_orange.png";
                    textColor = "#F18B00";
                } else if (currentUVIndex < 11) {
                    levelElement.textContent = 'Very High';
                    bgImagePath = "Resource/bg_uv_red.png";
                    textColor = "#E53210";
                } else {
                    levelElement.textContent = 'Extreme';
                    bgImagePath = "Resource/bg_uv_purple.png";
                    textColor = "#B567A4";
                }
                boxElement.style.backgroundImage = `url('${bgImagePath}')`;
                currentUVElement.style.color = textColor;
            } else {
                currentUVElement.textContent = 'NA';
                levelElement.textContent = 'NA';
                boxElement.style.backgroundImage = "url('Resource/bg_uv_green.png')";
                currentUVElement.style.color = "#000000";
            }
        } catch (error) {
            console.error('Error displaying current UV index:', error);
        }
    }

    async function displayTodaysUV() {
        try {
            const { lat, lon } = await getGeolocation();
            const tdUVElement = document.getElementById('td-uv');
            const tdLevelElement = document.getElementById('box-level-td');
            const tdBoxElement = document.getElementById('td-uv-box');

            if (!tdUVElement || !tdLevelElement || !tdBoxElement) {
                console.error('UI element for displaying today\'s UV not found');
                return;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const dailyUVIndex = await getUVIndexes(lat, lon, [today.getTime() / 1000]);

            if (dailyUVIndex[0] === null) {
                tdUVElement.textContent = 'NA';
                tdLevelElement.textContent = 'NA';
                tdBoxElement.style.backgroundImage = "url('Resource/bg_uv_green.png')";
                tdUVElement.style.color = "#000000";
            } else {
                const uvIndex = dailyUVIndex[0];
                tdUVElement.textContent = uvIndex.toFixed(1);
                let bgImagePath;
                let textColor;
                if (uvIndex < 3) {
                    tdLevelElement.textContent = 'Low';
                    bgImagePath = "Resource/bg_uv_green.png";
                    textColor = "#94d768";
                } else if (uvIndex < 6) {
                    tdLevelElement.textContent = 'Moderate';
                    bgImagePath = "Resource/bg_uv_yellow.png";
                    textColor = "#F6ca5c";
                } else if (uvIndex < 8) {
                    tdLevelElement.textContent = 'High';
                    bgImagePath = "Resource/bg_uv_orange.png";
                    textColor = "#f0965a";
                } else if (uvIndex < 11) {
                    tdLevelElement.textContent = 'Very High';
                    bgImagePath = "Resource/bg_uv_red.png";
                    textColor = "#eb473d";
                } else {
                    tdLevelElement.textContent = 'Extreme';
                    bgImagePath = "Resource/bg_uv_purple.png";
                    textColor = "#8455f6";
                }
                tdBoxElement.style.backgroundImage = `url('${bgImagePath}')`;
                tdUVElement.style.color = textColor;
            }
        } catch (error) {
            console.error('Error displaying today\'s UV data:', error);
        }
    }
    async function displayTomorrowsUV() {
        try {
            const { lat, lon } = await getGeolocation();

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const dailyUVIndex = await getUVIndexes(lat, lon, [tomorrow.getTime() / 1000]);

            const boxLevelElement = document.getElementById('trm-uv');
            if (dailyUVIndex[0] === null) {
                boxLevelElement.textContent = 'NA';
            } else {
                const uvIndex = dailyUVIndex[0];
                let boxLevelText;
                if (uvIndex < 3) {
                    boxLevelText = 'Low';
                } else if (uvIndex < 6) {
                    boxLevelText = 'Moderate';
                } else if (uvIndex < 8) {
                    boxLevelText = 'High';
                } else if (uvIndex < 11) {
                    boxLevelText = 'Very High';
                } else {
                    boxLevelText = 'Extreme';
                }
                boxLevelElement.textContent = boxLevelText;
            }
        } catch (error) {
            console.error("Error fetching tomorrow's UV data:", error);
        }
    }


    function getNextThreeDays() {
        let dates = [];
        for (let i = 1; i <= 3; i++) {
            let date = new Date();
            date.setDate(date.getDate() + i);
            dates.push(Math.floor(date.setHours(0, 0, 0, 0) / 1000));
        }
        return dates;
    }
    async function displayNextThreeDaysUV() {
        try {
            const { lat, lon } = await getGeolocation();
            const nextDays = getNextThreeDays();
            const uvIndexes = await getUVIndexes(lat, lon, nextDays);

            uvIndexes.forEach((uvIndex, i) => {
                const dayElement = document.getElementById(`day${i+1}-uv`);
                const levelElement = document.getElementById(`box-level-d${i+1}`);
                const boxElement = document.getElementById(`forecast-${i+1}`);
                const dateElement = document.getElementById(`date${i+1}`);

                if (!dayElement || !levelElement || !boxElement || !dateElement) {
                    console.error(`UI element for displaying day ${i+1}'s UV not found`);
                    return;
                }

                const date = new Date(nextDays[i] * 1000);
                const options = { weekday: 'long', month: 'short', day: 'numeric' };
                dateElement.textContent = date.toLocaleDateString('en-US', options);

                if (uvIndex === null) {
                    dayElement.textContent = 'NA';
                    levelElement.textContent = 'NA';
                    boxElement.style.backgroundImage = "url('Resource/bg_uv_green.png')";
                    dayElement.style.color = "#000000";
                } else {
                    dayElement.textContent = uvIndex.toFixed(1);
                    let bgImagePath;
                    let textColor;


                    if (uvIndex < 3) {
                        levelElement.textContent = 'Low';
                        bgImagePath = "Resource/bg_uv_green.png";
                        textColor = "#94d768";
                    } else if (uvIndex < 6) {
                        levelElement.textContent = 'Moderate';
                        bgImagePath = "Resource/bg_uv_yellow.png";
                        textColor = "#F6ca5c";
                    } else if (uvIndex < 8) {
                        levelElement.textContent = 'High';
                        bgImagePath = "Resource/bg_uv_orange.png";
                        textColor = "#f0965a";
                    } else if (uvIndex < 11) {
                        levelElement.textContent = 'Very High';
                        bgImagePath = "Resource/bg_uv_red.png";
                        textColor = "#eb473d";
                    } else {
                        levelElement.textContent = 'Extreme';
                        bgImagePath = "Resource/bg_uv_purple.png";
                        textColor = "#8455f6";
                    }
                    boxElement.style.backgroundImage = `url('${bgImagePath}')`;
                    dayElement.style.color = textColor;
                }
            });
        } catch (error) {
            console.error('Error displaying next three days UV data:', error);
        }
    }

    async function getLocationName(lat, lon) {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();
        return data.address.city || data.address.town || data.address.village || 'Unknown Location';
    }



    displayCurrentUVIndex();
    displayCurrentUVI();
    displayTodaysUV();
    displayTomorrowsUV();
    displayNextThreeDaysUV();
    setInterval(displayCurrentUVIndex, 5 * 60 * 1000);
});