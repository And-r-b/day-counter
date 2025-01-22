let saveEl = document.getElementById("save-el");
let countEl = document.getElementById("count-el");
let incrementBtn = document.getElementById("increment-btn");
let timerDisplay = document.getElementById("timer-display");
let count = 0;

// Load saved data and cooldown state
function loadSavedData() {
    const savedCount = localStorage.getItem("count");
    const savedEntries = localStorage.getItem("entries");
    const cooldownEndTime = localStorage.getItem("cooldownEndTime");

    // Initialize saved count and entries
    if (savedCount !== null) {
        count = parseInt(savedCount, 10);
        countEl.textContent = count;
    }
    if (savedEntries !== null) {
        saveEl.textContent = `Previous entries: ${savedEntries}`;
    }

    // Check if the cooldown is still active
    if (cooldownEndTime !== null) {
        const now = new Date().getTime();
        const remainingTime = parseInt(cooldownEndTime, 10) - now;
        if (remainingTime > 0) {
            startCooldown(remainingTime);
        }
    }
}

// Increment function
function increment() {
    count += 1;
    countEl.textContent = count;
    localStorage.setItem("count", count); // Save the updated count to localStorage
}

// Save function
function save() {
    let countStr = count + " - ";
    saveEl.textContent += countStr;
    localStorage.setItem("entries", saveEl.textContent.replace("Previous entries: ", "").trim()); // Save entries to localStorage
    count = 0;
    countEl.textContent = 0;
    localStorage.setItem("count", count); // Reset the count in localStorage
}

// Cooldown function
function startCooldown(duration = 86400000) { // 86,400,000 Milliseconds = 24 Hours
    const interval = 1000; // Update interval (1 second)
    incrementBtn.disabled = true;
    const cooldownEndTime = new Date().getTime() + duration;
    localStorage.setItem("cooldownEndTime", cooldownEndTime); // Save the cooldown end time

    // Update the cooldown timer every second
    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const remainingTime = cooldownEndTime - now;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = ""; // Clear the timer display
            incrementBtn.disabled = false;
            incrementBtn.textContent = "INCREMENT";
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
        }
    }, interval);
}

// Attach the cooldown to the button's click
incrementBtn.addEventListener("click", () => startCooldown());

// Load data when the page is loaded
loadSavedData();
