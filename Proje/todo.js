// Tüm elementleri seçme.
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

// Form submit olduğu zaman
function eventListeners() { // Tüm event listenerlar
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI); // Sayfa yüklendikten sonra direkt olarak bu event çalışır. LocalStorage'ye kaydettiğimiz verileri ekrana getirdik.
    secondCardBody.addEventListener("click", deleteTodo); // Todo'ları temizleme

    filter.addEventListener("keyup", filterTodos); // Todo ları arama
    clearButton.addEventListener("click", clearAllTodos); // Tüm Todo ları temizleme

}

function clearAllTodos(e) {
    if (confirm("Tümünü silmek istediğinize emin misiniz?")) {
        // Arayüzden tüm todo'ları temizleme
        // todoList.innerHTML = ""; // Yavaş çalışan

        while (todoList.firstElementChild != null) {
            // Tüm elementleri gezer ve temizler tek tek.
            todoList.removeChild(todoList.firstElementChild); // ilk element.
        }
        localStorage.removeItem("todos"); // LocalStorage deki tüm verileri siler.
    }

}

// Todo Filter
function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase(); // girilen değeri küçük harfe çevirme
    const listItems = document.querySelectorAll(".list-group-item"); // Tüm li etiketleri aldık listelemek için.

    listItems.forEach(function (listItem) { // Tüm li'leri gezme
        const text = listItem.textContent.toLocaleLowerCase(); // yukarıda ki gibi olmalı.

        if (text.indexOf(filterValue) === -1) {
            //Aranan kelime bulunamadığı zaman.
            listItem.setAttribute("style", "display:none !important"); // Bulunamazsa gösterme
        } else {
            listItem.setAttribute("style", "display:block"); // Bulunursa göster
        }

    });

    // console.log(e.target.value); // Arama inputuna girdiğimiz değeri gösterir.
}

// Todo temizleme.
function deleteTodo(e) {
    if (e.target.className === "fa fa-remove") { // İlgili silme kısmına tıklama
        e.target.parentElement.parentElement.remove(); // Bulunduğu konuma gittik.
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent); //Local den silme
        showAlert("success", "Todo temizlendi.");
    }

    // console.log(e.target); // Tıkladığımız yeri görmek için.
}

// LocalStorage den temizleme.
function deleteTodoFromStorage(deletetodo) {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo, index) {
        if (todo === deletetodo) {
            todos.splice(index, 1); // Arraydan değeri silme.
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}

// LocalStorage'ye yazdığımız değerleri sayfa yeniledikten sonra bile ekranda tuttuk.
function loadAllTodosToUI() {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo) {
        addTodoToUI(todo);


    });
}

function addTodo(e) {
    const newTodo = todoInput.value.trim();

    if (newTodo === "") { // Texte girilen değer boş ise uyarı mesajı verme.
        showAlert("danger", "Lütfen bir todo girin..."); // Verilecek mesaj
    } else {
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success", "Başarılı.");
    }


    e.preventDefault();
}

function getTodosFromStorage(newTodo) { // Storageden bütün Todo ları alma
    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    return todos;
}

function addTodoToStorage(newTodo) { // Var olan fonksiyon içindeki verileri aldık.
    let todos = getTodosFromStorage();
    todos.push(newTodo);

    localStorage.setItem("todos", JSON.stringify(todos));
}

// Uyarı mesajı verme
function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    firstCardBody.appendChild(alert);

    // Uyarı mesajı versin 1 saniye sonra silsin.
    setTimeout(function () {
        alert.remove();
    }, 1000);

    // console.log(alert);
}

function addTodoToUI(newTodo) { // String değerini list item olarak ekleyecek UI'ya.

    // Bunu oluşturduk
    // <li class="list-group-item d-flex justify-content-between">
    //   Todo 1
    // <a href = "#" class ="delete-item"><i class = "fa fa-remove"></i></a>
    // </li>

    // *** Todo Ekleyin üstündeki inputa girdiğimiz değer Todolar kısmına eklendi. *** BEGIN
    // List item oluşturma
    const listeItem = document.createElement("li"); // Yeni bir li element oluşturdu.
    // Link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>"

    listeItem.className = "list-group-item d-flex justify-content-between";

    // Text Node ekleme
    listeItem.appendChild(document.createTextNode(newTodo)); // Input'a girdiğimiz text i yazdırma
    listeItem.appendChild(link);

    // Todo List'e List Item'ı ekleme
    todoList.appendChild(listeItem);
    todoInput.value = ""; // Input temizledik.

    // *** Todo Ekleyin üstündeki inputa girdiğimiz değer Todolar kısmına eklendi. *** END
};