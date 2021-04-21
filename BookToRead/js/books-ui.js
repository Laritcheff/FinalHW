export class BooksUI {
  searchResultHolder;
  bookInfoHolder;
  currentPage = [];

  api;

  constructor(api) {
    this.searchResultHolder = document.getElementById("searchResultHolder");

    const bookInfoHolder = document.getElementById("bookInfoHolder");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    searchBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const querry = searchInput.value;
      if (!querry) {
        alert();
      }

      api.search(querry).then((page) => {
        this.processSearchResult(page);
      });
    });

    this.searchResultHolder.addEventListener("click", (event) => {
      const targetDiv = event.target;
      const id = targetDiv.id;
      const selectedBook = this.currentPage.find((item) => item.id === id);
      if (!selectedBook) {
        return;
      }

      if (this.selectedBook) {
        const selectedBook = this.searchResultHolder.querySelector(
          "#" + this.selectedBook.id
        );
        selectedBook.classList.remove("selected-item");
      }

      this.selectedBook = selectedBook;
      targetDiv.classList.add("selected-item");

      localStorage.setItem(id, selectedBook.author_name[0]);
      console.log(selectedBook.author_name[0]);

      bookInfoHolder.innerHTML = selectedBook.author_name[0];
    });
  }

  processSearchResult(page) {
    page.docs.forEach((item) => {
      item.id = item.key.split("/").pop();
    });
    this.currentPage = page.docs;

    const bookHTML = page.docs.reduce((acc, item) => {
      return (
        acc +
        `
<div id="${item.id}" class="book-info">${item.title}</div>`
      );
    }, "");
    this.searchResultHolder.innerHTML = bookHTML;
  }
}
