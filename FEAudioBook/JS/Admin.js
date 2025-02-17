const mainContent = document.getElementById('mainContent');
const updateActiveMenu = (activeId) => {
    const menuItems = document.querySelectorAll('.sidebar a');
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.id === activeId) {
            item.classList.add('active');
        }
    });
};
var selectedContent = "";
document.getElementById('userManagement').addEventListener('click', function () {
    // Ẩn nội dung chính
    if (selectedContent === "") {
        document.getElementById('mainContent').classList.add('d-none');
        document.getElementById('userTable').classList.remove('d-none');
        selectedContent = "userTable";
    }
    else {
        document.getElementById(selectedContent).classList.add('d-none');
        // Hiện bảng người dùng
        document.getElementById('userTable').classList.remove('d-none');
        selectedContent = "userTable";
    }
    // Lấy dữ liệu người dùng
    fetchUsers();
    // Cập nhật menu hiện tại
    updateActiveMenu('userManagement');
});
let users = []; // Danh sách người dùng lấy từ API
let filteredUsers = []; // Danh sách người dùng sau khi tìm kiếm
let currentPage = 1;
const usersPerPage = 5; // Số người dùng trên mỗi trang
let totalPages = 0;
// Hàm để tìm kiếm người dùng
const searchUsers = () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.fullname.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    currentPage = 1; // Reset lại trang về 1
    displayUsers();
};
// Bắt sự kiện khi nhấn nút tìm kiếm
document.getElementById('searchButton').addEventListener('click', searchUsers);
// Khi trang được tải, mặc định danh sách người dùng đầy đủ
document.addEventListener('DOMContentLoaded', async () => {
    await fetchUsers();
    filteredUsers = users; // Hiển thị toàn bộ người dùng trước khi tìm kiếm
    displayUsers();
});
const fetchUsers = async () => {
    try {
        const response = await fetch('http://localhost:8080/user/get-user');
        users = await response.json();
        totalPages = Math.ceil(users.length / usersPerPage);
        displayUsers();
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
// Cập nhật hàm displayUsers() để sử dụng danh sách filteredUsers
const displayUsers = () => {
    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const paginatedUsers = filteredUsers.slice(start, end);
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';
    paginatedUsers.forEach(user => {
        var row = `
      <tr>
        <td>${user.username}</td>
        <td>${user.fullname}</td>
        <td>${user.phonenumber}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editUser('${user.username}')">Sửa</button>
          <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.username}')">Xóa</button>
        </td>
      </tr>
    `;
        userTableBody.insertAdjacentHTML('beforeend', row);
    });
    document.getElementById('prevPage').style.display = currentPage === 1 ? 'none' : 'block';
    document.getElementById('nextPage').style.display = end >= filteredUsers.length ? 'none' : 'block';
    document.getElementById('pageInfo').innerHTML = `Trang ${currentPage} / ${totalPages}`;
};
const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    currentPage = newPage;
    displayUsers();
};
// Gọi hàm fetchUsers() để lấy dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', fetchUsers);
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayUsers();
    }
});
document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage * usersPerPage < users.length) {
        currentPage++;
        displayUsers();
    }
});
///////////////////////Xoa nguoi dung/////////////////////////////////////////
let userToDelete = '';
const deleteUser = (username) => {
    // Tìm người dùng theo username
    const user = users.find(u => u.username === username);
    if (!user) {
        console.error('User not found');
        return;
    }
    // Lưu thông tin người dùng để xóa
    userToDelete = username;
    // Hiển thị đầy đủ thông tin người dùng trong modal
    document.getElementById('modalUsername').innerText = user.username;
    document.getElementById('modalFullname').innerText = user.fullname;
    document.getElementById('modalPhonenumber').innerText = user.phonenumber;
    document.getElementById('modalEmail').innerText = user.email;
    document.getElementById('modalRole').innerText = user.role;
    // Hiển thị modal
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    confirmDeleteModal.show();
};
// Xử lý khi người dùng nhấn nút Xác nhận trong modal
document.getElementById('confirmDeleteButton').addEventListener('click', async function () {
    try {
        // Gửi yêu cầu xóa người dùng qua API
        await fetch(`http://localhost:8080/user/${userToDelete}`, { method: 'DELETE' });
        // Sau khi xóa thành công, ẩn modal
        alert('Xóa người dùng thành công!');
        const confirmDeleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
        confirmDeleteModal.hide();
        // Tải lại danh sách người dùng
        await fetchUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
});
/////////////////////////update nguoi dung//////////////////////
let userToEdit = null; // User cần update
const editUser = (username) => {
    // Tìm người dùng theo username
    const user = users.find(u => u.username === username);
    if (!user) {
        console.error('User not found');
        return;
    }
    // Lưu thông tin người dùng để chỉnh sửa
    userToEdit = user;
    // Điền thông tin người dùng vào form chỉnh sửa
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editFullname').value = user.fullname;
    document.getElementById('editPhonenumber').value = user.phonenumber;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editRole').value = user.role;
    // Hiển thị modal chỉnh sửa
    const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
    editUserModal.show();
};
// Xử lý khi người dùng nhấn nút "Lưu" trong modal
document.getElementById('saveUserButton').addEventListener('click', async function () {
    if (!userToEdit) return;
    const roleMapping = {
        'ADMIN': 1,
        'USER': 2
    };
    // Lấy dữ liệu từ form và tạo request body theo DTO
    const updatedUser = {
        fullname: document.getElementById('editFullname').value,
        phonenumber: document.getElementById('editPhonenumber').value,
        email: document.getElementById('editEmail').value,
        roleId: roleMapping[document.getElementById('editRole').value],
    };
    try {
        const response = await fetch(`http://localhost:8080/user/${userToEdit.username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        });
        if (!response.ok) {
            throw new Error('Failed to update user');
        }
        // Cập nhật thành công, ẩn modal và tải lại danh sách người dùng
        alert('Cập nhật người dùng thành công!');
        const editUserModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
        editUserModal.hide();
        await fetchUsers();
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Cập nhật người dùng thất bại');
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var categories = [];
var filteredCategories = [];
let currentCategoryPage = 1;
const categoriesPerPage = 5; // Số danh mục trên mỗi trang
let totalCategoryPages = 0;
document.getElementById('categoryManagement').addEventListener('click', function () {
    // Ẩn nội dung chính
    if (selectedContent === "") {
        document.getElementById('mainContent').classList.add('d-none');
        document.getElementById('categoryTable').classList.remove('d-none');
        selectedContent = "categoryTable";
    }
    else {
        document.getElementById(selectedContent).classList.add('d-none');
        // Hiện bảng category
        document.getElementById('categoryTable').classList.remove('d-none');
        selectedContent = "categoryTable";
    }
    fetchCategories();
    updateActiveMenu('categoryManagement');
});
const fetchCategories = async () => {
    try {
        var response = await fetch('http://localhost:8080/category/getCategories');
        categories = await response.json();
        filteredCategories = categories; // Hiển thị toàn bộ danh mục trước khi tìm kiếm
        totalCategoryPages = Math.ceil(categories.length / categoriesPerPage);
        displayCategories();
    } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Không thể tải dữ liệu danh mục.');
    }
};
// Cập nhật hàm displayCategories() để sử dụng danh sách filteredCategories
const displayCategories = () => {
    const start = (currentCategoryPage - 1) * categoriesPerPage;
    const end = start + categoriesPerPage;
    const paginatedCategories = filteredCategories.slice(start, end);
    const categoryTableBody = document.getElementById('categoryTableBody');
    categoryTableBody.innerHTML = '';
    paginatedCategories.forEach(category => {
        const rowHTML = `
            <tr>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>${category.books}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editCategory(${category.id})">Chỉnh sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id})">Xóa</button>
                </td>
            </tr>
        `;
        categoryTableBody.insertAdjacentHTML('beforeend', rowHTML);
    });
    document.getElementById('categoryPrevPage').style.display = currentCategoryPage === 1 ? 'none' : 'block';
    document.getElementById('categoryNextPage').style.display = end >= filteredCategories.length ? 'none' : 'block';
    document.getElementById('categoryPageInfo').innerHTML = `Trang ${currentCategoryPage} / ${totalCategoryPages}`;
};

const changeCategoryPage = (newPage) => {
    if (newPage < 1 || newPage > totalCategoryPages) return;
    currentCategoryPage = newPage;
    displayCategories();
};

// Gọi hàm fetchCategories() để lấy dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', fetchCategories);

document.getElementById('categoryPrevPage').addEventListener('click', () => {
    if (currentCategoryPage > 1) {
        currentCategoryPage--;
        displayCategories();
    }
});

document.getElementById('categoryNextPage').addEventListener('click', () => {
    if (currentCategoryPage * categoriesPerPage < categories.length) {
        currentCategoryPage++;
        displayCategories();
    }
});
// Lắng nghe sự kiện khi nhấn nút Thêm danh mục
document.getElementById('categoryAddButton').addEventListener('click', function () {
    // Hiển thị modal
    const addCategoryModal = new bootstrap.Modal(document.getElementById('addCategoryModal'));
    addCategoryModal.show();
});
// Xử lý sự kiện khi nhấn nút Thêm trong modal
document.getElementById('addCategoryButton').addEventListener('click', function () {
    const categoryName = document.getElementById('categoryName').value;
    if (categoryName.trim() === "") {
        alert("Tên danh mục không được để trống!");
        return;
    }
    // Tạo đối tượng categoryRequest để gửi lên server
    var categoryRequest = {
        name: categoryName
    };
    // Gọi API để thêm danh mục
    fetch('http://localhost:8080/category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryRequest)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi thêm danh mục');
            }
            return response.text(); // Chuyển đổi phản hồi sang text
        })
        .then(data => {
            console.log("Phản hồi từ server:", data);
            if (data === "Success!") {
                // Đóng modal
                const addCategoryModal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
                addCategoryModal.hide();
                // Xóa nội dung input
                document.getElementById('categoryName').value = '';
                alert("Thêm danh mục thành công!");
            } else if (data === "Failed!") {
                alert("Thêm danh mục không thành công. Danh mục đã tồn tại.");
            }
        })
        .catch(error => {
            console.error("Có lỗi xảy ra:", error);
            alert("Có lỗi xảy ra khi thêm danh mục. Vui lòng thử lại.");
        });
});
/////////////////////////update category//////////////////////
let idCategoryToEdit = null;
const editCategory = (idCategory) => {
    const category = categories.find(u => u.id === idCategory);
    if (!category) {
        return;
    }
    idCategoryToEdit = idCategory;
    document.getElementById('editCategory').value = category.name;
    // Hiển thị modal chỉnh sửa
    const editCategoryModal = new bootstrap.Modal(document.getElementById('editCategoryModal'));
    editCategoryModal.show();
};
// Xử lý khi người dùng nhấn nút "Lưu" trong modal
document.getElementById('saveCategoryButton').addEventListener('click', async function () {
    // Lấy dữ liệu từ form và tạo request body theo DTO
    const updateCategory = {
        name: document.getElementById('editCategory').value
    };
    try {
        const response = await fetch(`http://localhost:8080/category/${idCategoryToEdit}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateCategory),
        });
        if (!response.ok) {
            throw new Error('Failed to update category');
        }
        var dataResponse = await response.text();
        if (dataResponse === "Success!") {
            alert('Cập nhật danh mục thành công!');
        }
        else {
            alert('Cập nhật danh mục không thành công!');
        }
        const editCategoryModal = bootstrap.Modal.getInstance(document.getElementById('editCategoryModal'));
        editCategoryModal.hide();
        await fetchCategories();
    } catch (error) {
        alert('Cập nhật danh mục thất bại');
    }
});
///////////////////////Xoa danh mục/////////////////////////////////////////
let idCategoryToDelete = null;
const deleteCategory = (idCategory) => {
    const category = categories.find(u => u.id === idCategory);
    if (!category) {
        return;
    }
    idCategoryToDelete = category.id;
    document.getElementById('modalCategory').innerText = category.name;
    // Hiển thị modal
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModalCategory'));
    confirmDeleteModal.show();
};
// Xử lý khi người dùng nhấn nút Xác nhận trong modal
document.getElementById('confirmDeleteCategoryButton').addEventListener('click', async function () {
    try {
        await fetch(`http://localhost:8080/category/${idCategoryToDelete}`, { method: 'DELETE' });
        console.log('ID to delete:', idCategoryToDelete);
        // Sau khi xóa thành công, ẩn modal
        alert('Xóa danh mục thành công!');
        const confirmDeleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModalCategory'));
        confirmDeleteModal.hide();
        // Tải lại danh sách người dùng
        await fetchCategories();
    } catch (error) {
        console.error('Error deleting category:', error);
    }
});
// Hàm để tìm kiếm danh mục
const searchCategories = () => {
    const searchTerm = document.getElementById('categorySearchInput').value.toLowerCase();
    filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm)
    );
    totalCategoryPages = Math.ceil(filteredCategories.length / categoriesPerPage);
    currentCategoryPage = 1; // Reset lại trang về 1
    displayCategories(); // Hiển thị danh mục đã lọc
};
// Bắt sự kiện khi nhấn nút tìm kiếm
document.getElementById('categorySearchButton').addEventListener('click', searchCategories);
// Bắt sự kiện khi người dùng nhập vào ô tìm kiếm (tự động tìm kiếm)
document.getElementById('categorySearchInput').addEventListener('input', searchCategories);
// Khi trang được tải, mặc định hiển thị toàn bộ danh mục
document.addEventListener('DOMContentLoaded', async () => {
    await fetchCategories();
    filteredCategories = categories; // Hiển thị toàn bộ danh mục
    displayCategories();
});
///////////////////////////////////////////////Book Management/////////////////////////////////////////////////////////////
var books = [];
var filteredBooks = [];
let currentBookPage = 1;
const booksPerPage = 5; // Số sách trên mỗi trang
let totalBookPages = 0;
// Lắng nghe sự kiện click trên button quản lý sách
document.getElementById('bookManagement').addEventListener('click', function () {
    // Ẩn nội dung chính
    if (selectedContent === "") {
        document.getElementById('mainContent').classList.add('d-none');
    } else {
        document.getElementById(selectedContent).classList.add('d-none');
    }
    // Hiển thị bảng sách
    document.getElementById('bookTable').classList.remove('d-none');
    selectedContent = "bookTable"; // Cập nhật nội dung được chọn
    fetchBooks(); // Gọi hàm fetchBooks để lấy sách
    filteredBooks = books; // Hiển thị toàn bộ sách trước khi tìm kiếm
    updateActiveMenu('bookManagement');
});
// Hàm lấy dữ liệu sách từ API
const fetchBooks = async () => {
    try {
        const response = await fetch('http://localhost:8080/book/0/0');
        books = await response.json();
        totalBookPages = Math.ceil(books.length / booksPerPage);
        displayBooks(); // Gọi hàm để hiển thị danh sách sách sau khi fetch
    } catch (error) {
        alert('Không thể tải dữ liệu sách.');
    }
};
// Hàm để tìm kiếm sách
const searchBooks = () => {
    const searchTerm = document.getElementById('bookSearchInput').value.toLowerCase();
    filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.category.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
    );
    totalBookPages = Math.ceil(filteredBooks.length / booksPerPage);
    currentBookPage = 1; // Reset lại trang về 1
    displayBooks();
};
// Bắt sự kiện khi nhấn nút tìm kiếm
document.getElementById('bookSearchButton').addEventListener('click', searchBooks);
// Bắt sự kiện khi người dùng nhập vào ô tìm kiếm (tự động tìm kiếm)
document.getElementById('bookSearchInput').addEventListener('input', searchBooks);
/// Hàm hiển thị sách
const displayBooks = () => {
    const start = (currentBookPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    const paginatedBooks = filteredBooks.slice(start, end);
    const bookTableBody = document.getElementById('bookTableBody');
    bookTableBody.innerHTML = ''; // Xóa nội dung cũ
    // Hiển thị sách
    paginatedBooks.forEach(book => {
        const rowHTML = `
             <tr>
                 <td>${book.id}</td>
                 <td><img src="${book.image}" alt="Book Cover" style="width: 100px; height: auto;"></td>
                 <td>${book.title}</td>
                 <td>${book.category}</td>
                 <td>${book.author}</td>
                 <td>
                     <button class="btn btn-primary btn-sm" onclick="viewBook(${book.id})">Xem</button>
                     <button class="btn btn-warning btn-sm" onclick="editBook(${book.id})">Sửa</button>
                     <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Xóa</button>
                     <button class="btn btn-primary  btn-sm" onclick="reviewsOfBook(${book.id})">Quản lý đánh giá</button>
                 </td>
             </tr>
         `;
        bookTableBody.insertAdjacentHTML('beforeend', rowHTML);
    });
    document.getElementById('bookPrevPage').style.display = currentBookPage === 1 ? 'none' : 'block';
    document.getElementById('bookNextPage').style.display = end >= filteredBooks.length ? 'none' : 'block';
    document.getElementById('bookPageInfo').innerHTML = `Trang ${currentBookPage} / ${totalBookPages}`;
};
const changeBookPage = (newPage) => {
    if (newPage < 1 || newPage > totalBookPages) return;
    currentBookPage = newPage;
    displayBooks();
};
document.getElementById('bookPrevPage').addEventListener('click', () => {
    if (currentBookPage > 1) {
        currentBookPage--;
        displayBooks();
    }
});

document.getElementById('bookNextPage').addEventListener('click', () => {
    if (currentBookPage * booksPerPage < books.length) {
        currentBookPage++;
        displayBooks();
    }
});
// Gọi hàm fetchBooks() để lấy dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', fetchBooks);
// Bắt sự kiện khi nhấn nút tìm kiếm
document.getElementById('bookSearchButton').addEventListener('click', searchBooks);
// Bắt sự kiện khi người dùng nhập vào ô tìm kiếm (tự động tìm kiếm)
document.getElementById('bookSearchInput').addEventListener('input', searchBooks);
// Hàm xem chi tiết sách
const viewBook = (bookId) => {
    // Lưu id sách vào localStorage
    localStorage.setItem('bookIdToViewDetailAdmin', bookId);
    // Điều hướng tới trang chi tiết sách
    window.location.href = 'ViewBookDetailAdmin.html';
};
// Hàm xoá sách
const deleteBook = (bookId) => {
    // Lưu id sách vào localStorage
    localStorage.setItem('bookIdToDeleteAdmin', bookId);
    // Điều hướng tới trang chi tiết sách
    window.location.href = 'DeleteBook.html';
};
// Hàm update sách
const editBook = (bookId) => {
    // Lưu id sách vào localStorage
    localStorage.setItem('bookIdToUpdateAdmin', bookId);
    // Điều hướng tới trang chi tiết sách
    window.location.href = 'UpdateBookAdmin.html';
};
// Hàm xem đánh giá sách
const reviewsOfBook = (bookId) => {
    // Lưu id sách vào localStorage
    localStorage.setItem('bookIdToManagementReviewAdmin', bookId);
    // Điều hướng tới trang chi tiết sách
    window.location.href = 'ManagementReview.html';
};
////////////////////////////////////////////////////////sinh audio///////////////////////////////////////////////
document.getElementById('generateAudio').addEventListener('click', function () {
    // Ẩn nội dung chính
    if (selectedContent === "") {
        document.getElementById('mainContent').classList.add('d-none');
        document.getElementById('generateAudioForm').classList.remove('d-none');
        selectedContent = "generateAudioForm";
    }
    else {
        document.getElementById(selectedContent).classList.add('d-none');
        // Hiện bảng người dùng
        document.getElementById('generateAudioForm').classList.remove('d-none');
        selectedContent = "generateAudioForm";
    }
    // Cập nhật menu hiện tại
    updateActiveMenu('generateAudio');
});
async function generateAudio() {
    const textInput = document.getElementById("textInput").value;
    const audioFile = document.getElementById('audioFile').files[0];
    if (textInput.length == 0) {
        alert("Vui lòng nhập văn bản để tiếp tục.");
        return;
    }
    let audioUrl;
    if (audioFile) {
        audioUrl = await uploadAudio(audioFile);
        const audioPlayer = document.getElementById("audioPlayer");
        audioPlayer.innerHTML = `
        <div>
              <i id="textProgressBarUpdate" >Đang tải thông tin, vui lòng chờ</i>
              <div class="progress" id="updateAudioProgress" >
                <div class="progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            </div>
            `;
        generateAudioAdmin(textInput, audioUrl);
    }
    else {
        alert("Vui lòng chọn file audio để tiếp tục.");
        return;
    }
}

// Hàm để phát giọng người dùng và gửi dữ liệu đến API
async function generateAudioAdmin(text, audioFile) {
    try {
        // Tạo formData để gửi tới API
        const formData = new FormData();
        formData.append("text", text); // Gửi text
        formData.append("audio_url", audioFile); // Gửi audio dưới dạng File

        // Gửi yêu cầu tới API bằng fetch
        const response = await fetch(
            "https://9a28-34-125-188-234.ngrok-free.app/generate", // Thay api ở đây
            {
                method: "POST",
                body: formData,
            }
        );
        console.log("API Response:", response);
        // Xử lý phản hồi từ API
        if (response.ok) {
            const data = await response.json();
            console.log("API Response:", data);
            // Cập nhật nội dung của audioPlayer
            const audioUrlReceive = document.getElementById("audioUrlReceive");
            audioUrlReceive.innerHTML = "Link tải file Audio: " + data.audio_file_url;
            audioPlayer.innerHTML = `
                <h4>Now Playing:</h4>
                <div id="waveform"></div>
                <button id="playPauseBtn" class="play-pause-btn">
                    <div class="play-icon"></div>
                    <div class="pause-icon"></div>
                </button>
                <div id="time-display">00:00 / 00:00</div>
            `;
            // Tạo WaveSurfer
            const wavesurfer = WaveSurfer.create({
                container: '#waveform', // Chọn phần tử HTML để hiển thị sóng âm
                waveColor: '#A8DBA8',   // Màu của sóng âm
                progressColor: '#3B8686', // Màu của sóng âm khi phát
                barWidth: 2,            // Độ rộng của mỗi thanh sóng
                height: 100,            // Chiều cao của waveform
                responsive: true
            });
            // Tải file âm thanh từ URL vào WaveSurfer
            wavesurfer.load(data.audio_file_url);
            // Xử lý Play/Pause khi nhấn nút
            document.getElementById('playPauseBtn').addEventListener("click", function () {
                wavesurfer.playPause();
                updatePlayPauseIcon();
            });
            // Cập nhật thời gian phát
            wavesurfer.on('audioprocess', function () {
                const currentTime = formatTime(wavesurfer.getCurrentTime());
                const duration = formatTime(wavesurfer.getDuration());
                document.getElementById('time-display').textContent = `${currentTime} / ${duration}`;
            });
            // Định dạng thời gian (MM:SS)
            function formatTime(seconds) {
                const minutes = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            // Hàm cập nhật biểu tượng nút Play/Pause
            function updatePlayPauseIcon() {
                const playPauseBtn = document.getElementById("playPauseBtn");
                if (wavesurfer.isPlaying()) {
                    playPauseBtn.classList.remove('show-play');
                    playPauseBtn.classList.add('show-pause');
                } else {
                    playPauseBtn.classList.remove('show-pause');
                    playPauseBtn.classList.add('show-play');
                }
            }
        } else {
            console.error("Error with API request:", response.status);
            audioPlayer.innerHTML = `
                <i>Không thể lấy dữ liệu từ server, vui lòng thử lại!</i>`;
        }
    } catch (error) {
        console.error("API call failed:", error);
        audioPlayer.innerHTML = `
                <i>Không thể lấy dữ liệu từ server, vui lòng thử lại!</i>`;
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function () {
    // Lấy dữ liệu từ localStorage
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    // Kiểm tra xem userData có tồn tại và role có phải là 'ADMIN'
    if (storedUserData && storedUserData.role === 'ADMIN') {
        document.querySelector('.user-info').innerText = `Xin chào, ${storedUserData.username}`;
    } else {
        // Nếu không phải admin, chuyển hướng về trang login
        alert('Bạn không có quyền truy cập trang này!');
        window.location.href = 'Login.html';
    }
});
// Xử lý khi nhấn nút Đăng xuất
function logout() {
    // Xóa dữ liệu trong localStorage
    localStorage.removeItem('userData');
    // Thông báo và chuyển hướng về trang đăng nhập
    alert('Đăng xuất thành công!');
    window.location.href = 'Login.html';
}
// Hàm tải lên file audio và nhận về đường dẫn
async function uploadAudio(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('http://localhost:8080/generatePath', {
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        throw new Error('Audio upload failed');
    }
    // Trả về đường dẫn của audio
    const audioUrl = await response.text();
    return audioUrl;
}

///////////////////////////////////////////////////Thống kê///////////////////////////////////////////////
document.getElementById('statisticalReview').addEventListener('click', function () {
    // Ẩn nội dung chính
    if (selectedContent === "") {
        document.getElementById('mainContent').classList.add('d-none');
        document.getElementById('statisticReviewForm').classList.remove('d-none');
        selectedContent = "statisticReviewForm";
    }
    else {
        document.getElementById(selectedContent).classList.add('d-none');
        // Hiện bảng người dùng
        document.getElementById('statisticReviewForm').classList.remove('d-none');
        selectedContent = "statisticReviewForm";
    }
    // Cập nhật menu hiện tại
    fetchBooksStat();
    updateActiveMenu('statisticalReview');
});
async function fetchChartData() {
    try {
        const response = await fetch('http://localhost:8080/statReviews');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching chart data:', error);
        return null;
    }
}

async function renderChart() {
    const chartData = await fetchChartData();
    if (!chartData) return;

    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['5 sao', '4 sao', '3 sao', '2 sao', '1 sao'],
            datasets: [{
                data: [
                    chartData['5s'] * 100,
                    chartData['4s'] * 100,
                    chartData['3s'] * 100,
                    chartData['2s'] * 100,
                    chartData['1s'] * 100
                ],
                backgroundColor: ['#0d6efd', '#e9ecef', '#ffc107', '#dc3545', '#6c757d'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                datalabels: {
                    formatter: (value, context) => {
                        return value.toFixed(1) + '%';
                    },
                    color: '#fff',
                    font: {
                        weight: 'bold'
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

document.addEventListener('DOMContentLoaded', renderChart);
var booksStat = [];
var filteredBooksStat = [];
// Hàm lấy dữ liệu sách từ API
const fetchBooksStat = async () => {
    try {
        const response = await fetch('http://localhost:8080/book/0/0');
        booksStat = await response.json();
        displayBooksStat(); // Gọi hàm để hiển thị danh sách sách sau khi fetch
    } catch (error) {
        alert('Không thể tải dữ liệu sách.');
    }
};
/// Hàm hiển thị sách
const displayBooksStat = () => {
    const bookTableBody = document.getElementById('bookTableStatBody');
    bookTableBody.innerHTML = ''; // Xóa nội dung cũ
    const booksToDisplay = filteredBooksStat.length > 0 ? filteredBooksStat : books; // Nếu không có kết quả lọc, hiển thị tất cả sách
    // Kiểm tra nếu không có sách nào để hiển thị
    if (booksToDisplay.length === 0) {
        alert('Không có dữ liệu'); // Hiển thị cảnh báo
        return; // Kết thúc hàm
    }
    // Hiển thị sách
    booksToDisplay.forEach(book => {
        const rowHTML = `
             <tr>
                 <td>${book.id}</td>
                 <td><img src="${book.image}" alt="Book Cover" style="width: 100px; height: auto;"></td>
                 <td>${book.title}</td>
                 <td>${book.category}</td>
                 <td>${book.author}</td>
                 <td>
                     <button class="btn btn-warning  btn-sm" onclick="statReviewsOfBook(${book.id})">Xem Thống Kê</button>
                 </td>
             </tr>
         `;
        bookTableBody.insertAdjacentHTML('beforeend', rowHTML);
    });
};
// Tìm kiếm sách
const searchBooksStat = () => {
    const searchTerm = document.getElementById('bookSearchInputStat').value.toLowerCase();
    filteredBooksStat = booksStat.filter(book =>
        book.title.toLowerCase().includes(searchTerm)
    );
    console.log(filteredBooksStat);
    displayBooksStat(); // Gọi hàm để hiển thị danh sách sách đã lọc
};
// Bắt sự kiện khi nhấn nút tìm kiếm
document.getElementById('bookSearchButtonStat').addEventListener('click', searchBooksStat);
// Bắt sự kiện khi người dùng nhập vào ô tìm kiếm (tự động tìm kiếm)
document.getElementById('bookSearchInputStat').addEventListener('input', searchBooksStat);

const statReviewsOfBook = (bookId) => {
    // Lưu id sách vào localStorage
    localStorage.setItem('bookIdToStatReviewAdmin', bookId);
    // Điều hướng tới trang chi tiết sách
    window.location.href = 'StatisticalReview.html';
};