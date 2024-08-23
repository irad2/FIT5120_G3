const apiKey = "apikey"
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
    function updateUVIndexes(uvIndexes) {
        uvIndexes.forEach((uvIndex, index) => {
            const uvIndexElement = document.getElementById(`uv-index-${index}`);

            if (uvIndex !== null && uvIndexElement !== null) {
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
                if (uvIndexElement) uvIndexElement.textContent = 'N/A';
            }
        });
    }

    async function displayUVIndexes(targetTimes) {
        try {
            const { lat, lon } = await getGeolocation();
            const uvIndexes = await getUVIndexes(lat, lon, targetTimes);
            console.log("UVIs:", uvIndexes)
            updateUVIndexes(uvIndexes);
        } catch (error) {
            console.error(error);
            updateUVIndexes(new Array(targetTimes.length).fill(null));
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
});