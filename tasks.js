document.addEventListener('DOMContentLoaded', function () {
    const logged = localStorage.getItem('logged');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === logged);
  
    if (user) {
      document.getElementById('username').innerText = user.name;
    } else {
      window.location.href = 'index.html';
    }
  
    loadTasks(logged);
  });

function createTask() {
    const title = document.getElementById('title').value;
    const startDate = document.getElementById('startDate').value;
    const startTime = document.getElementById('startTime').value;
    const endDate = document.getElementById('endDate').value;
    const endTime = document.getElementById('endTime').value;
    const description = document.getElementById('description').value;

    if (!title || !startDate || !startTime || !endDate || !endTime) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const logged = localStorage.getItem('logged');
    const newTask = {
        title,
        startDate,
        startTime,
        endDate,
        endTime,
        description,
        status: 'Pendente', 
        user: logged 
    };

    existingTasks.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(existingTasks));

    document.getElementById('taskForm').reset();

    loadTasks(logged);
}



function logout() {
    localStorage.removeItem('logged');
    window.location.href = 'index.html';
}

function loadTasks(logged) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    updateTaskStatus(tasks);

    const taskTable = document.getElementById('taskList');
    taskTable.innerHTML = '';

    tasks.forEach(task => {
        if (task.user === logged) {
            const row = taskTable.insertRow();
    
            const titleCell = row.insertCell(0);
            titleCell.innerHTML = `<a>${task.title}</a>`;
    
               const startDateTime = new Date(`${task.startDate}T${task.startTime}`);
        const startCell = row.insertCell(1);
        startCell.textContent = startDateTime.toLocaleString();
        startCell.onclick = function () {
            showTaskDetails(task.title, task.description);
        };
    
            const endDateTime = new Date(`${task.endDate}T${task.endTime}`);
            const endCell = row.insertCell(2);
            endCell.textContent = endDateTime.toLocaleString();
    
            const statusCell = row.insertCell(3);
            statusCell.innerHTML = `<span class="badge bg-primary">${task.status}</span>`;
    
            const editCell = row.insertCell(4);
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-warning btn-sm';
            editButton.innerText = 'Editar';
            editButton.addEventListener('click', function (event) {
                event.stopPropagation(); 
                buttonEdit(task);
            });
            editCell.appendChild(editButton);
    
            row.addEventListener('click', function () {
                openTaskModal(task)
            });
    
            row.style.cursor = 'pointer';
        }
    });
    
    
}



function openTaskModal(task) {
    document.getElementById('taskModalTitle').innerText = task.title;
    document.getElementById('taskModalDescription').innerText = task.description;

    const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
    taskModal.show();
}


function buttonEdit(task) {
    document.getElementById('title').value = task.title;
    document.getElementById('startDate').value = task.startDate;
    document.getElementById('startTime').value = task.startTime;
    document.getElementById('endDate').value = task.endDate;
    document.getElementById('endTime').value = task.endTime;
    document.getElementById('description').value = task.description;

    const createButton = document.querySelector('button[type="button"]');
    createButton.style.display = 'none';

    removeActionButtons();

    const alterarButton = createActionButton('btn-primary', 'Alterar', function () {
        saveTaskEdit(task);
    });

    const excluirButton = createActionButton('btn-danger', 'Excluir', function () {
        deleteTask(task);
    });

    const markDoneButton = createActionButton('btn-secondary', 'Marcar como Concluída', function () {
        markTaskDone(task);
    });

    const cancelButton = createActionButton('btn-secondary', 'Cancelar', function (event) {
        cancelEdit(task, event);
    });
    
    createButton.parentNode.insertBefore(alterarButton, createButton.nextSibling);
    createButton.parentNode.insertBefore(excluirButton, createButton.nextSibling);
    createButton.parentNode.insertBefore(markDoneButton, createButton.nextSibling);
    createButton.parentNode.insertBefore(cancelButton, createButton.nextSibling);
}

function deleteTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const taskIndex = tasks.findIndex(t => t.title === task.title && t.user === task.user);

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);

        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks(localStorage.getItem('logged'));

        console.log('Tarefa excluída:', task);
    } else {
        console.error('Erro ao excluir a tarefa. Tarefa não encontrada:', task);
    }
}


function markTaskDone(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.title === task.title && t.user === task.user);

    if (taskIndex !== -1) {
        tasks[taskIndex].status = 'Concluída';
        localStorage.setItem('tasks', JSON.stringify(tasks));

        loadTasks(localStorage.getItem('logged'));
    } else {
        console.error('Erro ao marcar a tarefa como concluída. Tarefa não encontrada:', task);
    }
}


function cancelEdit(task, event) {
    window.location.reload();
    loadTasks(localStorage.getItem('logged'));
}


function removeActionButtons() {
    const existingButtons = document.querySelectorAll('.action-button');
    existingButtons.forEach(button => {
        button.parentNode.removeChild(button);
    });
}

function createActionButton(className, text, clickHandler) {
    const button = document.createElement('button');
    button.className = `btn ${className} ms-2 action-button`;
    button.innerText = text;
    button.addEventListener('click', clickHandler);
    return button;
}

function updateTaskStatus(tasks) {
    const currentDate = new Date();

    tasks.forEach(task => {
        if (task.status !== 'Concluída') {
            const startDateTime = new Date(`${task.startDate}T${task.startTime}`);
            const endDateTime = new Date(`${task.endDate}T${task.endTime}`);

            if (endDateTime < currentDate) {
                task.status = 'Em atraso';
            } else if (startDateTime <= currentDate && endDateTime > currentDate) {
                task.status = 'Em andamento';
            } else if (startDateTime > currentDate) {
                task.status = 'Pendente';
            }
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveTaskEdit(task) {
    const updatedTitle = document.getElementById('title').value;
    const updatedStartDate = document.getElementById('startDate').value;
    const updatedStartTime = document.getElementById('startTime').value;
    const updatedEndDate = document.getElementById('endDate').value;
    const updatedEndTime = document.getElementById('endTime').value;
    const updatedDescription = document.getElementById('description').value;

    task.title = updatedTitle;
    task.startDate = updatedStartDate;
    task.startTime = updatedStartTime;
    task.endDate = updatedEndDate;
    task.endTime = updatedEndTime;
    task.description = updatedDescription;

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.title === task.title && t.user === task.user);

    if (taskIndex !== -1) {
        tasks[taskIndex] = task;
        localStorage.setItem('tasks', JSON.stringify(tasks));

        loadTasks(localStorage.getItem('logged'));

        document.getElementById('taskForm').reset();
        document.querySelector('button[type="button"]').style.display = 'block';

        removeActionButtons();
    } else {
        console.error('Erro ao salvar as alterações. Tarefa não encontrada:', task);
    }
}



