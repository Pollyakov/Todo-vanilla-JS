let tasks = [{
    name: "to code",
    prior: "today",
    isDone: "completed",
}, {
    name: "work out",
    prior: "this week",
    isDone: "todo",
}];
//sending data to Local Storage during first load
//localStorage.setItem('data', JSON.stringify(tasks));

const taskInput = document.querySelector("input[name='taskInput']");
const priorInput = document.querySelector("select[name ='prior']");
const addBtn = document.querySelector("button[data-create]");
const container = document.querySelector(".tasksContainer");
const deleteAllBtn = document.querySelector("button[data-deleteAll]");
const deleteComplBtn = document.querySelector("button[data-deleteCompleted]");

const renderData = () => {
    container.innerHTML = "";
    let data = JSON.parse(localStorage.getItem('data'));
    //take the data for rendering from Local Storage
    tasks = [...data];
    //transform each object in an data array to <div>
    tasks.forEach((task, index) => {
        const taskDiv = document.createElement("div");

        
        taskDiv.classList.add("task");
        const rowNumber = document.createElement("span");
        rowNumber.textContent = index + 1 + '.';
        const taskName = document.createElement("span");
        taskName.innerHTML = task.name;
        const taskPrior = document.createElement("span");
        taskPrior.textContent = task.prior;
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener("click", (e) => updateData(e, index));
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.addEventListener("click", () => deleteData(index));
        const completBtn = document.createElement('button');
        completBtn.classList.add("why");
        completBtn.textContent = task.isDone;
        completBtn.addEventListener("click", (e) => isDone(index, e));
        taskDiv.append(rowNumber, taskName, taskPrior, editBtn, deleteBtn, completBtn);
        container.append(taskDiv);
    });
};
//toggle completed/todo
const isDone = (index, e) => {
    if (tasks[index].isDone === "completed") {
        const complBtn = document.querySelector(".why");
        complBtn.classList.add("done");
        tasks[index].isDone = "todo";
        //e.target.classList.remove("done");
        e.target.setAttribute("data-completed", "false");
        console.log(complBtn);
    } else {
        tasks[index].isDone = "completed";
        e.target.classList.add("done");
        e.target.setAttribute("data-completed", "true");
        console.log("else else");
    }

    //update Local Storage and render
    localStorage.setItem('data', JSON.stringify(tasks));
    renderData();
};

const deleteData = (index) => {
    tasks.splice(index, 1);
    localStorage.setItem('data', JSON.stringify(tasks));
    renderData();

};
const deleteAll = () => {
    tasks = [];
    localStorage.setItem('data', JSON.stringify(tasks));
    renderData();

};
deleteAllBtn.addEventListener("click", deleteAll);

const deleteCompleted = () => {
    let notCompleted = tasks.filter(task =>
        task.isDone === "todo");
    console.log(notCompleted);
    tasks = [...notCompleted];
    localStorage.setItem('data', JSON.stringify(tasks));
    renderData();

};
deleteComplBtn.addEventListener("click", deleteCompleted);

const updateData = (e, index) => {
    const taskToUpdate = e.target.parentNode; //div
    const taskName = taskToUpdate.childNodes[1]; //span
    const inputNew = document.createElement("input");
    inputNew.classList.add("update");

    let content = taskName.textContent;
    taskName.textContent = '';
    inputNew.value = content;
    taskName.append(inputNew);

    const confirmBtn = document.createElement("button");
    confirmBtn.classList.add("update");
    confirmBtn.textContent = "Confirm";
    confirmBtn.setAttribute("data-index", index);
    confirmBtn.addEventListener('click', (e) => confirmUpdate(e));
    taskToUpdate.childNodes[3].hidden = true;
    taskToUpdate.insertBefore(confirmBtn, taskToUpdate.childNodes[4]);
};

const confirmUpdate = (e) => {
    const inputNew = e.target.parentNode.childNodes[1].firstChild;
    const confirmBtn = e.target.parentNode.childNodes[4];
    const index = confirmBtn.getAttribute('data-index');
    tasks[index].name = inputNew.value;
    localStorage.setItem('data', JSON.stringify(tasks));
    renderData();
}
const createData = () => {
    console.log(taskInput);
    tasks.push({ name: taskInput.value, prior: priorInput.value, isDone: "todo" });
    taskInput.value = '';
    localStorage.setItem('data', JSON.stringify(tasks));
    renderData();

};
addBtn.addEventListener('click', createData);
renderData();

//two modes, for computer and mobile
//deployment and Github
//css