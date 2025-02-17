async function fetchCategories() {
    try {
        const response = await fetch(
            "http://localhost:8080/category/getCategories"
        );
        const categories = await response.json();
        const categoriesMenu = document.getElementById("categoriesMenu");
        categories.forEach((category) => {
            const categoryItem = `
                    <li><a class="dropdown-item" onClick="bookInCategory(${category.id})">
                        <i class="fas fa-book-open"></i> ${category.name}
                    </a></li>
                `;
            categoriesMenu.innerHTML += categoryItem;
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}
const bookInCategory = (categoryId) => {
    localStorage.setItem("selectedCategoryId", categoryId);
    window.location.href = "BookInCategory.html";
};

const listenNow = (bookId) => {
    localStorage.setItem("selectedBookIdToListen", bookId);
    window.location.href = "ListenAudioBook.html";
};
document.addEventListener("DOMContentLoaded", function () {
    // Lấy dữ liệu user từ localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));
    // Lấy phần tử chứa Login/Logout Links
    const authLinks = document.querySelector(".navbar-nav.ms-lg-3");
    if (userData) {
        // Nếu có dữ liệu user, hiển thị dropdown với "Hồ sơ" và "Đăng xuất"
        const userDropdown = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-user"></i>&nbsp;${userData.username}
                </a>
                <ul class="dropdown-menu" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="Profile.html"><i class="fas fa-user-circle"></i> Hồ sơ</a></li>
                    <li><a class="dropdown-item" href="MyAudio.html"><i class="fas fa-headphones"></i> Âm thanh của tôi</a></li>
                    <li><a class="dropdown-item" href="ListenHistory.html"><i class="fas fa-history"></i> Lịch sử</a></li>
                    <li><a class="dropdown-item" href="#" id="logoutLink"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a></li>
                </ul>
            </li>
        `;
        authLinks.innerHTML = userDropdown;
        // Xử lý sự kiện khi nhấn vào "Đăng xuất"
        document
            .getElementById("logoutLink")
            .addEventListener("click", function () {
                // Xóa dữ liệu user khỏi localStorage
                localStorage.removeItem("userData");
                // Tải lại trang để cập nhật giao diện
                window.location.reload();
            });
    } else {
        // Nếu không có dữ liệu user, hiển thị nút "Đăng nhập"
        const loginLink = `
            <li class="nav-item">
                <a class="nav-link" href="/login"><i class="fas fa-sign-in-alt"></i> Đăng nhập</a>
            </li>
        `;
        authLinks.innerHTML = loginLink;
    }
});
document.addEventListener("DOMContentLoaded", function () {
    fetchCategories();
    fetchBooks(localStorage.getItem("selectedCategoryId"),0);
    fetchCategoryFilter();
});

async function fetchBooks(categoryId, rating) {
    try {
        const response = await fetch("http://localhost:8080/bookInCategory/" + categoryId + "/" + rating);
        const books = await response.json();
        const sizeBook = document.getElementById("sizeBook");
        sizeBook.innerHTML =
            "Có tất cả: " + books.length + " cuốn sách trong thư viện";
        paginateBooks(books, 1); // Hiển thị trang đầu tiên
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

const paginateBooks = (books, currentPage) => {
    const booksPerPage = 8; // Số sách trên mỗi trang
    const totalPages = Math.ceil(books.length / booksPerPage); // Tính tổng số trang
    const startIndex = (currentPage - 1) * booksPerPage; // Tính chỉ số bắt đầu của trang hiện tại
    const endIndex = startIndex + booksPerPage; // Tính chỉ số cuối của trang hiện tại
    const paginatedBooks = books.slice(startIndex, endIndex); // Lấy các sách của trang hiện tại

    const bookList = document.getElementById("bookList");
    bookList.innerHTML = ""; // Xóa danh sách sách cũ

    // Phân trang
    paginatedBooks.forEach((book) => {
        const bookCard = document.createElement("div");
        bookCard.className = "col-md-3 mb-3 d-flex align-items-stretch";
        bookCard.innerHTML = `
            <div class="card" style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: box-shadow 0.3s ease-in-out;">
                <img src="${book.image}" class="card-img-top" alt="Book Cover" style="padding: 10px; height: 300px; width: 100%; object-fit: contain;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${book.title}</h5>
                    <div class="mt-auto">
                        <p class="card-rating">
                            <em>
                                ${book.rating}/5
                                ${[...Array(5)].map((_, i) => {
                                    if (i < Math.floor(book.rating)) {
                                        return '<i class="fas fa-star" style="color: gold;"></i>';
                                    } else if (i < book.rating) {
                                        return '<i class="fas fa-star-half-alt" style="color: gold;"></i>';
                                    } else {
                                        return '<i class="far fa-star" style="color: gold;"></i>';
                                    }
                                }).join('')}
                            </em>
                        </p>
                        <p class="card-category"><em>Thể Loại: ${book.category}</em></p>
                        <a href="#" class="btn btn-primary" onClick="listenNow(${book.id})"><i class="fas fa-play"></i> Listen Now</a>
                    </div>
                </div>
            </div>
        `;
        bookList.appendChild(bookCard);
    });

    const pagination = document.getElementById("pagination");
    pagination.innerHTML = ""; // Xóa các nút phân trang cũ

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.className = `page-item${i === currentPage ? " active" : ""}`; //tạo class active cho trang hiện tại
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageItem.addEventListener("click", (event) => {
            event.preventDefault();
            paginateBooks(books, i); // Hiển thị trang thứ i
        });
        pagination.appendChild(pageItem); // Thêm nút phân trang vào phần tử <ul>
    }
};

//tim kiem
document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const searchValue = searchInput.value.trim();
    if (searchValue) {
        localStorage.setItem('keywordToSearch', searchValue);
        window.location.href = 'ResultSearch.html';
    }
    else {
        alert('Vui lòng nhập từ khóa tìm kiếm.');
    }
});

//Bộ lọc
async function fetchCategoryFilter() {
    try {
        const response = await fetch('http://localhost:8080/category/getCategories');
        const categories = await response.json();
        const categoryFilter = document.getElementById('categoryFilter');
        categories.forEach(category => {
            const categoryOption = `<option value="${category.id}">${category.name}</option>`;
            categoryFilter.innerHTML += categoryOption;
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}
const applyFilters = () => {
    const categoryId = document.getElementById("categoryFilter").value;
    const rating = document.getElementById("ratingFilter").value;
    fetchBooks(categoryId, rating);
};