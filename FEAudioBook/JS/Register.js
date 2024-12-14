document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn chặn trang reload sau khi submit form
    // Lấy thông tin từ form
    var fullname = document.getElementById('fullname').value.trim();
    var username = document.getElementById('username').value.trim();
    var email = document.getElementById('email').value.trim();
    var phonenumber = document.getElementById('phonenumber').value.trim();
    var password = document.getElementById('password').value.trim();
    var confirmPassword = document.getElementById('confirmPassword').value.trim();
    var registerMessage = document.getElementById('registerMessage');
    // Kiểm tra họ tên không được để trống
    if (fullname === "") {
      registerMessage.innerText = "Full name cannot be empty!";
      registerMessage.style.color = 'red';
      return;
    }
    // Kiểm tra username không có dấu cách
    if (/\s/.test(username)) {
      registerMessage.innerText = "Username cannot contain spaces!";
      registerMessage.style.color = 'red';
      return;
    }
    // Kiểm tra password và confirm password có khớp không
    if (password !== confirmPassword) {
      registerMessage.innerText = "Passwords do not match!";
      registerMessage.style.color = 'red';
      return;
    }
    // Tạo object chứa dữ liệu đăng ký
    var registerData = {
      fullname: fullname,
      username: username,
      email: email,
      phonenumber: phonenumber,
      password: password
    };
    // Fetch API để gửi yêu cầu POST đến API đăng ký
    fetch('http://localhost:8080/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    })
    .then(response => response.text()) // lấy phản hồi dưới dạng text
    .then(data => {
      if (data === "Đăng ký thành công") {
        registerMessage.innerText = data;
        registerMessage.style.color = 'green';
      } else {
        registerMessage.innerText = data;
        registerMessage.style.color = 'red';
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
  