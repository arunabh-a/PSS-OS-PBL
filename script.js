let processes = []; // Array to store process objects
let readyQueue = []; // Array to store processes ready for execution
let timeline = 0; // Simulation timeline
let intervalId = null; // Interval ID for simulation
let simulationRunning = false; // Flag to track simulation state

// Function to add processes from input
function addProcesses() {
    const input = document.getElementById("process-input").value.trim();
    if (input === "") return;

    const processList = input.split(",");

    processes = processList.map((process, index) => {
        const [name, arrivalTime, burstTime, priority] = process.trim().split(" ");
        return {
            id: index + 1,
            name: name.trim(),
            arrivalTime: parseInt(arrivalTime.trim()),
            burstTime: parseInt(burstTime.trim()),
            priority: parseInt(priority.trim())
        };
    });

    updateReadyQueue();
    console.log("Processes added:", processes);
}

// Function to start simulation based on selected algorithm
function startSimulation() {
    if (simulationRunning) return;

    const selectedAlgorithm = document.getElementById("algorithm-select").value;
    simulationRunning = true;

    switch (selectedAlgorithm) {
        case "fcfs":
            intervalId = setInterval(runFCFS, 1000);
            break;
        case "round-robin":
            intervalId = setInterval(runRoundRobin, 1000);
            break;
        case "sjf":
            intervalId = setInterval(runSJF, 1000);
            break;
        case "priority":
            intervalId = setInterval(runPriorityScheduling, 1000);
            break;
        default:
            console.log("Unknown algorithm selected.");
            break;
    }
}

// Function to reset simulation
function resetSimulation() {
    clearInterval(intervalId);
    timeline = 0;
    simulationRunning = false;
    clearVisualization();
    processes = [];
    readyQueue = [];
    document.getElementById("process-input").value = "";
    document.getElementById("ready-queue").innerHTML = "";
}

// FCFS (First-Come, First-Served) algorithm
function runFCFS() {
    if (readyQueue.length === 0 && processes.length === 0) {
        clearInterval(intervalId);
        simulationRunning = false;
        return;
    }

    if (readyQueue.length === 0 && processes.length > 0) {
        updateReadyQueue();
    }

    const currentProcess = readyQueue.shift();
    const processEndTime = timeline + currentProcess.burstTime;

    visualize(currentProcess, timeline, processEndTime);

    timeline = processEndTime;
}

// Round Robin algorithm
function runRoundRobin() {
    if (readyQueue.length === 0 && processes.length === 0) {
        clearInterval(intervalId);
        simulationRunning = false;
        return;
    }

    if (readyQueue.length === 0 && processes.length > 0) {
        updateReadyQueue();
    }

    const quantum = 2; // Time quantum for Round Robin
    const currentProcess = readyQueue.shift();

    if (currentProcess.remainingTime > quantum) {
        visualize(currentProcess, timeline, timeline + quantum);
        currentProcess.remainingTime -= quantum;
        timeline += quantum;
        readyQueue.push(currentProcess); // Push back to the queue
    } else {
        visualize(currentProcess, timeline, timeline + currentProcess.remainingTime);
        timeline += currentProcess.remainingTime;
    }
}

// SJF (Shortest Job First) algorithm
function runSJF() {
    if (readyQueue.length === 0 && processes.length === 0) {
        clearInterval(intervalId);
        simulationRunning = false;
        return;
    }

    if (readyQueue.length === 0 && processes.length > 0) {
        updateReadyQueue();
    }

    readyQueue.sort((a, b) => a.burstTime - b.burstTime);
    const currentProcess = readyQueue.shift();
    const processEndTime = timeline + currentProcess.burstTime;

    visualize(currentProcess, timeline, processEndTime);

    timeline = processEndTime;
}

// Priority Scheduling algorithm
function runPriorityScheduling() {
    if (readyQueue.length === 0 && processes.length === 0) {
        clearInterval(intervalId);
        simulationRunning = false;
        return;
    }

    if (readyQueue.length === 0 && processes.length > 0) {
        updateReadyQueue();
    }

    readyQueue.sort((a, b) => a.priority - b.priority);
    const currentProcess = readyQueue.shift();
    const processEndTime = timeline + currentProcess.burstTime;

    visualize(currentProcess, timeline, processEndTime);

    timeline = processEndTime;
}

// Function to update the ready queue with processes that have arrived
function updateReadyQueue() {
    const arrivedProcesses = processes.filter(process => process.arrivalTime <= timeline);
    processes = processes.filter(process => process.arrivalTime > timeline);

    arrivedProcesses.forEach(process => {
        process.remainingTime = process.burstTime; // Reset remaining time for Round Robin
        readyQueue.push(process);
    });

    // Sort by arrival time (FCFS)
    readyQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Update ready queue visualization
    renderReadyQueue();
}

// Function to visualize process in Gantt chart
function visualize(process, startTime, endTime) {
    const ganttChart = document.getElementById("gantt-chart");

    const ganttBar = document.createElement("div");
    ganttBar.classList.add("gantt-bar");
    ganttBar.style.width = `${(endTime - startTime) * 40}px`;
    ganttBar.style.backgroundColor = getRandomColor();
    ganttBar.textContent = process.name;

    ganttChart.appendChild(ganttBar);
}

// Function to clear Gantt chart
function clearVisualization() {
    const ganttChart = document.getElementById("gantt-chart");
    ganttChart.innerHTML = "";
}

// Helper function to generate random color
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to render ready queue
function renderReadyQueue() {
    const readyQueueContainer = document.getElementById("ready-queue");
    readyQueueContainer.innerHTML = "";

    readyQueue.forEach(process => {
        const processElement = document.createElement("div");
        processElement.classList.add("ready-process");
        processElement.textContent = `${process.name} (AT:${process.arrivalTime}, BT:${process.burstTime}, P:${process.priority})`;
        readyQueueContainer.appendChild(processElement);
    });
}
