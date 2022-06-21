const STORAGE_KEY = "BUKU_APLIKASI";
const BELUM_SELESAI_MEMBACA_BUKU_ID = "belumSelesaiDibaca";
const SELESAI_MEMBACA_BUKU_ID = "selesaiDibaca";
const BUKU_ITEM_ID = "itemId";

let books = [];

// DOM
document.addEventListener("DOMContentLoaded", function () {
    footer();
  
    const inputBook = document.getElementById("inputBook");
    const inputSearchBook = document.getElementById("searchBook");
    const inputBukuSelesaiDibaca = document.getElementById("inputBukuSelesaiDibaca");
  
    inputBook.addEventListener("submit", function (event) {
      event.preventDefault();
      addBook();
    });
  
    inputSearchBook.addEventListener("keyup", function (event) {
      event.preventDefault();
      searchBook();
    });
  
    inputSearchBook.addEventListener("submit", function (event) {
      event.preventDefault();
      searchBook();
    });
  
    inputBukuSelesaiDibaca.addEventListener("input", function (event) {
      event.preventDefault();
      checkButton();
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });
  
  document.addEventListener("ondatasaved", () => {
    console.log("Buku berhasil disimpan.");
  });
  
  document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
  });


// DATA 
function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Mohon maaf! Browser Anda tidak mendukung local storage");
        return false;
    }
    return true;
}

function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null)
        books = data;

    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if (isStorageExist())
        saveData();
}

function composeBookObject(title, author, year, isComplete) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isComplete
    };
}

function findBook(bookId) {
    for (book of books) {
        if (book.id === bookId)
            return book;
    }
    return null;
}

function findBookIndex(bookId) {
    let index = 0
    for (book of books) {
        if (book.id === bookId)
            return index;

        index++;
    }

    return -1;
}

function refreshDataFromBooks() {
    const belumSelesaiDibaca = document.getElementById(BELUM_SELESAI_MEMBACA_BUKU_ID);
    const selesaiDibaca = document.getElementById(SELESAI_MEMBACA_BUKU_ID);

    for (book of books) {
        const newBook = makeBook(`Judul : ${book.title}`, `Penulis : ${book.author}`, `Tahun : ${book.year}`, book.isComplete);
        newBook[BUKU_ITEM_ID] = book.id;

        if (book.isComplete) {
          selesaiDibaca.append(newBook);
        } else {
          belumSelesaiDibaca.append(newBook);
        }
    }
}

function makeBook(title, author, year, isComplete) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = author;

    const bookYear = document.createElement("p");
    bookYear.innerText = year;

    const bookAction = document.createElement("div");
    bookAction.classList.add("action");
    if (isComplete) {
        bookAction.append(
            createUndoButton(),
            createTrashButton()
        );
    } else {
        bookAction.append(
            createCheckButton(),
            createTrashButton()
        );
    }

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(bookTitle, bookAuthor, bookYear, bookAction);

    return container;
}

function createUndoButton() {
    return createButton("blue", "Belum selesai dibaca", function (event) {
        undoBookFromCompleted(event.target.parentElement.parentElement);
    });
}

function createTrashButton() {
    return createButton("red", "Hapus buku", function (event) {
        removeBook(event.target.parentElement.parentElement);
    });
}

function createCheckButton() {
    return createButton("blue", "Selesai dibaca", function (event) {
        addBookToCompleted(event.target.parentElement.parentElement);
    });
}

function createButton(buttonTypeClass, buttonText, eventListener) {
    const button = document.createElement("button");
    button.innerText = buttonText;
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });

    return button;
}

function addBook() {
    const belumSelesaiDibaca = document.getElementById(BELUM_SELESAI_MEMBACA_BUKU_ID);
    const selesaiDibaca = document.getElementById(SELESAI_MEMBACA_BUKU_ID);
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBukuSelesaiDibaca").checked;

    const book = makeBook(`Judul : ${bookTitle}`, `Penulis : ${bookAuthor}`, `Tahun : ${bookYear}`, isComplete);
    const bookObject = composeBookObject(bookTitle, bookAuthor, bookYear, isComplete);

    book[BUKU_ITEM_ID] = bookObject.id;
    books.push(bookObject);

    if (isComplete) {
      selesaiDibaca.append(book);
    } else {
      belumSelesaiDibaca.append(book);
    }
    updateDataToStorage();
}

function addBookToCompleted(bookElement) {
    const selesaiDibaca = document.getElementById(SELESAI_MEMBACA_BUKU_ID);
    const bookTitle = bookElement.querySelector("h3").innerText;
    const bookAuthor = bookElement.querySelectorAll("p")[0].innerText;
    const bookYear = bookElement.querySelectorAll("p")[1].innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(bookElement[BUKU_ITEM_ID ]);
    book.isComplete = true;
    newBook[BUKU_ITEM_ID ] = book.id;

    selesaiDibaca.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function tambahBuku() {
  swal({
    title: "Buku berhasil ditambahkan!",
    text: "Mari Kita Cek!",
    icon: "success",
    button: "MARKICEK!",
  });
}

function removeBook(bookElement) {
    const isDelete = window.confirm("Apakah anda yakin ingin menghapus buku ini?");
    if (isDelete) {
        const bookPosition = findBookIndex(bookElement[BUKU_ITEM_ID]);
        books.splice(bookPosition, 1);

        bookElement.remove();
        updateDataToStorage();
        alert("Buku berhasil dihapus");
    } else {
        alert("Buku gagal dihapus");
    }
}

function undoBookFromCompleted(bookElement) {
    const belumSelesaiDibaca = document.getElementById(BELUM_SELESAI_MEMBACA_BUKU_ID );
    const bookTitle = bookElement.querySelector("h3").innerText;
    const bookAuthor = bookElement.querySelectorAll("p")[0].innerText;
    const bookYear = bookElement.querySelectorAll("p")[1].innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);

    const book = findBook(bookElement[BUKU_ITEM_ID]);
    book.isComplete = false;
    newBook[BUKU_ITEM_ID] = book.id;

    belumSelesaiDibaca.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function searchBook() {
    const searchBook = document.getElementById("searchBookTitle");
    const filterBooks = searchBook.value.toUpperCase();
    const bookItem = document.querySelectorAll("section.book_shelf > .book_list > .book_item");
    for (let i = 0; i < bookItem.length; i++) {
        txtValue = bookItem[i].textContent || bookItem[i].innerText;
        if (txtValue.toUpperCase().indexOf(filterBooks) > -1) {
            bookItem[i].style.display = "";
        } else {
            bookItem[i].style.display = "none";
        }
    }
}

function checkButton() {
    const span = document.querySelector("span");
    if (inputBukuSelesaiDibaca.checked) {
        span.innerText = "Selesai dibaca";
    } else {
        span.innerText = "Belum selesai dibaca";
    }
}

function footer() {
    const date = new Date();
    const year = date.getFullYear();

    const tahunFooter = document.getElementById('tahunFooter');
    tahunFooter.innerText = year;
}
