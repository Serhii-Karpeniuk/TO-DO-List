document.addEventListener("DOMContentLoaded", function () {
    const listMenu = document.getElementById("list__menu");
    const inputNewList = document.getElementById("input__new-list");
    const newlistBtn = document.querySelector(".newlist__btn");
    const inputBox = document.getElementById("input-box");
    const addBtn = document.querySelector(".add__btn");
    const listContainer = document.getElementById("list-container");
  
    let groups = JSON.parse(localStorage.getItem('taskGroups')) || {};
  
    function updateListMenu() {
      listMenu.innerHTML = "";
      if (Object.keys(groups).length === 0) {
        const defaultOption = document.createElement("option");
        defaultOption.value = "Lists";
        defaultOption.textContent = "Lists";
        listMenu.appendChild(defaultOption);
      }
  
      Object.keys(groups).forEach(groupName => {
        const option = document.createElement("option");
        option.value = groupName;
        option.textContent = groupName;
        listMenu.appendChild(option);
      });
    }
  
    function showTasksForSelectedGroup() {
      const selectedGroupName = listMenu.value;
      const tasks = groups[selectedGroupName] || [];
      inputBox.value = "";
      renderTasks(tasks);
    }
  
    function renderTasks(tasks) {
      listContainer.innerHTML = "";
      tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.text;
        li.classList.toggle('sub__fields', task.checked);
        li.addEventListener('click', () => toggleTask(li, index));
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        span.addEventListener('click', () => removeTask(index));
        li.appendChild(span);
        inputBox.value = "";
      });
    }
  
    function addGroup() {
      const groupName = inputNewList.value.trim();
      if (groupName) {
        if (!groups[groupName]) {
          const selectedOption = listMenu.querySelector('option[selected]');
          if (selectedOption) {
            delete groups[selectedOption.value];
          }
  
          groups[groupName] = [];
          inputNewList.value = "";
          updateListMenu();
          saveDataToLocalStorage();
        } else {
          inputNewList.value = "";
          ErrorMessageClass.showMessage("You entered an existing name");
        }
      } else {
        ErrorMessageClass.showMessage("Enter a name for the list");
      }
    }
  
    function addTask() {
      const selectedGroupName = listMenu.value;
      const task = { text: inputBox.value, checked: false };
      if (task.text) {
        groups[selectedGroupName].push(task);
        inputBox.value = "";
        updateListMenu();
        showTasksForSelectedGroup();
        saveDataToLocalStorage();
      } else {
        ErrorMessageClass.showMessage("The field is empty, please, add a new task ");
      }
    }
  
    function toggleTask(li, index) {
      const selectedGroupName = listMenu.value;
      groups[selectedGroupName][index].checked = !groups[selectedGroupName][index].checked;
      li.classList.toggle('sub__fields', groups[selectedGroupName][index].checked);
      saveDataToLocalStorage();
    }
  
    function removeTask(index) {
      const selectedGroupName = listMenu.value;
      groups[selectedGroupName].splice(index, 1);
      updateListMenu();
      showTasksForSelectedGroup();
      saveDataToLocalStorage();
    }
  
    function saveDataToLocalStorage() {
      localStorage.setItem('taskGroups', JSON.stringify(groups));
    }
  
    newlistBtn.addEventListener("click", addGroup);
    listMenu.addEventListener("change", showTasksForSelectedGroup);
    addBtn.addEventListener("click", addTask);
  
    updateListMenu();
    showTasksForSelectedGroup();
  
    const deleteGroupofList = document.querySelector('.delete__group_list');
  
    deleteGroupofList.addEventListener("click", function () {
      const selectedGroupName = listMenu.value;
  
      if (selectedGroupName && groups[selectedGroupName]) {
        delete groups[selectedGroupName];
        updateListMenu();
        showTasksForSelectedGroup();
        saveDataToLocalStorage();
      } else {
        ErrorMessageClass.showMessage("You haven't selected an existing group");
      }
    });
  
    function blockPage() {
      document.body.classList.add('blocked');
      document.getElementById('overlay').style.display = 'block';
    }
  
    function unblockPage() {
      document.body.classList.remove('blocked');
      document.getElementById('overlay').style.display = 'none';
    }
  
    class ErrorMessage {
      constructor() {
        this.container = document.createElement("div");
        this.container.classList.add("message_container")
        this.block = document.createElement("div");
        this.block.classList.add("message_block")
        this.okButton = document.createElement("button");
        this.okButton.classList.add("message_button")
        this.setupElements();
        this.promiseResolver = null;
      }
  
      setupElements() {
        this.okButton.textContent = "OK";
        this.okButton.addEventListener('click', () => this.close());
      }
  
      showMessage(message) {
        this.block.textContent = message;
        this.show();
        return new Promise((resolve) => {
          this.promiseResolver = resolve;
        })
      }
  
      show() {
        if (this.block.textContent !== "") {
          document.body.appendChild(this.container);
          this.container.appendChild(this.block);
          this.container.appendChild(this.okButton);
          blockPage();
        }
      }
  
      close() {
        if (this.promiseResolver) {
          this.promiseResolver();
          this.promiseResolver = null;
          this.container.remove();
          unblockPage();
        }
      }
    }
  
    const ErrorMessageClass = new ErrorMessage();
    ErrorMessageClass.showMessage();
  });
  