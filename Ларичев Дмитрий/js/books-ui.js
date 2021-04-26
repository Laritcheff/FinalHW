StartFunc();

export class BooksUI {
  searchResultHolder;
  bookInfoHolder;
  currentPage = [];
  api;

  constructor(api) {
    let hasFullText;
    let subtitle;
    let img;
    let pageNum = 1;
    let language;

    this.searchResultHolder = document.getElementById("searchResultHolder");
    const bookInfoHolder = document.getElementById("bookInfoHolder");
    const searchInput = document.getElementById("searchInput");
    const toReadList = document.getElementById("toReadList");
    const statisticArea = document.querySelector(".statisticArea");
    const searchBtn = document.querySelector("#searchBtn");

    statisticArea.addEventListener("click", (event) => {
      const querry = searchInput.value;
      if (event.target.classList == "prevResult" && pageNum > 1) {
        pageNum--;
      }

      if (
        event.target.classList == "nextResult" &&
        this.searchResultHolder.querySelectorAll(".book-info").length /
          (pageNum * 100) >
          0.1
      ) {
        pageNum++;
      }
      console.log(pageNum);
      this.searchResultHolder.innerHTML = `<img src="img/load.gif" id="load"/>`;
      api.search(querry, pageNum).then((page) => {
        this.processSearchResult(page);
      });
    });

    searchBtn.addEventListener("click", (event) => {
      this.searchResultHolder.innerHTML = `<img src="img/load.gif" id="load"/>`;
      pageNum = 1;
      event.preventDefault();
      const querry = searchInput.value;
      if (!querry) {
        return;
      }

      api.search(querry, pageNum).then((page) => {
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
        try {
          selectedBook.classList.remove("selected-item");
        } catch {
          targetDiv.classList.add("selected-item");
        }
      }
      this.selectedBook = selectedBook;
      targetDiv.classList.add("selected-item");

      //check
      if (selectedBook.has_fulltext) {
        hasFullText = "Yes";
      } else {
        hasFullText = "No";
      }
      if (selectedBook.subtitle) {
        subtitle = selectedBook.subtitle;
      } else {
        subtitle = "";
      }
      if (selectedBook.language) {
        language = selectedBook.language;
      } else {
        selectedBook.language;
        language = "no";
      }
      try {
        img =
          "http://covers.openlibrary.org/b/isbn/" +
          selectedBook.isbn[0] +
          "-M.jpg";
      } catch {
        img = "";
      }
      try {
        const bookInfo = `<h2>${selectedBook.title}</h2>
        <h3>${subtitle}</h3>
      <h4>${selectedBook.author_name}</h4><img src=${img}>
      <p>Full text available: ${hasFullText}</p>
      <p>Languages:${selectedBook.language.join(", ")}</p>
      <p>First publish year: ${selectedBook.first_publish_year}</p>  
      <p>Years published: ${selectedBook.publish_year.join(", ")}</p>
      <button class="addToList">Add Book to Read List</button>
      `;
        bookInfoHolder.innerHTML = bookInfo;
      } catch {
        bookInfoHolder.innerHTML = "Invalid request";
      }

      const bookInfoToRead = `<h2>${selectedBook.title}</h2>
      <h3>${subtitle}</h3>
      <h4>${selectedBook.author_name}</h4>
      <button class="markAsRead">Mark as read</button>
      <button class="remove">Remove</button>`;

      const bookInfoToReadMarked = `
      <h2>${selectedBook.title}</h2>
      <h3>${subtitle}</h3>
      <h4>${selectedBook.author_name}</h4>`;

      const addToListBtn = bookInfoHolder.querySelector(".addToList");
      if (addToListBtn) {
        addToListBtn.addEventListener("click", (event) =>
          addToReadList(id, bookInfoToRead)
        );
      }

      toReadList.addEventListener("click", (event) => {
        if (event.target.classList == "remove") {
          localStorage.removeItem(event.target.parentNode.id);
          event.target.parentNode.remove();
        }
        if (event.target.classList == "markAsRead") {
          event.target.parentNode.className = "marked";
          localStorage.setItem(
            event.target.parentNode.id,
            bookInfoToReadMarked
          );
        }
        readStatistic();
      });
    });
  }

  processSearchResult(page) {
    page.docs.forEach((item) => {
      item.id = item.key.split("/").pop();
    });
    this.currentPage = page.docs;
    searchStat(page);
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

function addToReadList(id, bookInfoToRead) {
  localStorage.setItem(id, bookInfoToRead);
  const existsBook = toReadList.querySelector("#" + id);
  if (!existsBook) {
    const toReadDiv = document.createElement("li");
    toReadDiv.id = id;
    toReadList.append(toReadDiv);
    toReadDiv.innerHTML = bookInfoToRead;
    readStatistic();
  }
}

function StartFunc() {
  const clearBtn = document.createElement("button");
  toReadList.append(clearBtn);
  clearBtn.innerHTML = "ClearAll";
  clearBtn.classList.add("clearBtn");
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    const toReadDiv = document.createElement("li");
    toReadDiv.id = key;
    toReadList.append(toReadDiv);
    toReadDiv.innerHTML = localStorage.getItem(key);
    if (!toReadDiv.querySelector("button")) {
      toReadDiv.className = "marked";
    }
  }
  readStatistic();
}

//create rightStat
function readStatistic(toReadDiv) {
  const total = JSON.parse(localStorage.length);
  const totalElem = document.querySelector(".total");
  totalElem.innerHTML = `Total:${total}`;
  const markedBook = document.getElementsByClassName("marked").length;
  const wasRead = document.querySelector(".wasRead");
  wasRead.innerHTML = `Was Read:${markedBook}`;
}

//create leftStat
function searchStat(page) {
  const numFound = page.numFound;
  const start = page.start;
  const pages = page.docs.length;
  const searchStat = document.querySelector(".statisticArea");
  const stat = `<h4>Found:${numFound}  Start:${start}  Pages:${pages}</h4>
<button class="prevResult">PrevResult</button><button class="nextResult">Next Result</button>
`;
  if (page.docs.length != 0) {
    searchStat.innerHTML = stat;
  }
}
const clearBtn = document.querySelector(".clearBtn");
clearBtn.addEventListener("click", (event) => {
  const li = toReadList.querySelectorAll("li");
  console.log(li[0]);
  for (let i = 0; i < li.length; i++) {
    li[i].remove();
  }

  localStorage.clear();
  readStatistic();
});
