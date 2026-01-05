const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

todoForm.addEventListener('submit', function(event) {
   event.preventDefault();// Prevent form submission
   const newTask = todoInput.value;

    if (newTask === '') {
        alert('Please enter a task.');
        return;
    }
    todoInput.value = '';
    addTask(newTask);

    });

function addTask(task) {
    const listItem = document.createElement('li');
    const taskText = document.createElement('span');
    taskText.textContent = task;
    listItem.appendChild(taskText);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    listItem.appendChild(editButton);
    editButton.addEventListener('click', function() {
        const isEditing = listItem.classList.contains('Editing');
        if(isEditing){
            taskText.textContent = this.previousSibling.value;
            listItem.insertBefore(taskText, this.previousSibling);
            listItem.removeChild(this.previousSibling)
            listItem.classList.remove('Editing');
            editButton.textContent = 'Edit';

        }else{
            const input = document.createElement('input');
            input.type = 'text';
            input.value = taskText.textContent;
            listItem.insertBefore(input, taskText);
            listItem.removeChild(taskText);
            editButton.textContent = 'Save';
            listItem.classList.add('Editing');

        }
    });
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    listItem.appendChild(checkbox);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    listItem.appendChild(deleteButton);

    todoList.appendChild(listItem);
    checkTask(taskText, checkbox);
    deleteTask(listItem, deleteButton);

}

function checkTask(taskText, checkbox) {
       
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            taskText.style.textDecoration = 'line-through';
        }else{
            taskText.style.textDecoration = 'none';
        }
    }); 
   

}
function deleteTask(listItem, deleteButton) {

    deleteButton.addEventListener('click', function() {
        todoList.removeChild(listItem);
    });

}