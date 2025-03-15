let taskContainer = document.querySelector(".taskContainer");
let inputBtn = taskContainer.querySelector(".addTaskBtn");
let taskArea = document.querySelector(".taskArea");


inputBtn.addEventListener("click" , ()=>{
    if(taskContainer.querySelector(".task").value == "")
    {
        return ; 
    }
    else
    {
    let createTask = document.createElement("Div");
    createTask.setAttribute("class" , "aTask");
    createTask.innerHTML = `<p class = "innerTaskPtag"></p> <p class = "date"></p>`
    createTask.querySelector(".innerTaskPtag").innerHTML = taskContainer.querySelector(".task").value;
    createTask.querySelector(".date").innerHTML = taskContainer.querySelector(".dueDate").value ; 
    taskArea.appendChild(createTask);
    }
})