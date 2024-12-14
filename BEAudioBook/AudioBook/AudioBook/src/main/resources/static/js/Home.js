async function fetchFeaturedBooks() {
    try {
        // Fetch data from the API
        const response = await fetch('http://localhost:8080/book');
        const data = await response.json();
        const featuredBooksContainer = document.getElementById('featuredBooks');
        // Slice the first 6 books
        const featuredBooks = data.slice(0, 6);
        // Dynamically create the HTML for each book
        featuredBooks.forEach(book => {
            const bookCard = `
                <div class="col-md-4 mb-4 d-flex align-items-stretch">
                    <div class="card">
                        <img src="${book.image}" class="card-img-top" alt="Book Cover">
                        <div class="card-body">
                            <h5 class="card-title">${book.title}</h5>
                            <p class="card-text">${book.description}</p>
                            <a href="#" class="btn btn-primary" onClick="listenNow(${book.id})"><i class="fas fa-play"></i> Listen Now</a>
                        </div>
                    </div>
                </div>
            `;
            // Append each book card to the container
            featuredBooksContainer.innerHTML += bookCard;
        });
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}
async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:8080/category/getCategories');
        const categories = await response.json();
        const categoriesMenu = document.getElementById('categoriesMenu');
        categories.forEach(category => {
            const categoryItem = `
                    <li><a class="dropdown-item" href="/category/${category.id}">
                        <i class="fas fa-book-open"></i> ${category.name}
                    </a></li>
                `;
            categoriesMenu.innerHTML += categoryItem;
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}
function listenNow(bookId) {
    // Save the book ID in localStorage
    localStorage.setItem('selectedBookIdToListen', bookId);
    // Redirect to the listening page
    window.location.href = '/listenAudioBook';
}
document.addEventListener("DOMContentLoaded", function () {
    // Lấy dữ liệu user từ localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    // Lấy phần tử chứa Login/Logout Links
    const authLinks = document.querySelector('.navbar-nav.ms-lg-3');
    if (userData) {
        // Nếu có dữ liệu user, hiển thị dropdown với "Hồ sơ" và "Đăng xuất"
        const userDropdown = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-user">  </i>${userData.username}
                </a>
                <ul class="dropdown-menu" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="#"><i class="fas fa-user-circle"></i> Hồ sơ</a></li>
                    <li><a class="dropdown-item" href="#" id="logoutLink"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a></li>
                </ul>
            </li>
        `;
        authLinks.innerHTML = userDropdown;
        // Xử lý sự kiện khi nhấn vào "Đăng xuất"
        document.getElementById('logoutLink').addEventListener('click', function () {
            // Xóa dữ liệu user khỏi localStorage
            localStorage.removeItem('userData');
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
document.addEventListener("DOMContentLoaded", function(){
    fetchFeaturedBooks();
    fetchCategories();
});