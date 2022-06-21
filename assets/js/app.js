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

