const API_URL =
    "http://localhost:5000/api/books";

const authScreen = document.getElementById("auth-screen");
const storeScreen = document.getElementById("store-screen");

const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");

const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const bookCount = document.getElementById("book-count");
const welcomeUser = document.getElementById("welcome-user");
let books = [];
let cart = [];
let selectedCategory = "All";
let loggedInUser = null;


// ======================================================
// LOGIN / REGISTER SCREEN
// ======================================================

function showRegister() {

    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");

}


function showLogin() {

    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

}


// ======================================================
// LOGIN
// ======================================================

function loginUser() {

    const email =
        document.getElementById("login-email").value.trim();

    const password =
        document.getElementById("login-password").value.trim();


    if (!email || !password) {

        alert("Please enter email and password.");

        return;
    }


    // Email validation
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        alert("Please enter a valid email address.");

        return;
    }


    // Password validation
    if (password.length < 8) {

        alert("Password must contain at least 8 characters.");

        return;
    }


    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {

        alert(
            "Password must contain at least one special character."
        );

        return;
    }


    loggedInUser = email;


    document.getElementById("login-email").value = "";
    document.getElementById("login-password").value = "";


    alert("Login successful! Welcome to BookNest 📚");


    openBookstore();

}


// ======================================================
// REGISTER
// ======================================================

function registerUser() {

    const name =
        document.getElementById("register-name").value.trim();

    const email =
        document.getElementById("register-email").value.trim();

    const password =
        document.getElementById("register-password").value.trim();


    if (!name || !email || !password) {

        alert("Please fill all fields.");

        return;
    }


    // Email validation
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        alert("Please enter a valid email address.");

        return;
    }


    // Password validation
    if (password.length < 8) {

        alert(
            "Password must contain at least 8 characters."
        );

        return;
    }


    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {

        alert(
            "Password must contain at least one special character."
        );

        return;
    }


    loggedInUser = email;


    document.getElementById("register-name").value = "";
    document.getElementById("register-email").value = "";
    document.getElementById("register-password").value = "";


    alert(
        `Account created successfully! Welcome ${name} 📚`
    );


    // Automatically login
    openBookstore();

}


// ======================================================
// OPEN BOOKSTORE
// ======================================================

function openBookstore() {

    authScreen.classList.add("hidden");

    storeScreen.classList.remove("hidden");


    if (welcomeUser && loggedInUser) {

        welcomeUser.textContent =
            `Hi, ${loggedInUser.split("@")[0]} 👋`;

    }


    loadBooks();

}


// ======================================================
// LOGOUT
// ======================================================

function logoutUser() {

    loggedInUser = null;

    cart = [];

    updateCart();


    storeScreen.classList.add("hidden");

    authScreen.classList.remove("hidden");


    showLogin();


    alert("You have been logged out successfully.");

}


// ======================================================
// LOAD BOOKS
// ======================================================

function loadBooks() {

    bookList.innerHTML =
        "<p>Loading books...</p>";


    fetch(API_URL)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to connect to backend."
                );

            }

            return response.json();

        })

        .then(data => {

            books = data;

            displayBooks(books);

        })

        .catch(error => {

            bookList.innerHTML = `

                <div style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:50px;
                ">

                    <h3>Unable to load books 📚</h3>

                    <p>
                        Please try again later.
                    </p>

                </div>

            `;

            console.error(error);

        });

}


// ======================================================
// DISPLAY BOOKS
// ======================================================

function displayBooks(bookData) {

    bookList.innerHTML = "";

    bookCount.textContent =
        `${bookData.length} books`;


    if (bookData.length === 0) {

        bookList.innerHTML = `

            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:50px;
            ">

                <h3>No books found 📚</h3>

                <p>
                    Try another search or category.
                </p>

            </div>

        `;

        return;
    }


    bookData.forEach(book => {

        const card =
            document.createElement("div");


        card.className =
            "book-card";


        card.innerHTML = `

            <div class="book-image">
                📖
            </div>


            <div class="book-info">

                <h3>
                    ${book.title}
                </h3>


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


// ======================================================
// ADD TO CART
// ======================================================

function addToCart(book) {

    const existingBook =
        cart.find(
            item =>
                item.book_id === book.book_id
        );


    if (existingBook) {

        alert(
            "This book is already in your cart! 🛒"
        );

        return;
    }


    cart.push(book);

    updateCart();


    alert(
        `${book.title} added to cart! 🛒`
    );

}


// ======================================================
// UPDATE CART
// ======================================================

function updateCart() {

    cartCount.textContent =
        cart.length;


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <p class="empty-cart">
                🛒 Your cart is empty.
            </p>

        `;


        cartTotal.textContent =
            "₹0.00";


        return;
    }


    let total = 0;


    cart.forEach((book, index) => {

        total += Number(book.price);


        const item =
            document.createElement("div");


        item.className =
            "cart-item";


        item.innerHTML = `

            <h3>
                ${book.title}
            </h3>


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


    cartTotal.textContent =
        `₹${total.toFixed(2)}`;

}


// ======================================================
// REMOVE FROM CART
// ======================================================

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

}


// ======================================================
// OPEN / CLOSE CART
// ======================================================

function toggleCart() {

    const cartPanel =
        document.getElementById("cart-panel");

    const overlay =
        document.getElementById("cart-overlay");


    cartPanel.classList.toggle("show");

    overlay.classList.toggle("show");

}


// ======================================================
// SEARCH
// ======================================================

function searchBooks() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredBooks =
        books.filter(book => {

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


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    displayBooks(filteredBooks);

}


// ======================================================
// LIVE SEARCH
// ======================================================

searchInput.addEventListener(
    "input",
    searchBooks
);


// ======================================================
// CATEGORY FILTER
// ======================================================

function filterCategory(category, button) {

    selectedCategory =
        category;


    document
        .querySelectorAll(".category-btn")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    button.classList.add("active");


    searchBooks();

}


// ======================================================
// BROWSE BOOKS
// ======================================================

function scrollToBooks() {

    document
        .getElementById("books-section")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ======================================================
// PROCEED TO CHECKOUT
// ======================================================

function checkout() {

    // Check cart
    if (cart.length === 0) {

        alert(
            "Your cart is empty! Please add a book before checkout. 🛒"
        );

        return;
    }


    // Calculate total
    let total = 0;


    cart.forEach(book => {

        total += Number(book.price);

    });


    // Display total
    const checkoutTotal =
        document.getElementById("checkout-total");


    if (checkoutTotal) {

        checkoutTotal.textContent =
            `₹${total.toFixed(2)}`;

    }


    // Open checkout modal
    const checkoutModal =
        document.getElementById("checkout-modal");


    if (checkoutModal) {

        checkoutModal.classList.add("show");

    }


    // Close cart
    const cartPanel =
        document.getElementById("cart-panel");

    const cartOverlay =
        document.getElementById("cart-overlay");


    if (cartPanel) {

        cartPanel.classList.remove("show");

    }


    if (cartOverlay) {

        cartOverlay.classList.remove("show");

    }

}


// ======================================================
// CLOSE CHECKOUT
// ======================================================

function closeCheckout() {

    const checkoutModal =
        document.getElementById("checkout-modal");


    if (checkoutModal) {

        checkoutModal.classList.remove("show");

    }

}


// ======================================================
// PLACE ORDER
// ======================================================

function placeOrder() {

    const name =
        document
            .getElementById("customer-name")
            .value
            .trim();


    const phone =
        document
            .getElementById("customer-phone")
            .value
            .trim();


    const address =
        document
            .getElementById("customer-address")
            .value
            .trim();


    // Name validation
    if (!name) {

        alert(
            "Please enter your full name."
        );

        return;
    }


    // Phone validation
    if (!phone) {

        alert(
            "Please enter your phone number."
        );

        return;
    }


    if (!/^[0-9]{10}$/.test(phone)) {

        alert(
            "Please enter a valid 10-digit phone number."
        );

        return;
    }


    // Address validation
    if (!address) {

        alert(
            "Please enter your delivery address."
        );

        return;
    }


    // Close checkout
    closeCheckout();


    // Clear cart
    cart = [];

    updateCart();


    // Close cart panel
    document
        .getElementById("cart-panel")
        .classList.remove("show");


    document
        .getElementById("cart-overlay")
        .classList.remove("show");


    // Clear delivery fields
    document
        .getElementById("customer-name")
        .value = "";


    document
        .getElementById("customer-phone")
        .value = "";


    document
        .getElementById("customer-address")
        .value = "";


    // Show success
    document
        .getElementById("success-modal")
        .classList.add("show");

}


// ======================================================
// CLOSE SUCCESS
// ======================================================

function closeSuccess() {

    document
        .getElementById("success-modal")
        .classList.remove("show");

}


// ======================================================
// INITIAL CART
// ======================================================

updateCart();
