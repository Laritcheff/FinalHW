export class BooksUI {
  searchResultHolder;
  bookInfoHolder;
  currentPage = [];

  api;

  constructor(api) {
    let hasFullText;
    let subtitle;
    this.searchResultHolder = document.getElementById("searchResultHolder");

    const bookInfoHolder = document.getElementById("bookInfoHolder");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const toReadList = document.getElementById("toReadList");

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

      const bookInfo = `<h2>${selectedBook.title}</h2>
        <h3>${subtitle}</h3>
      <h4>${selectedBook.author_name}</h4>
      <p>Full text available: ${hasFullText}</p>
      <p>Languages:${selectedBook.language.join(", ")}</p>
      <p>First publish year: ${selectedBook.first_publish_year}</p>  
     <p>Years published: ${selectedBook.publish_year.join(", ")}</p>
     <button class="addToList">Add Book to Read List</button>
      `;  

const bookInfoToRead = `<h2>${selectedBook.title}</h2>
      <h3>${subtitle}</h3>
      <h4>${selectedBook.author_name}</h4>
      <button class="markAsRead">Mark as read</button>
      <button class="remove">Remove</button>`; 
        bookInfoHolder.innerHTML = bookInfo; 
     


      const addToListBtn=bookInfoHolder.querySelector(".addToList");
      addToListBtn.addEventListener("click", (event)=>{  

for(let i=0; i<localStorage.length; i++) {
  let key = localStorage.key(i);
  if(id!=key){
  console.log(`${key}: ${id}`);}
}


        let toReadDiv=document.createElement("div");
for (let key in localStorage) {  if(key!=id){

        toReadList.prepend(toReadDiv);
       toReadDiv.innerHTML=bookInfoToRead;
    localStorage.setItem(id, bookInfoToRead);
            
        toReadList.append = `<div>${localStorage.getItem(key)}</div>`;   }   }
      });
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

function addToReadList(id, bookInfo) {
  localStorage.setItem(this.id, this.bookInfo);
}
