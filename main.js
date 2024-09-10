// function test() {
//     alert("Testing Successfully");
// }

const loadTodos = () => {
  const storedTodos = localStorage.getItem("todos");
  return storedTodos ? JSON.parse(storedTodos) : [];
};

let todos = loadTodos();

const saveTodos = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const todoColumn = document.getElementById("todo-list");
const todoCountElement = document.getElementById("todo-count");

function createListElement(array) {
  const result = array.map((item) => {
    return `
                    <!-- item -->
                    <div class="w-[342px] border border-gray-400 rounded-[10px] py-[10px] px-[20px] text-[16px] p-2" id=${item.id} draggable="true" ondragstart="handleDragStart(event)">

                        <div class="flex justify-between">
                            <p class="text-xs">${item.category}</p>
                            <div class="flex gap-2">
                            <img onclick="editItem(${item.id})" class="w-[20px] h-[20px]" src="./edit-icon.svg" alt="edit-icon">
                            <img onclick="deleteItem(${item.id})" class="w-[20px] h-[20px]" src="./delete-icon.svg" alt="delete-icon">
                            </div>
                        </div>

                        <p class="text-xl font-semibold">${item.title}</p>

                        <!-- divider -->
                        <div class="border border-[#c7c7c7] my-[20px] mx-0"></div>

                        <!-- content -->
                        <p class="text-xs text-[#c7c7c7]">${item.content}</p>

                        <!-- create at -->
                        <div class="flex items-center gap-2 p-[6px] leading-3">
                        <img class="w-[20px] h-[20px]" src="./clock-icon.svg" alt="clock-icon">
                        <p class="text-xs text-[#c7c7c7] ">${item.createAt}</p>
                        </div>
                    </div>
        `;
  });
  return result;
}

const renderTodoList = (todoItems) => {
  const renderItems = todos.filter((item) => item.type === "todo");
  const count = renderItems.length;
  const listElement = document.getElementById("todo-list");
  const countElement = document.getElementById("todo-count");

  const itemElements = createListElement(renderItems);
  listElement.innerHTML = itemElements.join("");
  countElement.innerText = count;
};

const renderDoingList = (todoItems) => {
  const renderItems = todos.filter((item) => item.type === "doing");
  const count = renderItems.length;
  const listElement = document.getElementById("doing-list");
  const countElement = document.getElementById("doing-count");

  const itemElements = createListElement(renderItems);
  listElement.innerHTML = itemElements.join("");
  countElement.innerText = count;
};

const renderFinishList = (todoItems) => {
  const renderItems = todos.filter((item) => item.type === "finish");
  const count = renderItems.length;
  const listElement = document.getElementById("finish-list");
  const countElement = document.getElementById("finish-count");

  const itemElements = createListElement(renderItems);
  listElement.innerHTML = itemElements.join("");
  countElement.innerText = count;
};

function render() {
  renderTodoList(todos);
  renderDoingList(todos);
  renderFinishList(todos);
  saveTodos();
}

render();

function handleDragStart(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDropZone(event, destinationListId) {
  event.preventDefault();
  const cardId = event.dataTransfer.getData("text");
  const cardItem = todos.find((item) => Number(item.id) === Number(cardId));

  if (!cardItem) {
    console.log("Not found card by id: ", cardId);
    return;
  }

  //   const listElement = document.getElementById(id);
  //   listElement.appendChild(document.getElementById(cardId));

  const updatedTodos = todos.filter(
    (item) => Number(item.id) !== Number(cardId)
  );

  switch (destinationListId) {
    case "todo-list": {
      const updateTodo = {
        ...cardItem,
        type: "todo",
      };

      const newTodos = [...updatedTodos, updateTodo];

      todos = newTodos;
      break;
    }
    case "doing-list": {
      const updateTodo = {
        ...cardItem,
        type: "doing",
      };

      const newTodos = [...updatedTodos, updateTodo];

      todos = newTodos;
      break;
    }
    case "finish-list": {
      const updateTodo = {
        ...cardItem,
        type: "finish",
      };

      const newTodos = [...updatedTodos, updateTodo];

      todos = newTodos;
      break;
    }

    default:
      return;
  }

  // re-render
  render();
}

const deleteItem = (id) => {
  const index = todos.findIndex((item) => item.id === id);
  todos.splice(index, 1);
  render();
};

const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

openModal.addEventListener("click", () => {
  isEditing = false;
  updateModalTitle();
  modal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
});

let isEditing = false;
let currentEditId = null;

const modalTitle = document.querySelector("#modal h3");

const updateModalTitle = () => {
  if (isEditing) {
    modalTitle.textContent = "Update todo";
  } else {
    modalTitle.textContent = "Add new todo";
  }
};

const editItem = (id) => {
  const todo = todos.find((item) => item.id === id);

  if (!todo) return;

  todo.category = document.getElementById("category");
  todo.title = document.getElementById("title");
  todo.content = document.getElementById("content");

  isEditing = true;
  currentEditId = id;

  updateModalTitle();

  modal.classList.remove("hidden");
};

const form = document.getElementById("todoForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  //   console.log("Form submitted successfully");

  const category = document.getElementById("category").value;
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (category === "" || title === "" || content === "") {
    alert("Please fill in all information!");
    return;
  }

  if (isEditing) {
    const index = todos.findIndex((item) => item.id === currentEditId);

    if (index !== -1)
      todos[index] = {
        ...todos[index],
        category,
        title,
        content,
      };

    isEditing = false;
    currentEditId = null;
  } else {
    const newTodo = {
      id: todos.length + 1,
      type: "todo",
      category: category,
      title: title,
      content: content,
      createAt: new Date().toDateString(),
    };

    todos.push(newTodo);
  }

  render();

  modal.classList.add("hidden");

  form.reset();
});
