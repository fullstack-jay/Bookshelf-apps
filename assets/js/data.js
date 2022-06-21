const STORAGE_KEY = "BUKU_APLIKASI";

let books = [];

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

