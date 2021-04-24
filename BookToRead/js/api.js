export class Api {
  async search(q, pageNum) {
    var pageNum=1;
    const url = `https://openlibrary.org/search.json?q=${q}&page=${pageNum}`;
    const result = await fetch(url);
    return await result.json();
  }
}
