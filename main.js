// Hide the preloader after the page loads
window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");

    // Add a slight delay and then fade out
    setTimeout(() => {
        preloader.classList.add("hidden"); // Add 'hidden' class for fade-out
        document.body.classList.remove("loading"); // Allow scrolling
    }, 1000); // Keep the preloader visible for 1 second after the page loads
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

    // Initialize saved count and entries
    if (savedCount !== null) {
        count = parseInt(savedCount, 10);
        countEl.textContent = count;
    }
    if (savedEntries !== null) {
        saveEl.textContent = `Previous entries: ${savedEntries}`;
    }

    // Show high score
    if (savedHighScore !== null) {
        document.getElementById("highscore-el").textContent = `High Score: ${savedHighScore}`;
    }

    // Check if the cooldown is still active
    if (cooldownEndTime !== null) {
        const now = new Date().getTime();
        const remainingTime = parseInt(cooldownEndTime, 10) - now;
        if (remainingTime > 0) {
            startCooldown(remainingTime);
        }
    }

    // Check if a day has been missed (more than 24 hours since the last action)
    if (lastActionTime !== null) {
        const now = new Date().getTime();
        const timeSinceLastAction = now - parseInt(lastActionTime, 10);

        // If more than 24 hours have passed, show the missed day message
        if (timeSinceLastAction >= 90000000) { // 90000000 ms = 24hrs + 1 hr for grace period
            showMissedDayMessage();
        }
    }
}

// Show message if a day is missed
function showMissedDayMessage() {
    const missedDayMessage = "You have missed a day, try again!";
    timerDisplay.textContent = missedDayMessage;
    incrementBtn.disabled = true;
    incrementBtn.textContent = "ADD DAY";

    // Disable the "Try Again" button and change it to "Start Over"
    document.getElementById("save-btn").textContent = "TRY AGAIN";
    
    // Set the flag to indicate the user missed a day
    isMissedDay = true;
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
function startCooldown(duration = 86400000) {
    const interval = 1000; // Update interval (1 second)
    incrementBtn.disabled = true;
    const cooldownEndTime = new Date().getTime() + duration;
    localStorage.setItem("cooldownEndTime", cooldownEndTime); // Save the cooldown end time

    // Update the cooldown timer every second
    timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const remainingTime = cooldownEndTime - now;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = ""; // Clear the timer display
            incrementBtn.disabled = false;
            incrementBtn.textContent = "ADD DAY";
            localStorage.removeItem("cooldownEndTime"); // Remove the cooldown state
        } else {
            // Convert remaining time to hours, minutes, and seconds
            const hours = Math.floor(remainingTime / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

            // Format the time as HH:MM:SS
            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            timerDisplay.textContent = `Cooldown: ${formattedTime}`;
            timerDisplay.style.fontSize = "26px";
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
