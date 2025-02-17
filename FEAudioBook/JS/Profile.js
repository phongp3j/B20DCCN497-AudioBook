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
async function fetchUserInformation() {
    try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const response = await fetch(
            `http://localhost:8080/user/get-user/${userData.username}`
        );
        const user = await response.json();
        document.getElementById("username").value = user.username;
        document.getElementById("fullname").value = user.fullname;
        document.getElementById("email").value = user.email;
        document.getElementById("phone").value = user.phonenumber;
    } catch (error) {
        console.error("Error fetching user information:", error);
    }
}
const cancel = () => {
    window.location.href = "Home.html";
};
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
document.getElementById("updateProfileForm").addEventListener("submit", async function(event){
    event.preventDefault();
    const notification = document.getElementById("notification");
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("newConfirmPassword").value;
    if (newPassword !== confirmPassword || newPassword === "" || confirmPassword === "") {
        notification.style.color = "red";
        notification.style.display = "block";
        notification.innerHTML = "Mật khẩu xác nhận không khớp!";
        return;
    }
    const userData = JSON.parse(localStorage.getItem("userData"));
    const username = userData.username;
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const oldPassword = document.getElementById("oldPassword").value;
    const response = await fetch(`http://localhost:8080/user/change-profile/${username}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            fullname: fullname,
            phonenumber: phone,
            email: email,
            oldPassword: oldPassword,
            newPassword: newPassword
        })
    });
    if (await response.text() === "Change profile success!") {
        alert("Cập nhật thông tin thành công!");
        window.location.href = "Profile.html";
    } else {
        notification.style.color = "red";
        notification.style.display = "block";
        notification.innerHTML = "Cập nhật thông tin không thành công, vui lòng kiểm tra lại!";
        return;
    }
});
document.addEventListener("DOMContentLoaded", function(){
    fetchCategories();
    fetchUserInformation();
});

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