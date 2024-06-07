document.addEventListener("DOMContentLoaded", function() {
    // Calculate Tahajjud Time
    function calculateTahajjudTime() {
        const maghribTime = document.getElementById("maghrib").value;
        const fajrTime = document.getElementById("fajr").value;

        if (!maghribTime || !fajrTime) {
            alert("Please enter both Maghrib and Fajr times.");
            return;
        }

        const maghribDate = new Date(`1970-01-01T${maghribTime}:00Z`);
        const fajrDate = new Date(`1970-01-02T${fajrTime}:00Z`);

        const nightDuration = (fajrDate - maghribDate);
        const tahajjudStart = new Date(maghribDate.getTime() + (nightDuration * 2 / 3));
        const result = tahajjudStart.toISOString().substring(11, 16);
        document.getElementById("result").textContent = result;
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
        const prayerTimesDiv = document.getElementById("prayer-times");
        prayerTimesDiv.innerHTML = "<h2>Prayer Times</h2>";

        for (const prayer in prayerTimes) {
            if (prayerTimes.hasOwnProperty(prayer)) {
                prayerTimesDiv.innerHTML += `<p>${prayer}: ${prayerTimes[prayer]}</p>`;
            }
        }
    }

    // Schedule notification for Tahajjud time
    function scheduleTahajjudAlarm(tahajjudTime) {
        const now = new Date();
        const tahajjudDateTime = new Date(`1970-01-01T${tahajjudTime}:00Z`);
        
        const delay = tahajjudDateTime - now;

        if (delay > 0) {
            setTimeout(function() {
                showNotification("Tahajjud Time", "It's time for Tahajjud prayer!");
            }, delay);
        }
    }

    // Show notification
    function showNotification(title, body) {
        if (Notification.permission === "granted") {
            new Notification(title, { body: body });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(function(permission) {
                if (permission === "granted") {
                    new Notification(title, { body: body });
                }
            });
        }
    }

    // Share Tahajjud Time
    function shareTahajjudTime() {
        const tahajjudTime = document.getElementById("result").textContent;
        alert(`Tahajjud Time is: ${tahajjudTime}`);
    }

    // Set notification time
    function setNotification() {
        const notificationTime = document.getElementById("notification-time").value;
        alert(`Notification set for: ${notificationTime}`);
    }

    // Submit feedback
    function submitFeedback() {
        const feedbackMessage = document.getElementById("feedback-message").value;
        alert(`Feedback submitted: ${feedbackMessage}`);
    }

    // Event listeners
    document.querySelector("button[onclick='calculateTahajjudTime()']").addEventListener("click", calculateTahajjudTime);
    document.querySelector("button[onclick='getLocation()']").addEventListener("click", getLocation);
    document.querySelector("button[onclick='shareTahajjudTime()']").addEventListener("click", shareTahajjudTime);
    document.querySelector("button[onclick='setNotification()']").addEventListener("click", setNotification);
    document.querySelector("button[onclick='submitFeedback()']").addEventListener("click", submitFeedback);

    // Dark mode toggle
    const darkModeToggle = document.getElementById("dark-mode-toggle-checkbox");
    darkModeToggle.addEventListener("change", function() {
        document.body.classList.toggle("dark-mode", darkModeToggle.checked);
    });

    // Request notification permission on page load
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
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
// Dark mode toggle
const darkModeToggle = document.getElementById("dark-mode-toggle-checkbox");
darkModeToggle.addEventListener("change", function() {
    document.body.classList.toggle("dark-mode", darkModeToggle.checked);
    localStorage.setItem("darkMode", darkModeToggle.checked);
});

// Check for dark mode preference
if (localStorage.getItem("darkMode") === "true") {
    darkModeToggle.checked = true;
    document.body.classList.add("dark-mode");
}
