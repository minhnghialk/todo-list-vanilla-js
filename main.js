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
                            <img onclick="openConfirmModal(${item.id})" class="w-[20px] h-[20px]" src="./delete-icon.svg" alt="delete-icon">
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
  loader.style.display = "block";
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
    loader.style.display = "none";
    return;
  }

  //   const listElement = document.getElementById(id);
  //   listElement.appendChild(document.getElementById(cardId));

  const updatedTodos = todos.filter(
    (item) => Number(item.id) !== Number(cardId)
  );

  let listName = "";

  switch (destinationListId) {
    case "todo-list": {
      const updateTodo = {
        ...cardItem,
        type: "todo",
      };

      const newTodos = [...updatedTodos, updateTodo];

      todos = newTodos;

      listName = "To-do";

      break;
    }
    case "doing-list": {
      const updateTodo = {
        ...cardItem,
        type: "doing",
      };

      const newTodos = [...updatedTodos, updateTodo];

      todos = newTodos;

      listName = "Doing";

      break;
    }
    case "finish-list": {
      const updateTodo = {
        ...cardItem,
        type: "finish",
      };

      const newTodos = [...updatedTodos, updateTodo];

      todos = newTodos;

      listName = "Finish";

      break;
    }

    default:
      return;
  }

  // re-render
  render();

  loader.style.display = "none";

  showMoveSuccessToast(listName);
}

let deleteId = null;

const confirmModal = document.getElementById("confirm-modal");

const openConfirmModal = (id) => {
  deleteId = id;
  confirmModal.classList.remove("hidden");
};

const closeConfirmModal = document.getElementById("cancelBtn");

closeConfirmModal.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
  deleteId = null;
});

const deleteItem = (id) => {
  const index = todos.findIndex((item) => item.id === id);
  todos.splice(index, 1);
  render();
};

const deleteButton = document.getElementById("deleteBtn");
deleteButton.addEventListener("click", (deleteId) => {
  if (deleteId != null) {
    loader.style.display = "block";

    setTimeout(() => {
      deleteItem(deleteId);

      loader.style.display = "none";

      showDeleteSuccessToast();
    }, 500);
  }

  confirmModal.classList.add("hidden");

  deleteId = null;
});

const updateModal = document.getElementById("update-modal");
const openUpdateModal = document.getElementById("openUpdateModal");
const closeUpdateModal = document.getElementById("closeUpdateModal");

openUpdateModal.addEventListener("click", () => {
  isEditing = false;
  handleChangeUpdateModalTitle();
  updateModal.classList.remove("hidden");
});

closeUpdateModal.addEventListener("click", () => {
  updateModal.classList.add("hidden");
});

const modalOverlay = document.getElementById("modal-overlay");

// When the user clicks anywhere outside of the modal, close the modal
window.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    updateModal.classList.add("hidden");
  }
});

let isEditing = false;
let currentEditId = null;

const updateModalTitle = document.querySelector("#update-modal h3");

const handleChangeUpdateModalTitle = () => {
  if (isEditing) {
    updateModalTitle.textContent = "Update todo";
  } else {
    updateModalTitle.textContent = "Add new todo";
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

  handleChangeUpdateModalTitle();

  updateModal.classList.remove("hidden");
};

const form = document.getElementById("todoForm");

const loader = document.querySelector(".loader");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  //   console.log("Form submitted successfully");

  loader.style.display = "block";

  const category = document.getElementById("category").value;
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (category === "" || title === "" || content === "") {
    setTimeout(() => {
      loader.style.display = "none";
      showUpdateWarningToast();
    }, 500);
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

    setTimeout(() => {
      loader.style.display = "none";
      showUpdateSuccessToast();
    }, 500);

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

    setTimeout(() => {
      loader.style.display = "none";
      showAddSuccessToast();
    }, 500);
  }

  render();

  updateModal.classList.add("hidden");

  form.reset();
});

const showAddSuccessToast = () => {
  toast({
    title: "Success!",
    message: "New to-do added successfully.",
    type: "success",
    duration: 5000,
  });
};

const showUpdateSuccessToast = () => {
  toast({
    title: "Success!",
    message: "To-do updated successfully.",
    type: "success",
    duration: 5000,
  });
};

const showUpdateWarningToast = () => {
  toast({
    title: "Warning!",
    message: "Please fill in all the required information.",
    type: "warning",
    duration: 5000,
  });
};

const showMoveSuccessToast = (listName) => {
  toast({
    title: "Success!",
    message: `Task successfully moved to the "${listName}" list.`,
    type: "success",
    duration: 5000,
  });
};

const showDeleteSuccessToast = () => {
  toast({
    title: "Success!",
    message: "To-do successfully deleted.",
    type: "success",
    duration: 5000,
  });
};

// Toast function

const toast = ({
  title = "",
  message = "",
  type = "info",
  duration = 3000,
}) => {
  const main = document.getElementById("toast");

  if (main) {
    const toast = document.createElement("div");

    // Auto remove toast
    const autoRemoveId = setTimeout(function () {
      main.removeChild(toast);
    }, duration + 500);

    // Remove toast when clicked
    toast.onclick = function (e) {
      if (e.target.closest(".toast__close")) {
        main.removeChild(toast);
        clearTimeout(autoRemoveId);
      }
    };

    const icons = {
      success: "fas fa-check-circle",
      info: "fas fa-info-circle",
      warning: "fas fa-exclamation-circle",
      error: "fas fa-exclamation-circle",
    };

    const icon = icons[type];

    const delay = (duration / 500).toFixed(2);

    toast.classList.add("toast", `toast--${type}`);

    toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

    toast.innerHTML = `<div class="toast__icon text-2xl py-0 px-4">
    <i class="${icon}"></i>
    </div>
    <div class="grow">
    <h3 class="text-base font-semibold color-[#333]">${title}</h3>
    <p class="text-sm text-[#888] mt-1.5 leading-normal">${message}</p>
    </div>
    <div class="toast__close py-0 px-4 text-xl text-[#0000004d] cursor-pointer">
    <i class="fas fa-times"></i>
    </div>
    `;

    main.appendChild(toast);
  }
};
