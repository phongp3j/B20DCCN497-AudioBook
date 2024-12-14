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
function bookInCategory(categoryId) {
    localStorage.setItem("selectedCategoryId", categoryId);
    window.location.href = "BookInCategory.html";
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
                <a class="nav-link" href="Login.html"><i class="fas fa-sign-in-alt"></i> Đăng nhập</a>
            </li>
        `;
        authLinks.innerHTML = loginLink;
    }
});
document.addEventListener("DOMContentLoaded", function () {
    fetchCategories();
    fetchVoices();
});
//////////////////////////////////////////
document.getElementById("imageUpload").addEventListener("change", function () {
    const imagePreview = document.getElementById("imagePreview");
    imagePreview.innerHTML = ""; // Clear previous preview
    Array.from(this.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement("img");
            img.src = e.target.result;
            imagePreview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});
// Hàm để lấy danh sách giọng của người dùng
async function fetchVoices() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
        alert("Bạn cần đăng nhập để sử dụng giọng của bạn.");
        return;
    }
    try {
        const response = await fetch(`http://localhost:8080/getMyAudio/${userData.username}`);
        const voices = await response.json();
        const voiceSelect = document.getElementById("voiceSelect");
        voices.forEach(voice => {
            const option = document.createElement("option");
            option.value = voice.audio_url;
            option.textContent = voice.audio_name;
            voiceSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching voices:", error);
    }
}
//////////////////////
async function generateAudio() {
    const files = document.getElementById("imageUpload").files;
    const selectedVoice = document.getElementById("voiceSelect").value;
    const selectedVoiceName = document.getElementById("voiceSelect").textContent;
    if (files.length === 0) {
        alert("Vui lòng tải ảnh lên.");
        return;
    }
    if (selectedVoice == 0) {
        alert("Vui lòng chọn giọng đọc.");
        return;
    }
    let imageUrls = "";
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.innerHTML = `
        <div>
              <i id="textProgressBarUpdate" >Đang tải thông tin, vui lòng chờ</i>
              <div class="progress" id="updateAudioProgress" >
                <div class="progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            </div>
            `;
    for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('http://localhost:8080/generatePath', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error('Image upload failed');
        }
        const url = await response.text();
        imageUrls = imageUrls + url;
    }
    try {
        const extractTextResponse = await fetch('https://1909-34-73-144-75.ngrok-free.app/getText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image_url: imageUrls })
        });
        if (!extractTextResponse.ok) {
            throw new Error('Text extraction failed');
        }
        const extractTextData = await extractTextResponse.json();
        console.log("Extracted text:", extractTextData.text_from_image);
        playUserVoice(extractTextData.text_from_image, selectedVoice,selectedVoiceName);
    } catch (error) {
        alert("Có lỗi xảy ra vui lòng thử lại.");
        location.reload();
    }
}

// Hàm để phát giọng người dùng và gửi dữ liệu đến API
async function playUserVoice(text, audioFile,audioName) {
    try {
        // Tạo formData để gửi tới API
        const formData = new FormData();
        formData.append("text", text); // Gửi text
        formData.append("audio_url", audioFile); // Gửi audio dưới dạng File

        // Gửi yêu cầu tới API bằng fetch
        const response = await fetch(
            "https://86ee-34-125-88-118.ngrok-free.app/generate", // Thay api ở đây
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
            // Biến cờ để xác định play lần đầu
            let isFirstPlay = true;
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
            // Gọi hàm addHistory khi phát âm thanh lần đầu
            wavesurfer.on('play', function () {
                if (isFirstPlay) {
                    addHistory(data.audio_file_url, audioName, "Hình ảnh", "Sinh âm thanh từ hình ảnh");
                    isFirstPlay = false;
                }
            });
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
async function addHistory(audioFile, audioName, chapterTitle, bookTitle) {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
        const time = getCurrentDateTime();
        const history = {
            time: time,
            username: userData.username,
            audioUrl: audioFile,
            nameOfAudio: audioName,
            titleOfChapter: chapterTitle,
            titleOfBook: bookTitle,
        };
        const response = await fetch("http://localhost:8080/listenHistory", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(history),
        });

    }
}
function getCurrentDateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}