document.addEventListener('DOMContentLoaded', () => {
    // 1. Dados Iniciais
    let routine = [
        { id: 1, name: "Escovar os Dentes", icon: "fas fa-tooth", completed: false, points: 10 },
        { id: 2, name: "Tomar Café da Manhã", icon: "fas fa-coffee", completed: false, points: 15 },
        { id: 3, name: "Hora da Aula/Trabalho", icon: "fas fa-book", completed: false, points: 20 },
    ];
    let nextTaskId = 4;
    let userPoints = 0;
    let userLevel = 1;

    // 2. Elementos DOM
    const routineList = document.getElementById('routine-list');
    const pointsSpan = document.getElementById('points');
    const levelSpan = document.getElementById('level');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const lowStimulusToggle = document.getElementById('low-stimulus-toggle');
    const body = document.body;

    // Elementos do Modal
    const modal = document.getElementById('task-modal');
    const addTaskBtn = document.getElementById('add-task-btn');
    const closeBtn = document.querySelector('.close-btn');
    const taskForm = document.getElementById('task-form');

    // 3. Funções Principais

    /**
     * Renderiza a lista de rotina na interface.
     */
    function renderRoutine() {
        routineList.innerHTML = '';
        const totalTasks = routine.length;
        
        if (totalTasks === 0) {
            routineList.innerHTML = '<p style="padding: 10px; text-align: center;">Nenhuma tarefa na sua rotina. Que tal adicionar uma?</p>';
        }

        routine.forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            listItem.dataset.taskId = task.id;

            // Estrutura da tarefa usando ícones do Font Awesome dinamicamente
            listItem.innerHTML = `
                <div class="task-content">
                    <i class="fas fa-${task.icon} task-icon" aria-hidden="true"></i>
                    <span class="task-name">${task.name}</span>
                </div>
                <div class="task-actions">
                    ${!task.completed ? 
                        `<button class="task-complete-btn" data-id="${task.id}">Concluir (+${task.points})</button>` : 
                        `<button class="task-complete-btn" disabled><i class="fas fa-check"></i> Feito</button>`
                    }
                </div>
            `;
            routineList.appendChild(listItem);
        });
        
        // Re-adiciona o listener de conclusão
        document.querySelectorAll('.task-complete-btn').forEach(button => {
            if (!button.disabled) {
                button.addEventListener('click', handleTaskComplete);
            }
        });
    }

    /**
     * Trata o evento de conclusão de tarefa.
     */
    function handleTaskComplete(event) {
        const taskId = parseInt(event.currentTarget.dataset.id);
        const taskIndex = routine.findIndex(t => t.id === taskId);

        if (taskIndex !== -1 && !routine[taskIndex].completed) {
            routine[taskIndex].completed = true;
            
            // Gamificação
            userPoints += routine[taskIndex].points;
            updateGamification();
            
            // Feedback Positivo
            alert(`🎉 Parabéns! Você completou: ${routine[taskIndex].name}! Você ganhou ${routine[taskIndex].points} pontos!`);
            
            renderRoutine();
        }
    }

    /**
     * Atualiza os pontos, o nível e a barra de progresso.
     */
    function updateGamification() {
        // Lógica de Nível (Exemplo: 100 pontos por nível)
        userLevel = Math.floor(userPoints / 100) + 1;
        pointsSpan.textContent = userPoints;
        levelSpan.textContent = userLevel;

        // Atualiza Barra de Progresso
        const completedTasks = routine.filter(t => t.completed).length;
        const totalTasks = routine.length;
        const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${completedTasks} de ${totalTasks} tarefas concluídas (${Math.round(percentage)}%)`;
    }

    // 4. Lógica do Modal (Adicionar Tarefa)

    addTaskBtn.onclick = () => {
        modal.style.display = "block";
    }

    closeBtn.onclick = () => {
        modal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    taskForm.onsubmit = (event) => {
        event.preventDefault();
        
        const name = document.getElementById('task-name').value;
        const iconInput = document.getElementById('task-icon').value;
        const points = parseInt(document.getElementById('task-points').value);
        
        // Limpa o nome do ícone para garantir que funcione com o Font Awesome (ex: 'fa-book' -> 'book')
        const icon = iconInput.toLowerCase().replace(/[^a-z0-9-]/g, '');

        const newTask = {
            id: nextTaskId++,
            name: name,
            icon: icon,
            completed: false,
            points: points
        };

        routine.push(newTask);
        
        // Fecha o modal, limpa o formulário e re-renderiza
        modal.style.display = "none";
        taskForm.reset();
        renderRoutine();
        updateGamification();
    }

    // 5. Modos de Acessibilidade

    /**
     * Gerencia o modo escuro
     */
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    });

    /**
     * Gerencia o modo de baixo estímulo
     */
    lowStimulusToggle.addEventListener('click', () => {
        body.classList.toggle('low-stimulus');
        localStorage.setItem('lowStimulus', body.classList.contains('low-stimulus'));
    });

    /**
     * Carrega as preferências de acessibilidade
     */
    function loadPreferences() {
        if (localStorage.getItem('darkMode') === 'true') {
            body.classList.add('dark-mode');
        }
        if (localStorage.getItem('lowStimulus') === 'true') {
            body.classList.add('low-stimulus');
        }
    }

    // 6. Inicialização
    loadPreferences();
    renderRoutine();
    updateGamification();
});