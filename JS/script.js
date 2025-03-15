// Select DOM elements
let taskContainer = document.querySelector(".taskContainer");
let inputBtn = taskContainer.querySelector(".addTaskBtn");
let checkBoxContainer = document.getElementById('checkBoxContainer');
let tasksContainer = document.getElementById('tasksContainer');

// Global variables
let courses = [];
let apiKey = window.localStorage.getItem("theAPI");
const canvasUrlInput = "canvas.sfu.ca";

// Function to load assignments for selected courses
function loadAssignments(selectedCourseIds) {
    let coursesToLoad = [];
    if (selectedCourseIds === "all" || (Array.isArray(selectedCourseIds) && selectedCourseIds.length === 0)) {
        coursesToLoad = courses;
    } else {
        coursesToLoad = courses.filter(course => selectedCourseIds.includes(String(course.id)));
    }

    if (coursesToLoad.length === 0) {
        return;
    }

    coursesToLoad.forEach(course => {
        fetch(`https://${canvasUrlInput}/api/v1/courses/${course.id}/assignments?access_token=${apiKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch assignments for ${course.name || 'unknown course'}`);
                }
                return response.json();
            })
            .then(assignments => {
                let hasUpcoming = false;
                assignments.forEach(assignment => {
                    if (!assignment.due_at) return;
                    const dueDate = new Date(assignment.due_at);
                    if (dueDate < new Date()) return;

                    hasUpcoming = true;
                    const taskBox = document.createElement('div');
                    taskBox.className = 'aTask';
                    const dueDateText = new Date(assignment.due_at).toLocaleString();
                    taskBox.textContent = `${assignment.name} (Due: ${dueDateText})`;
                    tasksContainer.appendChild(taskBox);
                });
                if (!hasUpcoming) {
                    const taskBox = document.createElement('div');
                    taskBox.className = 'aTask';
                    taskBox.textContent = `No upcoming assignments for course: ${course.name}`;
                    tasksContainer.appendChild(taskBox);
                }
            })
            .catch(error => {
                console.error(error);
                const taskBox = document.createElement('div');
                taskBox.className = 'aTask';
                taskBox.textContent = `Error: ${error.message}`;
                tasksContainer.appendChild(taskBox);
            });
    });
}

// Fetch courses and create checkboxes
fetch(`https://${canvasUrlInput}/api/v1/courses?access_token=${apiKey}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }
        return response.json();
    })
    .then(fetchedCourses => {
        courses = fetchedCourses;
        checkBoxContainer.innerHTML = ''; // Clear existing checkboxes

        // Add "All Subjects" checkbox
        const allDiv = document.createElement('div');
        allDiv.className = "checkbox-item";
        const allCheckbox = document.createElement('input');
        allCheckbox.type = "checkbox";
        allCheckbox.id = "all";
        allCheckbox.name = "course";
        allCheckbox.value = "all";
        allCheckbox.checked = true;
        allDiv.appendChild(allCheckbox);
        const allLabel = document.createElement('label');
        allLabel.htmlFor = "all";
        allLabel.textContent = "All Subjects";
        allDiv.appendChild(allLabel);
        checkBoxContainer.appendChild(allDiv);

        // Add course checkboxes only for valid courses
        courses.forEach(course => {
            if (course.name && course.name.trim() !== "") { // Check for valid name
                const div = document.createElement('div');
                div.className = "checkbox-item";
                const checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.id = "course-" + course.id;
                checkbox.name = "course";
                checkbox.value = course.id;
                div.appendChild(checkbox);
                const label = document.createElement('label');
                label.htmlFor = "course-" + course.id;
                label.textContent = course.name;
                div.appendChild(label);
                checkBoxContainer.appendChild(div);
            } else {
                console.warn(`Skipping course with missing or empty name: ${course.id}`);
            }
        });

        // Update assignments initially
        updateAssignments();

        // Add event listeners to checkboxes
        const allCheckboxes = document.querySelectorAll('input[name="course"]');
        allCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.value === "all" && this.checked) {
                    // If "All Subjects" is checked, uncheck all others
                    allCheckboxes.forEach(cb => {
                        if (cb.value !== "all") {
                            cb.checked = false;
                        }
                    });
                } else if (this.value !== "all" && this.checked) {
                    document.getElementById('all').checked = false;
                } else if (!document.querySelector('input[name="course"]:checked')) {
                    document.getElementById('all').checked = true;
                }
                updateAssignments();
            });
        });
    })
    .catch(error => {
        console.error(error);
        const errorBox = document.createElement('div');
        errorBox.textContent = 'Error: Unable to fetch courses. Please check your API key.';
        checkBoxContainer.appendChild(errorBox);
    });

// Function to update assignments based on selected checkboxes
function updateAssignments() {
    tasksContainer.innerHTML = ''; // Clear existing task boxes
    const checkedBoxes = document.querySelectorAll('input[name="course"]:checked');
    const selectedValues = Array.from(checkedBoxes).map(cb => cb.value);
    if (selectedValues.includes("all") || selectedValues.length === 0) {
        loadAssignments("all");
    } else {
        loadAssignments(selectedValues);
    }
}
    





// inputBtn.addEventListener("click" , ()=>{
//     if(taskContainer.querySelector(".task").value == "")
//     {
//         return ; 
//     }
//     else
//     {
//     let createTask = document.createElement("Div");
//     createTask.setAttribute("class" , "aTask");
//     createTask.innerHTML = `<p class = "innerTaskPtag"></p> <p class = "date"></p>`
//     createTask.querySelector(".innerTaskPtag").innerHTML = taskContainer.querySelector(".task").value;
//     createTask.querySelector(".date").innerHTML = taskContainer.querySelector(".dueDate").value ; 
//     taskArea.appendChild(createTask);
//     }
// });