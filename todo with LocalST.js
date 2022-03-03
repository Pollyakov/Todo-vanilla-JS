// select elements
const saveBtn = document.querySelector(".save");
const deleteAllBtn = document.querySelector(".deleteAll");
const deleteCompletedBtn = document.querySelector(".deleteCompleted");
const theList = document.querySelector(".theList");
// ----------------------------------------------------------------
// data list
// retrieve and display all the saved tasks
let tasksArray = [];
tasksArray = retrieveLocalStorage();
displayFromLocalStorage();

// ----------------------------------------------------------------
// display from local storage
function displayFromLocalStorage() {
  tasksArray.forEach((taskObj) => {
    displayTask(taskObj);
  });
  clearNewTaskQuery();
}
// retrieve local storage
function retrieveLocalStorage() {
  let savedTasksArray = [];
  for (let i = 0; i < localStorage.length; i++)
    savedTasksArray.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
  return savedTasksArray;
}
// update local storage
function updateLocalStorage(taskObj) {
  if (typeof Storage !== "undefined") {
    // localStorage.setItem(JSON.stringify(taskObj.taskID), "");
    localStorage.setItem(
      JSON.stringify(taskObj.taskID),
      JSON.stringify(taskObj),
    );
  } else {
    console.log("Sorry, your browser does not support Web Storage...");
  }
}
// clear local storage
function clearLocalStorage() {
  if (typeof Storage !== "undefined") {
    localStorage.clear();
  } else {
    console.log("Sorry, your browser does not support Web Storage...");
  }
}
// delete item from local storage
function deleteFromLocalStorage(taskObj) {
  if (typeof Storage !== "undefined") {
    localStorage.removeItem(JSON.stringify(taskObj.taskID));
  } else {
    console.log("Sorry, your browser does not support Web Storage...");
  }
}
// ----------------------------------------------------------------
// create new task
function createNewTask() {
  const newTaskContent = document.querySelector("#newTaskField").value;
  const taskObj = {
    content: newTaskContent,
    // !- check if id is uniq -!
    taskID: Math.floor(Math.random() * 10000),
    date: Date.now(),
    completed: false,
  };
  tasksArray.push(taskObj);
  updateLocalStorage(taskObj);
  displayTask(taskObj);
  clearNewTaskQuery();
}
// update the task obj
function updateTaskObj(taskEl) {
  const taskObjIndex = returnTaskObjIndex(taskEl);
  const newContent = taskEl.querySelector(".editField").value;
  tasksArray[taskObjIndex].content = newContent;
  return tasksArray[taskObjIndex];
}
// delete a task
function deleteTask(taskObj) {
  let taskObjIndex = tasksArray.findIndex(
    (task) => task.taskID === taskObj.taskID,
  );
  tasksArray.splice(taskObjIndex, 1);

  deleteFromLocalStorage(taskObj);
}
// find task in the array and return the task object
function returnTaskObj(taskEl) {
  return tasksArray.find(
    (task) => task.taskID === Number(taskEl.getAttribute("data-id")),
  );
}
// find task in the array and return the index
function returnTaskObjIndex(taskEl) {
  return tasksArray.findIndex(
    (task) => task.taskID === Number(taskEl.getAttribute("data-id")),
  );
}

// ----------------------------------------------------------------
// clear new task field
function clearNewTaskQuery() {
  document.querySelector("#newTaskField").value = "";
}

// display edit task field
function displayEditTask(taskEl) {
  taskEl.querySelector(".saveChangesBtn").hidden = false;
  taskEl.querySelector(".editField").hidden = false;
  taskEl.querySelector(".editBtn").hidden = true;
  taskEl.querySelector(".completeBtn").hidden = true;
  taskEl.querySelector(".taskContent").hidden = true;
}
// display a task
function displayTask(taskObj) {
  const task = document.createElement("div");
  task.classList.add("task");
  task.setAttribute("data-completed", taskObj.completed);
  task.setAttribute("data-id", taskObj.taskID);

  const taskContent = document.createElement("p");
  taskContent.classList.add("taskContent");
  taskContent.innerHTML = taskObj.content;

  const editField = document.createElement("input");
  editField.setAttribute("type", "text");
  editField.classList.add("editField");
  editField.value = taskObj.content;
  editField.hidden = true;

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttonsContainer");

  const deleteBtn = createBtn("deleteBtn", "Delete");
  const completeBtn = createBtn("completeBtn", "Complete");
  const editBtn = createBtn("editBtn", "Edit");
  const saveChangesBtn = createBtn("saveChangesBtn", "Save Changes");
  saveChangesBtn.hidden = true;

  task.appendChild(taskContent);
  task.appendChild(editField);
  task.appendChild(buttonsContainer);

  buttonsContainer.appendChild(deleteBtn);
  buttonsContainer.appendChild(editBtn);
  buttonsContainer.appendChild(completeBtn);
  buttonsContainer.appendChild(saveChangesBtn);

  // theList.appendChild(task);
  theList.firstElementChild.insertAdjacentElement("afterend", task);

  // event listeners
  deleteBtn.addEventListener("click", handleDeleteClick);
  completeBtn.addEventListener("click", handleCompleteClick);
  // !- replace edit button with dbclick -!
  editBtn.addEventListener("click", handleEditClick);
  saveChangesBtn.addEventListener("click", handleSaveChangesClick);
}
// create a button
function createBtn(name, innerText) {
  const btn = document.createElement("button");
  btn.classList.add("btn", name);
  btn.innerHTML = innerText;
  return btn;
}

function updateTaskElement(taskEl, taskObj) {
  taskEl.querySelector(".taskContent").innerHTML = taskObj.content;
  taskEl.querySelector(".saveChangesBtn").hidden = true;
  taskEl.querySelector(".editField").hidden = true;
  taskEl.querySelector(".editBtn").hidden = false;
  taskEl.querySelector(".completeBtn").hidden = false;
  taskEl.querySelector(".taskContent").hidden = false;
}
// ----------------------------------------------------------------
// handle clicks
function handleDeleteClick(event) {
  const taskEl = event.currentTarget.parentElement.parentElement;
  const taskObj = returnTaskObj(taskEl);
  deleteTask(taskObj);
  taskEl.remove();
}
function handleCompleteClick(event) {
  const taskEl = event.currentTarget.parentElement.parentElement;
  const taskObjIndex = returnTaskObjIndex(taskEl);
  // !- bug! doesn't save the completed info
  if (!tasksArray[taskObjIndex].completed) {
    taskEl.setAttribute("data-completed", true);
    tasksArray[taskObjIndex].completed = true;
    updateLocalStorage(tasksArray[taskObjIndex]);
  } else {
    taskEl.setAttribute("data-completed", false);
    tasksArray[taskObjIndex].completed = false;
  }
  updateLocalStorage(tasksArray[taskObjIndex]);
}
function handleEditClick(event) {
  const taskEl = event.currentTarget.parentElement.parentElement;
  displayEditTask(taskEl);
}
function handleSaveChangesClick(event) {
  const taskEl = event.currentTarget.parentElement.parentElement;
  const taskObj = updateTaskObj(taskEl);
  updateLocalStorage(taskObj);
  updateTaskElement(taskEl, taskObj);
}
function handleDeleteAllClick() {
  // delete all tasks elements
  document.querySelectorAll(".task").forEach((taskEl) => taskEl.remove());
  // delete all array objects
  tasksArray = [];
  // delete all the local storage
  clearLocalStorage();
}
function handleDeleteCompletedBtnClick() {
  // delete completed tasks elements
  document
    .querySelectorAll("[data-completed=true]")
    .forEach((taskEl) => taskEl.remove());
  // delete completed from the local storage
  tasksArray.forEach((taskObj) => {
    if (taskObj.completed === true) {
      deleteFromLocalStorage(taskObj);
    }
  });
  // update array from local storage
  tasksArray = retrieveLocalStorage();
}

// add eventListener to save btn
saveBtn.addEventListener("click", createNewTask);

// add events to the buttons:
// deleteAll
deleteAllBtn.addEventListener("click", handleDeleteAllClick);
// Delete Completed Tasks
deleteCompletedBtn.addEventListener("click", handleDeleteCompletedBtnClick);