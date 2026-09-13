const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const bookCount = document.getElementById("book-count");

let books = [];
let cart = [];
let selectedCategory = "All";


// ================= LOAD BOOKS =================

fetch("http://localhost:5000/api/books")
    .then(response => response.json())
    .then(data => {

        books = data;

        displayBooks(books);

    })
    .catch(error => {

        bookList.innerHTML = `
            <p>Unable to load books.</p>
        `;

        console.error(error);

    });


// ================= DISPLAY BOOKS =================

function displayBooks(bookData) {

    bookList.innerHTML = "";

    bookCount.textContent = `${bookData.length} books`;

    if (bookData.length === 0) {

        bookList.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:40px;">
                <h3>No books found 📚</h3>
                <p>Try another search or category.</p>
            </div>
        `;

        return;
    }


    bookData.forEach(book => {

        const card = document.createElement("div");

        card.className = "book-card";

        card.innerHTML = `

            <div class="book-image">
                📖
            </div>

            <div class="book-info">

                <h3>${book.title}</h3>

                <p>
                    <strong>Author:</strong>
                    ${book.author}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${book.category}
                </p>

                <p class="price">
                    ₹${Number(book.price).toFixed(2)}
                </p>

                <p class="stock">
                    ✓ ${book.stock} items available
                </p>

            </div>

            <button
                class="add-cart"
                onclick='addToCart(${JSON.stringify(book)})'
            >
                🛒 Add to Cart
            </button>

        `;

        bookList.appendChild(card);

    });

}


// ================= ADD TO CART =================

function addToCart(book) {

    const existingBook = cart.find(
        item => item.book_id === book.book_id
    );


    if (existingBook) {

        alert("This book is already in your cart!");

        return;
    }


    cart.push(book);

    updateCart();

    alert(`${book.title} added to cart!`);

}


// ================= UPDATE CART =================

function updateCart() {

    cartCount.textContent = cart.length;

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                🛒 Your cart is empty.
            </p>
        `;

        cartTotal.textContent = "₹0.00";

        return;
    }


    let total = 0;


    cart.forEach((book, index) => {

        total += Number(book.price);


        const item = document.createElement("div");

        item.className = "cart-item";


        item.innerHTML = `

            <h3>${book.title}</h3>

            <p>
                Author: ${book.author}
            </p>

            <p>
                Price:
                <strong>
                    ₹${Number(book.price).toFixed(2)}
                </strong>
            </p>

            <button
                class="remove-btn"
                onclick="removeFromCart(${index})"
            >
                ❌ Remove
            </button>

        `;


        cartItems.appendChild(item);

    });


    cartTotal.textContent = `₹${total.toFixed(2)}`;

}


// ================= REMOVE FROM CART =================

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

}


// ================= OPEN / CLOSE CART =================

function toggleCart() {

    const cartPanel = document.getElementById("cart-panel");

    const overlay = document.getElementById("cart-overlay");


    cartPanel.classList.toggle("show");

    overlay.classList.toggle("show");

}


// ================= SEARCH =================

function searchBooks() {

    const searchText =
        searchInput.value.toLowerCase().trim();


    const filteredBooks = books.filter(book => {

        const title =
            book.title.toLowerCase();

        const author =
            book.author.toLowerCase();

        const category =
            book.category.toLowerCase();


        const matchesSearch =
            title.includes(searchText) ||
            author.includes(searchText) ||
            category.includes(searchText);


        const matchesCategory =
            selectedCategory === "All" ||
            book.category === selectedCategory;


        return matchesSearch && matchesCategory;

    });


    displayBooks(filteredBooks);

}


// ================= LIVE SEARCH =================

searchInput.addEventListener("input", searchBooks);


// ================= CATEGORY FILTER =================

function filterCategory(category) {

    selectedCategory = category;


    document
        .querySelectorAll(".category-btn")
        .forEach(button => {

            button.classList.remove("active");

        });


    event.target.classList.add("active");


    searchBooks();

}


// ================= SHOP BOOKS =================

function scrollToBooks() {

    document
        .querySelector("main")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ================= CHECKOUT =================

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }


    alert(
        "Thank you for shopping with BookNest! 📚"
    );

}