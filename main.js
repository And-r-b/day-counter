// Hide the preloader after the page loads
window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");

    // Add a slight delay and then fade out
    setTimeout(() => {
        preloader.classList.add("hidden"); // Add 'hidden' class for fade-out
        document.body.classList.remove("loading"); // Allow scrolling
    }, 1000); // Keep the preloader visible for 1 second after the page loads
});

// Sidebar toggle function
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("sidebar-toggle");

    sidebar.classList.toggle("open");

    // Change button icon based on sidebar state
    if (sidebar.classList.contains("open")) {
        toggleButton.innerHTML = "&#10006;"; // 'X' icon
    } else {
        toggleButton.innerHTML = "&#9776;"; // '☰' (hamburger) icon
    }
}

// Ask for permission to show notifications
function requestNotificationPermission() {
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
            }
        });
    }
}

requestNotificationPermission();

// Close sidebar when clicking outside of it
document.addEventListener("click", function (event) {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("sidebar-toggle");

    if (sidebar.classList.contains("open") && !sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
        toggleSidebar();
    }
});

// Nickname saving and displaying logic
document.addEventListener("DOMContentLoaded", function () {
    const nicknameInput = document.getElementById("nickname-input");
    const saveNicknameBtn = document.getElementById("save-nickname-btn");
    const nicknameContainer = document.getElementById("nickname-container");
    const removeNicknameBtn = document.getElementById("remove-nickname-btn");

    // Load the saved nickname from localStorage
    const savedNickname = localStorage.getItem("nickname");
    if (savedNickname) {
        nicknameContainer.innerHTML = `<p><b>Welcome, ${savedNickname}!</b></p>`;
        nicknameInput.style.display = "none"; // Hide input after saving
        saveNicknameBtn.style.display = "none"; // Hide save button
        removeNicknameBtn.style.display = "block"; // Show the remove button
    }

    // Save nickname when the button is clicked
    saveNicknameBtn.addEventListener("click", function () {
        const nickname = nicknameInput.value.trim();
        if (nickname !== "") {
            localStorage.setItem("nickname", nickname); // Save nickname in localStorage
            nicknameContainer.innerHTML = `<p><b>Welcome, ${nickname}!</b></p>`; // Show welcome message
            nicknameInput.style.display = "none"; // Hide input field
            saveNicknameBtn.style.display = "none"; // Hide save button
            removeNicknameBtn.style.display = "block"; // Show the remove button
        }
    });

    //remove nickname when the remove button is clicked
    removeNicknameBtn.addEventListener("click", function() {
        // Remove nickname from localStorage
        localStorage.removeItem("nickname");

        // Clear nickname in the UI
        nicknameContainer.innerHTML = "";
        nicknameInput.style.display = "block";
        saveNicknameBtn.style.display = "block";
        removeNicknameBtn.style.display = "none";
    })
});

document.addEventListener("DOMContentLoaded", function () {
    const changeThemeBtn = document.getElementById("change-theme-btn");

    // Array of background images
    const backgroundImages = [
        "url('crater.png')", // background 1
        "url('view.jpg')", // background 2
        "url('sunsettingview.jpg')" , // background 3
        "url('nightview.jpg')", // background 4
        "url('castleview.jpg')", // background 5
        "url('landscapeview.jpg')", // background 6
        "url('castleriverview.jpg')", // background 7
    ];

    let currentThemeIndex = 0; // Start with the first background image

    // Function to change background theme
    function changeBackgroundTheme() {
        // Cycle through the images
        currentThemeIndex = (currentThemeIndex + 1) % backgroundImages.length;

        // Apply the new background image to the .container element
        const container = document.querySelector('.container');
        container.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), ${backgroundImages[currentThemeIndex]}`;

        // Optionally, store the theme in localStorage
        localStorage.setItem("selectedTheme", currentThemeIndex);
    }

    // Event listener for the "Change Theme" button
    changeThemeBtn.addEventListener("click", changeBackgroundTheme);

    // Load the previously selected theme from localStorage (if any)
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme !== null) {
        currentThemeIndex = parseInt(savedTheme, 10);
        const container = document.querySelector('.container');
        container.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), ${backgroundImages[currentThemeIndex]}`;
    }
});

document.getElementById("change-time-format").addEventListener("click", function() {
    // Retrieve and convert the stored format preference (default to HH:MM:SS)
    let isHHMMSS = localStorage.getItem("isHHMMSS");

    if (isHHMMSS === null) {
        isHHMMSS = true; // Default to HH:MM:SS if nothing is stored
    } else {
        isHHMMSS = isHHMMSS === "true"; // Convert from string to boolean
    }

    // Toggle the format
    isHHMMSS = !isHHMMSS;

    // Save the new format setting
    localStorage.setItem("isHHMMSS", isHHMMSS.toString());

    // Update the displayed timer with the new format
    updateTimerDisplay();
});


// Toggle submenu visibility when clicking "Settings"
document.querySelectorAll('.submenu-parent > a').forEach(function(menuItem) {
    menuItem.addEventListener('click', function(e) {
        e.preventDefault();
        const parent = this.parentElement;
        parent.classList.toggle('active');  // Toggling the 'active' class to show submenu
    });
});

// let variables for getting ids and others
let saveEl = document.getElementById("save-el");
let countEl = document.getElementById("count-el");
let incrementBtn = document.getElementById("increment-btn");
let timerDisplay = document.getElementById("timer-display");
let resetBtn = document.getElementById("reset-btn");
let count = 0;
let timerInterval; // Declare a variable to hold the timer interval
let isMissedDay = false; // New flag to track if the user has missed a day

// Load saved data and cooldown state
function loadSavedData() {
    const savedCount = localStorage.getItem("count");
    const savedEntries = localStorage.getItem("entries");
    const savedHighScore = localStorage.getItem("highScore");
    const cooldownEndTime = localStorage.getItem("cooldownEndTime");
    const lastActionTime = localStorage.getItem("lastActionTime");

    //  Ensure a default time format is set (HH:MM:SS as default)
    if (localStorage.getItem("isHHMMSS") === null) {
        localStorage.setItem("isHHMMSS", "true");  // Default to HH:MM:SS
    }

    if (savedCount !== null) {
        count = parseInt(savedCount, 10);
        countEl.textContent = count;
    }
    if (savedEntries !== null) {
        saveEl.textContent = ` ${savedEntries}`;
    }
    if (savedHighScore !== null) {
        document.getElementById("highscore-el").textContent = `High Score: ${savedHighScore}`;
    }
    
    if (cooldownEndTime !== null) {
        const now = new Date().getTime();
        const remainingTime = parseInt(cooldownEndTime, 10) - now;
        if (remainingTime > 0) {
            startCooldown(remainingTime);
        }
    }

    updateTimerDisplay();  //  Update the timer with the correct format
}

// Show message if a day is missed
function showMissedDayMessage() {
    const missedDayMessage = "You have missed a day, try again!";
    timerDisplay.textContent = missedDayMessage;
    incrementBtn.disabled = true;
    incrementBtn.textContent = "ADD DAY";

    // Disable the "Try Again" button and change it to "Start Over"
    document.getElementById("save-btn").textContent = "TRY AGAIN";
    
    // Send a reminder notification before they miss the day
    const timeToMiss = 86400000 - (new Date().getTime() - parseInt(localStorage.getItem("lastActionTime"), 10));

    if (timeToMiss <= 3600000 && timeToMiss > 0) {
        new Notification("Reminder", {
            body: "You have 1 hour left to press ADD DAY before you miss a day"
        });
    }

    // Set the flag to indicate the user missed a day
    isMissedDay = true;
}

function updateTimerDisplay() {
    const lastActionTime = parseInt(localStorage.getItem("lastActionTime"), 10);
    const timeSinceLastAction = new Date().getTime() - lastActionTime;
    const timeToMiss = 86400000   - timeSinceLastAction;

    if (timeToMiss <= 0) {
        showMissedDayMessage();
    } else {
        const isHHMMSS = localStorage.getItem("isHHMMSS") === "true";  // Read stored format

        let formattedTime;
        if (isHHMMSS) {
            // Display "Cooldown" when in HH:MM:SS format
            const hours = Math.floor(timeToMiss / (1000 * 60 * 60));
            const minutes = Math.floor((timeToMiss % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeToMiss % (1000 * 60)) / 1000);
            formattedTime = `Cooldown: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            // Display "Time Left" when in MM:SS format
            const minutes = Math.floor(timeToMiss / (1000 * 60));
            const seconds = Math.floor((timeToMiss % (1000 * 60)) / 1000);
            formattedTime = `Time Left: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        timerDisplay.textContent = formattedTime;
    }
}

// Increment function
function increment() {
    if (isMissedDay) {
        // Don't allow incrementing if the day was missed
        return;
    }

    count += 1;
    countEl.textContent = count;
    localStorage.setItem("count", count); // Save the updated count to localStorage

    // Check for high score
    const savedHighScore = localStorage.getItem("highScore");
    if (savedHighScore === null || count > parseInt(savedHighScore, 10)) {
        localStorage.setItem("highScore", count); // Save new high score
        document.getElementById("highscore-el").textContent = `High Score: ${count}`;
    }

    // Save the current time to track the last action
    localStorage.setItem("lastActionTime", new Date().getTime());
}

// Save function (Try Again button)
function save() {
    if (isMissedDay) {
        // Handle missed day: Save the current count to previous entries before resetting
        if (count > 0) {
            let countStr = count + " - ";
            saveEl.textContent += countStr;

            // Save updated entries to localStorage
            localStorage.setItem(
                "entries",
                saveEl.textContent.replace("Previous entries: ", "").trim()
            );
        }

        // Reset only the current count and missed day flag
        count = 0;
        countEl.textContent = 0;
        localStorage.setItem("count", count); // Save reset count to localStorage
        timerDisplay.textContent = ""; // Clear the missed day message
        incrementBtn.disabled = false; // Re-enable the increment button
        incrementBtn.textContent = "ADD DAY"; // Reset the button text
        isMissedDay = false; // Clear the missed day flag
    } else {
        // Normal save operation: Append current count to previous entries
        if (count > 0) {
            let countStr = count + " - ";
            saveEl.textContent += countStr;

            // Save updated entries to localStorage
            localStorage.setItem(
                "entries",
                saveEl.textContent.replace("Previous entries: ", "").trim()
            );
        }

        // Reset count
        count = 0;
        countEl.textContent = 0;
        localStorage.setItem("count", count);
    }
}



// Cooldown function
function startCooldown(duration = 86400000  ) { // 86400000 24hrs
    const interval = 1000;
    incrementBtn.disabled = true;
    const cooldownEndTime = new Date().getTime() + duration;
    localStorage.setItem("cooldownEndTime", cooldownEndTime);

    timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const remainingTime = cooldownEndTime - now;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "";
            incrementBtn.disabled = false;
            incrementBtn.textContent = "ADD DAY";
            localStorage.removeItem("cooldownEndTime");
        } else {
            updateTimerDisplay();  //  Ensuring the correct format is displayed
        }
    }, interval);
}

// Reset function to clear all data with confirmation
function resetAll() {
    // Ask for confirmation before resetting
    const confirmation = confirm("Are you sure you want to reset? All progress will be lost.");
    if (confirmation) {
        // Clear localStorage
        localStorage.removeItem("count");
        localStorage.removeItem("entries");
        localStorage.removeItem("highScore");
        localStorage.removeItem("cooldownEndTime");
        localStorage.removeItem("lastActionTime");

        // Stop the timer if it's running
        if (timerInterval) {
            clearInterval(timerInterval);
        }

        // Reset the UI
        count = 0;
        countEl.textContent = count;
        saveEl.textContent = "Previous entries: ";
        document.getElementById("highscore-el").textContent = "High Score: 0";
        timerDisplay.textContent = "";
        incrementBtn.disabled = false;
        incrementBtn.textContent = "ADD DAY";

        // Reset the missed day flag
        isMissedDay = false;

        // Re-enable the "Try Again" button
        document.getElementById("save-btn").textContent = "TRY AGAIN";
    }
}

// Attach the cooldown to the button's click
incrementBtn.addEventListener("click", () => startCooldown());

// Attach the reset to the reset button's click
resetBtn.addEventListener("click", resetAll);

// Load data when the page is loaded
loadSavedData();

// Close sidebar when clicking outside of it
document.addEventListener("click", function (event) {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("sidebar-toggle");

    // Check if the sidebar is open and the click is outside the sidebar and toggle button
    if (sidebar.classList.contains("open") && !sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
        toggleSidebar(); // Close the sidebar
    }
});
