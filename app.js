// Book Class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
// UI Class
class UI {
    static displayBooks() {        
        const books = Store.getBooks();
        books.forEach(book => UI.addBookToList(book))
    }
    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }
    static clearFields() {
        document.forms[0].reset()
        // document.querySelector('#title').value = '';
        // document.querySelector('#author').value = '';
        // document.querySelector('#isbn').value = '';
    }
    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();    // btn.parent = td and td.parent = tr
            // remove() an ES6 method
            return true
        }
        return false
    }
    static showAlert(msg, className) {
        const div = document.querySelector('.alert')
        div.classList.remove(div.classList.item(1))
        div.classList.add(`alert-${className}`)
        div.textContent = msg
        div.style.visibility = 'visible'
        setTimeout(() => {
            div.style.visibility = 'hidden'
        }, 3000);
    }
}
// Store Class : Handles storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books
    }
    static addBook(book) {
        const books = Store.getBooks()
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))

    }
    static removeBook(isbn) {
        const books = Store.getBooks()
        const index = books.findIndex(book => book.isbn === isbn)
        if (index === -1) {
            UI.showAlert("Book doesn't exist", info)
        } else {
            books.splice(index, 1)
            localStorage.setItem('books', JSON.stringify(books))
        }        
    }
}

// Event : Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    //get Form values
    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const isbn = document.querySelector('#isbn').value

    // Validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields','danger')
    } else {
        const book = new Book(title, author, isbn);
        UI.addBookToList(book);
        Store.addBook(book)
        UI.showAlert('Book Added', 'success')
        UI.clearFields();
    }
})

// Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    //console.log(e.target);
    if (UI.deleteBook(e.target)) {
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
        UI.showAlert('Book deleted', 'info')
    }    
})


