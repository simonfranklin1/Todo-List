// Seleção de elementos

const openTodoBtn = document.getElementById("open-todo-btn");
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

const editForm = document.getElementById("todo-edit");
const editInput = document.getElementById("edit-input");

const searchInput = document.getElementById("search-input");
const eraseBtn = document.getElementById("erase-btn");

const filterBtn = document.getElementById("filter");

// Funções
let antigoValorDoInput;

function funcionalidadesFormTodo () {
    openTodoBtn.addEventListener("click", () => {
        if(todoForm.classList.contains("hide")) {
            todoForm.classList.remove("hide");
            todoList.style.height = '38.2%';
        } else {
            todoForm.classList.add("hide");
            todoList.style.height = '62%';        
        }
    });

    document.querySelector("#cancel-todo").addEventListener("click", (e) => {
        e.preventDefault();
        todoForm.classList.add("hide");
        todoList.style.height = "62%";
    });
};

let criarNovoTodo = (text, feito = 0, salvo = 1) => {
    const newTodo = document.createElement("div");
    newTodo.classList.add("todo-box");

    newTodo.innerHTML = `
    <h3>${text}</h3>
    <button class="finish-todo"><i class="fa-solid fa-check"></i></button>
    <button class="edit-todo"><i class="fa-solid fa-pen"></i></button>
    <button class="remove-todo"><i class="fa-solid fa-trash"></i></button>`;

    // Local Storage
    if(feito) {
        newTodo.classList.add("done")
    }

    if(salvo) {
        salvarTodoNaLocalStorage({text, feito})
    }

    todoList.appendChild(newTodo);
    todoInput.value = "";
    todoInput.focus();
}

function adicionarNovoTodo() {
    let titleTodo = todoInput.value;

    if(titleTodo) {
        criarNovoTodo(titleTodo);
    }
};

const alterarFormularios = () => {
    if(editForm.classList.contains("hide")) {
        editForm.classList.remove("hide"); 
        todoList.style.display = 'none';
        editInput.focus();
    } else {
        editForm.classList.add("hide");
        todoList.style.display = 'block';
    }
};

function editarTodo(text) {
    const todos = document.querySelectorAll(".todo-box");

    todos.forEach((todo) => {
        const tituloASerAlterado = todo.querySelector("h3");

        if(tituloASerAlterado.innerText === antigoValorDoInput) {
            tituloASerAlterado.innerText = text;

            atualizarTodoLocalStorage(antigoValorDoInput, text)
        }
    })
};

const buscarTodos = (search) => {
    const todos = document.querySelectorAll(".todo-box"); //

    todos.forEach((todo) => {
        const tituloTodo = todo.querySelector("h3").innerText.toLowerCase();

        const normalizedSearch = search.toLowerCase();
        todo.style.display = 'flex';

        if(!tituloTodo.includes(normalizedSearch)) {
            todo.style.display = 'none';
        }
    })
};

const filtrarTodos = (opcaoFiltro) => {
    const todos = document.querySelectorAll(".todo-box");

    switch(opcaoFiltro) {
        case "all":
            todos.forEach((todo) => todo.style.display = "flex");
            break;
        case "done":
            todos.forEach((todo) => 
            todo.classList.contains("done") ? todo.style.display = "flex" : todo.style.display = "none");
            break;
        case "undone":
            todos.forEach((todo) => 
            !todo.classList.contains("done") ? todo.style.display = "flex" : todo.style.display = "none");
            break;
        default:
            break;
    }
}

// Eventos
funcionalidadesFormTodo();

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    adicionarNovoTodo();
})


document.getElementById("todo-list").addEventListener("click", (e) => {
    const elementoAtual = e.target;
    const paiDoElementoAtual = elementoAtual.closest("div");
    let tituloElementoAtual;

    if(paiDoElementoAtual && paiDoElementoAtual.querySelector("h3")) {
        tituloElementoAtual = paiDoElementoAtual.querySelector("h3").innerText;
    }


    if(elementoAtual.classList.contains("finish-todo")) {
        paiDoElementoAtual.classList.toggle("done");
        atualizarStatusTodoLocalStorage(tituloElementoAtual);
    }

    if(elementoAtual.classList.contains("edit-todo")) {
        alterarFormularios();

        editInput.value = tituloElementoAtual;

        antigoValorDoInput = tituloElementoAtual;
    }

    if(elementoAtual.classList.contains("remove-todo")) {
        paiDoElementoAtual.remove();

        removeTodoDaLocalStorage(tituloElementoAtual);
    }
});


editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValor = editInput.value;

    if(editInputValor) {
        editarTodo(editInputValor);
    }

    alterarFormularios();
});

document.getElementById("cancel-edit").addEventListener("click", (e) => {
    e.preventDefault();
    
    editForm.classList.add("hide");
    todoList.style.display = 'block';
});


searchInput.addEventListener("keyup", (e) => {

    const search = e.target.value;

    buscarTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();

    searchInput.value = '';

    searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
    const opcaoFiltro = e.target.value;

    filtrarTodos(opcaoFiltro);
})

// Local Storage 

const pegarTodosDaLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todo")) || [];

    return todos;
}

const carregarTodos = () => {
    const todos = pegarTodosDaLocalStorage(); 
    
    todos.forEach((todo) => {
        criarNovoTodo(todo.text, todo.feito, 0);
    });
}

const salvarTodoNaLocalStorage = (todo) => {
    const todos = pegarTodosDaLocalStorage();

    todos.push(todo);

    localStorage.setItem("todo", JSON.stringify(todos));
}

const removeTodoDaLocalStorage = (todoText) => {
    const todos = pegarTodosDaLocalStorage();
    
    const todosQueVaoFicar = todos.filter((todo) => todo.text !== todoText);

    localStorage.setItem("todo", JSON.stringify(todosQueVaoFicar));
}

const atualizarStatusTodoLocalStorage = (todoText) => {
    const todos = pegarTodosDaLocalStorage();
    
    todos.map((todo) => todo.text === todoText ? todo.feito = !todo.feito : null);

    localStorage.setItem("todo", JSON.stringify(todos));
}

const atualizarTodoLocalStorage = (antigoTexto, novotexto) => {
    const todos = pegarTodosDaLocalStorage();
    
    todos.map((todo) => todo.text === antigoTexto ? (todo.text = novotexto) : null);

    localStorage.setItem("todo", JSON.stringify(todos));    
}

carregarTodos();