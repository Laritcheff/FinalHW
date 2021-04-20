export class BooksUI {
  searchResultHolder;
  api;
  constructor(api) {
    this.searchResultHolder = document.getElementById("searchResultHolder");
   
    const bookInfoHolder = document.getElementById("bookInfoHolder");
    console.log(bookInfoHolder);
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    searchBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const querry = searchInput.value;
      console.log(querry);
      if (!querry) {
        return;
      }

      api.search(querry).then((page) => {
        this.processSearchResult(page);
      });
    });
    this.searchResultHolder.addEventListener("click", (event) =>
      console.log(event.target)
    );
  }
  processSearchResult(page) {
    page.docs.forEach((item) => {
      item.id = item.key.split("/").pop();
    });

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
