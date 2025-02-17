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
                    <i class="fas fa-user">  </i>&nbsp;${userData.username}
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
                <a class="nav-link" href="Login.html"><i class="fas fa-sign-in-alt"></i> Đăng nhập</a>
            </li>
        `;
        authLinks.innerHTML = loginLink;
    }
});
document.addEventListener("DOMContentLoaded", function () {
    fetchCategories();
    fetchListenHistory();
});
const paginateListenHistory = (listenHistory, currentPage) => {
    const itemsPerPage = 10; // Số lượng listen history mỗi trang
    const totalPages = Math.ceil(listenHistory.length / itemsPerPage); // Tính tổng số trang
    const startIndex = (currentPage - 1) * itemsPerPage; // Chỉ mục bắt đầu của trang hiện tại
    const endIndex = startIndex + itemsPerPage; // Chỉ mục kết thúc của trang hiện tại
    const paginatedHistory = listenHistory.slice(startIndex, endIndex); // Lấy dữ liệu cho trang hiện tại

    const listenHistoryTable = document.getElementById("listenHistoryTableBody");
    listenHistoryTable.innerHTML = ""; // Xóa các hàng cũ

    // Lặp qua các mục trong trang hiện tại và thêm chúng vào DOM
    paginatedHistory.forEach((listen, index) => {
        const listenItem = document.createElement("tr");
        listenItem.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${listen.titleOfBook}</td>
            <td>${listen.titleOfChapter}</td>
            <td>${listen.time}</td>
            <td><a href="${listen.audioUrl}" target="_blank">${listen.audioUrl}</a></td>
            <td>${listen.nameOfAudio}</td>
        `;
        listenHistoryTable.appendChild(listenItem);
    });

    const pagination = document.getElementById("pagination");
    pagination.innerHTML = ""; // Xóa phân trang cũ

    // Tạo các mục phân trang
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.className = `page-item${i === currentPage ? " active" : ""}`; // Thêm lớp 'active' cho trang hiện tại
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;

        // Thêm sự kiện nhấp chuột để chuyển trang
        pageItem.addEventListener("click", (event) => {
            event.preventDefault();
            paginateListenHistory(listenHistory, i); // Gọi lại hàm với trang đã chọn
        });

        pagination.appendChild(pageItem); // Thêm mục phân trang vào DOM
    }
};

// Hàm để tải dữ liệu listen history từ API một lần và hiển thị
async function fetchListenHistory() {
    try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const response = await fetch(`http://localhost:8080/listenHistory/${userData.username}`);
        const listenHistory = await response.json(); // Lưu toàn bộ dữ liệu vào mảng
        paginateListenHistory(listenHistory, 1); // Hiển thị trang đầu tiên
    } catch (error) {
        console.error("Error fetching listen history:", error);
    }
}



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