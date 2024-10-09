let theme = localStorage.getItem("theme");
const tasks = document.querySelectorAll(".task");
const todoList = document.getElementById("tasks");
const body = document.getElementById("body");
const taskboxes = document.getElementsByName("taskbox");
const input = document.getElementById("input");
let todos = JSON.parse(localStorage.getItem("todo-list"));
let filterProp = localStorage.getItem("filter");


function filter(selectedTask) {
    let btnId = selectedTask.previousElementSibling.id;
    btnId = btnId.replace("mobile-","");
    showTodo(btnId);
    localStorage.setItem("filter",btnId);
}

function showTodo(filter) {    
    document.getElementById("taskCount").innerHTML = `${todos.length} tasks left` || "0 tasks left";
    if (filter == undefined) {
        filter = localStorage.getItem("filter");
    }
    document.getElementById(filter).checked = true;
    document.getElementById(`mobile-${filter}`).checked = true;

    let list = ""
    if (todos) {
        todos.forEach((todo,id) => {
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                list +=  `
                <li class="task" id="${id}" status="${todo.status}" name="todo" draggable="true">
                    <label for="task${id}" class="checkbox ${isCompleted}" name="checkbox"><img src="images/icon-check.svg" alt="icon-check"></label>
                    <input type="checkbox" id="task${id}" name="taskbox" onclick="updateStatus(this)" ${isCompleted}>
                    <label for="task${id}">${todo.name}</label>
                    <button role="button" class="crossBtn" onclick="removeTodo(${id})">
                        <img src="images/icon-cross.svg" alt="icon-cross">
                    </button>
                </li>
                `;
            }
        });
    }
    todoList.innerHTML = list ||  `<p aria-roledescription="default_text">You don't have any task here</p>`;
    
};

function updateStatus(selectedTask){
    let taskName = selectedTask.parentElement;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[taskName.id].status="completed";
    } else {
        taskName.classList.remove("checked");
        todos[taskName.id].status="pending";
    }

    localStorage.setItem("todo-list" , JSON.stringify(todos));
    showTodo()
}

function toggleTheme() {
    if (theme === "light") {
        theme = "dark";
    } else if (theme === "dark") {
        theme = "light";
    }

    initializeTheme();
};

function initializeTheme() {
    if (theme === "light") {
        body.classList.add("light");
        body.classList.remove("dark");
    } else if (theme === "dark") {
        body.classList.remove("light");
        body.classList.add("dark");
    }
    else{
        body.classList.add("dark");
        theme = "dark";
    }
    localStorage.setItem("theme",theme);
}

function removeTodo(id) {
   todos.splice(id,1);
   localStorage.setItem("todo-list" , JSON.stringify(todos));
   showTodo()
}

function clearCompleted() {
    if (todos) {
        let demo = [];
        todos.forEach(todo => {
            if(todo.status != "completed"){
               demo.push(todo);
            }
        })
        todos = [];
        todos = demo;
        localStorage.setItem("todo-list" , JSON.stringify(todos));
        showTodo()             
    }
}

function trimArray(array,task) {
    let duplicate = [];
    array.forEach(element => {
        duplicate.push(element.name);
    });

    if (duplicate.includes(task)) {
        return false
    } else {
        return true
    }
}

if (!todos) {
    todos = [];
};

if(!filterProp){
    localStorage.setItem("filter","all");    
}

tasks.forEach(element => {
    if(element.querySelector("input").checked){
        element.classList.add("checked");
    };
});

input.addEventListener("keyup", e => {
    let userTask = input.value.trim();
    if (e.key == "Enter" && userTask) {
        input.value="";
        if(trimArray(todos,userTask)){
            let taskInfo = {name:userTask,status:"pending"};
            todos.push(taskInfo);
        }
    localStorage.setItem("todo-list" , JSON.stringify(todos));
    showTodo();
    }
});

showTodo();
initializeTheme();

