document.addEventListener("DOMContentLoaded", function() {
    // Calculate Tahajjud Time
    function calculateTahajjudTime() {
        const maghribTime = document.getElementById("maghrib").value;
        const fajrTime = document.getElementById("fajr").value;

        if (!maghribTime || !fajrTime) {
            alert("Please enter both Maghrib and Fajr times.");
            return;
        }

        const maghribDate = new Date(`1970-01-01T${maghribTime}:00`);
        const fajrDate = new Date(`1970-01-02T${fajrTime}:00`);

        const nightDuration = (fajrDate - maghribDate); // Duration of the night in milliseconds
        const tahajjudStart = new Date(maghribDate.getTime() + (nightDuration * 2 / 3));
        const result = tahajjudStart.toTimeString().substring(0, 5);
        document.getElementById("result").textContent = result;
        document.getElementById("result").style.color = getComputedStyle(document.body).color; // Set the time color

        // Schedule notification for Tahajjud time
        scheduleTahajjudAlarm(result);
    }

    // Get user's location using Geolocation API
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(fetchPrayerTimes, handleLocationError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    // Handle geolocation error
    function handleLocationError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }

    // Fetch prayer times based on user's location
    function fetchPrayerTimes(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`)
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    displayPrayerTimes(data.data.timings);
                } else {
                    alert("Failed to fetch prayer times.");
                }
            })
            .catch(error => console.error("Error fetching prayer times:", error));
    }

    // Display prayer times
    function displayPrayerTimes(prayerTimes) {
        const prayerTimesContainer = document.querySelector(".prayer-times-container");
        prayerTimesContainer.innerHTML = "";

        for (const prayer in prayerTimes) {
            if (prayerTimes.hasOwnProperty(prayer)) {
                const prayerTimeDiv = document.createElement("div");
                prayerTimeDiv.classList.add("prayer-time");

                const prayerNameHeading = document.createElement("h3");
                prayerNameHeading.textContent = prayer;

                const prayerTimeText = document.createElement("p");
                prayerTimeText.textContent = prayerTimes[prayer];

                prayerTimeDiv.appendChild(prayerNameHeading);
                prayerTimeDiv.appendChild(prayerTimeText);

                prayerTimesContainer.appendChild(prayerTimeDiv);
            }
        }
    }

    // Schedule notification for Tahajjud time
    function scheduleTahajjudAlarm(tahajjudTime) {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications.");
            return;
        }

        if (Notification.permission !== "granted") {
            Notification.requestPermission().then(function(permission) {
                if (permission === "granted") {
                    scheduleNotification(tahajjudTime);
                } else {
                    alert("Notification permission denied.");
                }
            });
        } else {
            scheduleNotification(tahajjudTime);
        }
    }

    function scheduleNotification(tahajjudTime) {
        const now = new Date();
        const tahajjudDateTime = new Date();
        tahajjudDateTime.setHours(tahajjudTime.substring(0, 2));
        tahajjudDateTime.setMinutes(tahajjudTime.substring(3, 5));
        tahajjudDateTime.setSeconds(0);

        if (tahajjudDateTime < now) {
            tahajjudDateTime.setDate(now.getDate() + 1); // Schedule for next day
        }

        const delay = tahajjudDateTime.getTime() - now.getTime();

        if (delay > 0) {
            setTimeout(function() {
                showNotification("Tahajjud Time", "It's time for Tahajjud prayer!");
            }, delay);
        } else {
            console.error("Scheduled time is in the past");
        }
    }

    // Show notification
    function showNotification(title, body) {
        new Notification(title, { body: body });
    }

    // Share Tahajjud Time
    function shareTahajjudTime() {
        const tahajjudTime = document.getElementById("result").textContent;
        const shareText = `The Tahajjud time is ${tahajjudTime}. This time was calculated using dontmisstahajjud.netlify.app`;

        const tempInput = document.createElement("input");
        tempInput.value = shareText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        alert("Tahajjud Time copied to clipboard: " + shareText);
    }

    // Set notification time
    function setNotification() {
        const notificationTime = document.getElementById("notification-time").value;
        if (notificationTime) {
            scheduleTahajjudAlarm(notificationTime);
            alert(`Notification set for: ${notificationTime}`);
        } else {
            alert("Please enter a valid time for the notification.");
        }
    }

    // Submit feedback
    function submitFeedback() {
        const feedbackMessage = document.getElementById("feedback-message").value;
        alert(`Feedback submitted: ${feedbackMessage}`);
    }

    // Event listeners
    document.getElementById("calculate-button").addEventListener("click", calculateTahajjudTime);
    document.getElementById("fetch-prayer-times-button").addEventListener("click", getLocation);
    document.getElementById("share-button").addEventListener("click", shareTahajjudTime);
    document.getElementById("set-notification-button").addEventListener("click", setNotification);
    document.getElementById("submit-feedback-button").addEventListener("click", submitFeedback);

    // Dark mode toggle
    const darkModeToggle = document.getElementById("dark-mode-toggle-checkbox");
    darkModeToggle.addEventListener("change", function() {
        document.body.classList.toggle("dark-mode", darkModeToggle.checked);
        localStorage.setItem("darkMode", darkModeToggle.checked);
    });

    // Request notification permission on page load
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // Check for dark mode preference
    if (localStorage.getItem("darkMode") === "true") {
        darkModeToggle.checked = true;
        document.body.classList.add("dark-mode");
    }
});

function shareTahajjudTime() {
    const tahajjudTime = document.getElementById("result").textContent;
    const shareText = `The Tahajjud time is ${tahajjudTime}. This time was calculated using dontmisstahajjud.netlify.app`;

    const tempInput = document.createElement("input");
    tempInput.value = shareText;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    alert("Tahajjud Time copied to clipboard: " + shareText);
}
