// Navigate to Task Page
function startTask(taskNumber) {
    window.location.href = `task${taskNumber}.html`;
}

// Mark Task as Completed
function completeTask(taskNumber) {
    localStorage.setItem(`task${taskNumber}`, "completed");
    alert(`Task ${taskNumber} marked as completed!`);
}

// Check Task Status on Load
function checkTaskStatus() {
    for (let i = 1; i <= 3; i++) {
        if (localStorage.getItem(`task${i}`) === "completed") {
            document.getElementById(`task${i}Status`).textContent = "✅";
        }
    }
    checkAllTasksCompleted();
}

// Enable Submit Button if All Tasks are Completed
function checkAllTasksCompleted() {
    let allCompleted = true;
    for (let i = 1; i <= 3; i++) {
        if (localStorage.getItem(`task${i}`) !== "completed") {
            allCompleted = false;
            break;
        }
    }
    let submitButton = document.getElementById("submitButton");
    if (allCompleted) {
        submitButton.textContent = "Completed";
        submitButton.classList.add("completed");
        submitButton.disabled = true;
    }
}

// Run check when on index.html
if (window.location.pathname.includes("index.html")) {
    checkTaskStatus();
}
