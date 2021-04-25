//import {StartFunc} from "./books-ui.js";
//StartFunc();

import { Api } from "./api.js";
import { BooksUI } from "./books-ui.js";

new BooksUI(new Api());

