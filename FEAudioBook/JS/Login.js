document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Ngăn chặn trang reload sau khi submit form
    // Lấy thông tin username và password từ form
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    // Tạo object chứa dữ liệu đăng nhập
    var loginData = {
      username: username,
      password: password
    };
    try {
      const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      const data = await response.text(); // lấy phản hồi dưới dạng text
      const loginMessage = document.getElementById('loginMessage');
      if (data === "ADMIN" || data === "USER") {
        // Tạo object lưu trữ username và role
        const userData = {
          username: username,
          role: data // Dữ liệu role trả về từ server (ADMIN hoặc USER)
        };
        // Lưu object JSON vào localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log(JSON.parse(localStorage.getItem('userData')));
        // Chuyển hướng sang trang admin hoặc user dashboard
        window.location.href = (data === "ADMIN") ? 'Admin.html' : 'Home.html';
      } else {
        loginMessage.innerText = data;
        loginMessage.style.color = 'red';
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  