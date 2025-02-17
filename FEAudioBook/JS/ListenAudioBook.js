async function fetchBookDetails() {
    const bookId = localStorage.getItem("selectedBookIdToListen");
    if (!bookId) {
        console.error("No book ID found in localStorage");
        return;
    }
    try {
        const response = await fetch(`http://localhost:8080/book/${bookId}`);
        const book = await response.json();
        document.getElementById("bookTitle").textContent = book.title;
        document.getElementById("bookDescription").textContent =
            book.description;
        document.getElementById("bookImage").src = book.image;
        document.getElementById("bookImage").style.width = "400px";
        document.getElementById("bookImage").style.height = "500px";
        document.getElementById("bookAuthor").textContent = book.author;
        document.getElementById("bookCategory").textContent = book.category;
        document.getElementById("bookPublished").textContent = book.published;
        if (book.listChapter && book.listChapter.length > 0) {
            const chapterList = document.getElementById("chapterList");
            chapterList.innerHTML = "";
            book.listChapter.forEach((chapter) => {
                const chapterHTML = `
                            <div class="chapter p-3 mb-4 border rounded bg-light shadow-sm">
                                <!-- Tiêu đề chương -->
                                <h3 class="fw-bold mb-3 text-primary">${chapter.title_chapter}</h3>
                                
                                <!-- Dropdown: Chọn giọng có sẵn -->
                                <div class="dropdown mb-2">
                                    <button class="btn btn-outline-primary dropdown-toggle w-100 text-start" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="bi bi-mic"></i> Chọn giọng có sẵn
                                    </button>
                                    <ul class="dropdown-menu w-100">
                                        ${chapter.listAudio
                                            .map(
                                                (audio) => `
                                                    <li>
                                                        <a class="dropdown-item d-flex align-items-center" href="#" onclick="displayAudio('${audio.audio_file}','${audio.audio_name}',${chapter.id},'${chapter.title_chapter}','${book.title}')">
                                                            <i class="bi bi-volume-up me-2"></i> ${audio.audio_name}
                                                        </a>
                                                    </li>
                                                `
                                            )
                                            .join("")}
                                    </ul>
                                </div>
                        
                                <!-- Dropdown: Sử dụng giọng của bạn -->
                                <div class="dropdown mb-2">
                                    <button class="btn btn-outline-secondary dropdown-toggle w-100 text-start" type="button" id="userVoicesBtn${chapter.id}"
                                        data-bs-toggle="dropdown" aria-expanded="false"
                                        onclick="fetchUserVoices(${chapter.id},'${chapter.text}','${chapter.title_chapter}','${book.title}')">
                                        <i class="bi bi-person-voice"></i> Sử dụng giọng của bạn
                                    </button>
                                    <ul class="dropdown-menu w-100" id="userVoicesDropdown${chapter.id}">
                                        <!-- Placeholder for user voices -->
                                        <li><a class="dropdown-item" href="#">No user voices available</a></li>
                                    </ul>
                                </div>
                        
                                <!-- Trình phát Audio -->
                                <div id="audioPlayer${chapter.id}" class="mt-4 p-3 border rounded bg-white shadow-sm">
                                    <div class="text-center text-muted">Chưa có audio nào được chọn.</div>
                                </div>
                            </div>
                        `;
                chapterList.innerHTML += chapterHTML;
            });
        } else {
            document.getElementById("chapterList").innerHTML =
                "<p>No chapters available.</p>";
        }
    } catch (error) {
        console.error("Error fetching book details:", error);
    }
}

function displayAudio(audioFile, audioName, chapterId, chapterTitle, bookTitle) {
    const audioPlayer = document.getElementById(`audioPlayer${chapterId}`);
        // Cập nhật nội dung của audioPlayer
    audioPlayer.innerHTML = `
        <h4>Giọng đọc: ${audioName}</h4>
        <div id="waveform${chapterId}"></div>
        <div class="audio-controls d-flex align-items-center justify-content-center gap-2 my-3">
            <!-- Nút Tua Lại -->
            <button id="seekBackwardBtn${chapterId}" class="btn btn-outline-primary">
                <i class="bi bi-skip-backward-fill"></i> -10s
            </button>
            <!-- Nút Play/Pause -->
            <button id="playPauseBtn${chapterId}" class="play-pause-btn">
                <div class="play-icon"></div>
                <div class="pause-icon"></div>
            </button>
            <!-- Nút Tua Tiến -->
            <button id="seekForwardBtn${chapterId}" class="btn btn-outline-primary">
                +10s <i class="bi bi-skip-forward-fill"></i>
            </button>
            <!-- Dropdown Tốc Độ -->
            <div class="d-flex align-items-center mx-2">
                <i class="bi bi-speedometer me-1"></i>
                <select id="speedSelect${chapterId}" class="form-select form-select-sm w-auto">
                    <option value="0.5">0.5x</option>
                    <option value="1" selected>1x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                </select>
            </div>
        </div>
        <!-- Hiển thị thời gian -->
        <div id="time-display${chapterId}" class="text-center mt-2 fw-bold">
            00:00 / 00:00
        </div>
    `;
    // Khởi tạo Wavesurfer
    const wavesurfer = WaveSurfer.create({
        container: `#waveform${chapterId}`,
        waveColor: '#A8DBA8',
        progressColor: '#3B8686',
        barWidth: 2,
        height: 100,
        responsive: true
    });
    // Tải file âm thanh từ URL
    wavesurfer.load(audioFile);
    // Biến cờ để xác định play lần đầu
    let isFirstPlay = true;
    // Lắng nghe sự kiện 'play' chỉ lần đầu tiên
    wavesurfer.on('play', function () {
        if (isFirstPlay) {
            addHistory(audioFile, audioName, chapterTitle, bookTitle);
            isFirstPlay = false; // Đặt cờ để không chạy lại lần sau
        }
    });
    // Xử lý tua lại 10 giây
    document.getElementById(`seekBackwardBtn${chapterId}`).addEventListener("click", function () {
        wavesurfer.seekTo((wavesurfer.getCurrentTime() - 10) / wavesurfer.getDuration());
    });
    // Xử lý tua tới 10 giây
    document.getElementById(`seekForwardBtn${chapterId}`).addEventListener("click", function () {
        wavesurfer.seekTo((wavesurfer.getCurrentTime() + 10) / wavesurfer.getDuration());
    });
    // Xử lý thay đổi tốc độ phát với select
    document.getElementById(`speedSelect${chapterId}`).addEventListener("change", function () {
        const newSpeed = parseFloat(this.value);
        wavesurfer.setPlaybackRate(newSpeed);
    });
    // Xử lý play/pause với một nút tùy chỉnh
    document.getElementById(`playPauseBtn${chapterId}`).addEventListener("click", function () {
        wavesurfer.playPause();
        updatePlayPauseIcon(); // Cập nhật biểu tượng nút play/pause
    });
    // Cập nhật thời gian phát
    wavesurfer.on('audioprocess', function () {
        const currentTime = formatTime(wavesurfer.getCurrentTime());
        const duration = formatTime(wavesurfer.getDuration());
        document.getElementById(`time-display${chapterId}`).textContent = `${currentTime} / ${duration}`;
    });
    // Định dạng thời gian (MM:SS)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    // Hàm cập nhật biểu tượng nút Play/Pause
    function updatePlayPauseIcon() {
        const playPauseBtn = document.getElementById(`playPauseBtn${chapterId}`);
        if (wavesurfer.isPlaying()) {
            playPauseBtn.classList.remove('show-play');
            playPauseBtn.classList.add('show-pause');
        } else {
            playPauseBtn.classList.remove('show-pause');
            playPauseBtn.classList.add('show-play');
        }
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
// Hàm để lấy danh sách giọng của người dùng
async function fetchUserVoices(chapterId, chapterText, chapterTitle, bookTitle) {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const dropdownMenu = document.getElementById(
        `userVoicesDropdown${chapterId}`
    );
    if (!userData) {
        alert("Bạn cần đăng nhập để sử dụng giọng của bạn.");
        return;
    }

    try {
        // Gọi API để lấy danh sách giọng của người dùng
        const response = await fetch(
            `http://localhost:8080/getMyAudio/${userData.username}`
        );

        if (response.ok) {
            const userVoices = await response.json();

            // Kiểm tra nếu có giọng, hiển thị chúng trong dropdown
            if (userVoices.length > 0) {
                dropdownMenu.innerHTML = userVoices
                    .map(
                        (voice) => `
                <li><a class="dropdown-item" href="#" onclick="playUserVoice('${voice.audio_url}', '${voice.audio_name}', ${chapterId},'${chapterText}','${chapterTitle}','${bookTitle}')">${voice.audio_name}</a></li>
            `
                    )
                    .join("");
            } else {
                dropdownMenu.innerHTML =
                    '<li><a class="dropdown-item" href="#">No user voices available</a></li>';
            }
        } else {
            console.error("Lỗi khi lấy danh sách giọng của người dùng");
        }
    } catch (error) {
        console.error("Error fetching user voices:", error);
    }
}

// Hàm để phát giọng người dùng và gửi dữ liệu đến API
async function playUserVoice(audioFile, audioName, chapterId, chapterText, chapterTitle, bookTitle) {
    const audioPlayer = document.getElementById(`audioPlayer${chapterId}`);

    audioPlayer.innerHTML = `
        <div>
              <i id="textProgressBarUpdate" >Đang tải thông tin, vui lòng chờ</i>
              <div class="progress" id="updateAudioProgress" >
                <div class="progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            </div>
            `;
    try {
        // Tạo formData để gửi tới API
        const formData = new FormData();
        formData.append("text", chapterText); // Gửi chapterText
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
            audioPlayer.innerHTML = `
                <h4>Giọng đọc: ${audioName}</h4>
                <div id="waveform${chapterId}"></div>
                <div class="audio-controls d-flex align-items-center justify-content-center gap-2 my-3">
                    <!-- Nút Tua Lại -->
                    <button id="seekBackwardBtn${chapterId}" class="btn btn-outline-primary">
                        <i class="bi bi-skip-backward-fill"></i> -10s
                    </button>
                    <!-- Nút Play/Pause -->
                    <button id="playPauseBtn${chapterId}" class="play-pause-btn">
                        <div class="play-icon"></div>
                        <div class="pause-icon"></div>
                    </button>
                    <!-- Nút Tua Tiến -->
                    <button id="seekForwardBtn${chapterId}" class="btn btn-outline-primary">
                        +10s <i class="bi bi-skip-forward-fill"></i>
                    </button>
                    <!-- Dropdown Tốc Độ -->
                    <div class="d-flex align-items-center mx-2">
                        <i class="bi bi-speedometer me-1"></i>
                        <select id="speedSelect${chapterId}" class="form-select form-select-sm w-auto">
                            <option value="0.5">0.5x</option>
                            <option value="1" selected>1x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2">2x</option>
                        </select>
                    </div>
                </div>
                <!-- Hiển thị thời gian -->
                <div id="time-display${chapterId}" class="text-center mt-2 fw-bold">
                    00:00 / 00:00
                </div>
            `;
            // Khởi tạo Wavesurfer
            const wavesurfer = WaveSurfer.create({
                container: `#waveform${chapterId}`,
                waveColor: '#A8DBA8',
                progressColor: '#3B8686',
                barWidth: 2,
                height: 100,
                responsive: true
            });
            // Tải file âm thanh từ URL
            wavesurfer.load(data.audio_file_url);
            // Biến cờ để xác định play lần đầu
            let isFirstPlay = true;
            // Lắng nghe sự kiện 'play' chỉ lần đầu tiên
            wavesurfer.on('play', function () {
                if (isFirstPlay) {
                    addHistory(audioFile, audioName, chapterTitle, bookTitle);
                    isFirstPlay = false; // Đặt cờ để không chạy lại lần sau
                }
            });
            // Xử lý tua lại 10 giây
            document.getElementById(`seekBackwardBtn${chapterId}`).addEventListener("click", function () {
                wavesurfer.seekTo((wavesurfer.getCurrentTime() - 10) / wavesurfer.getDuration());
            });
            // Xử lý tua tới 10 giây
            document.getElementById(`seekForwardBtn${chapterId}`).addEventListener("click", function () {
                wavesurfer.seekTo((wavesurfer.getCurrentTime() + 10) / wavesurfer.getDuration());
            });
            // Xử lý thay đổi tốc độ phát với select
            document.getElementById(`speedSelect${chapterId}`).addEventListener("change", function () {
                const newSpeed = parseFloat(this.value);
                wavesurfer.setPlaybackRate(newSpeed);
            });
            // Xử lý play/pause với một nút tùy chỉnh
            document.getElementById(`playPauseBtn${chapterId}`).addEventListener("click", function () {
                wavesurfer.playPause();
                updatePlayPauseIcon(); // Cập nhật biểu tượng nút play/pause
            });
            // Cập nhật thời gian phát
            wavesurfer.on('audioprocess', function () {
                const currentTime = formatTime(wavesurfer.getCurrentTime());
                const duration = formatTime(wavesurfer.getDuration());
                document.getElementById(`time-display${chapterId}`).textContent = `${currentTime} / ${duration}`;
            });
            // Định dạng thời gian (MM:SS)
            function formatTime(seconds) {
                const minutes = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            // Hàm cập nhật biểu tượng nút Play/Pause
            function updatePlayPauseIcon() {
                const playPauseBtn = document.getElementById(`playPauseBtn${chapterId}`);
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
async function fetchReviews(bookId) {
    try {
        const response = await fetch(`http://localhost:8080/${bookId}/reviews`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const reviews = await response.json();
        if (Array.isArray(reviews)) {
            const reviewsContainer = document.getElementById("reviews");
            reviewsContainer.innerHTML = "";
            reviews.forEach((review) => {
                const reviewCard = document.createElement("div");
                reviewCard.className = "review-card";
                reviewCard.innerHTML = `
                    <div class="review-header">
                        <span class="review-username">${review.user.username
                    }</span>
                        <span class="review-rating">${"★".repeat(
                        review.rating
                    )}</span>
                    </div>
                    <div class="review-text">${review.review}</div>
                `;
                reviewsContainer.appendChild(reviewCard);
            });
        } else {
            console.error("Expected an array of reviews");
        }
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
}

async function submitReview(bookId, review) {
    try {
        const response = await fetch(
            `http://localhost:8080/${bookId}/reviews`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(review),
            }
        );
        if (response.ok) {
            fetchReviews(bookId);
        } else {
            console.error("Error submitting review:", response.statusText);
        }
    } catch (error) {
        console.error("Error submitting review:", error);
    }
}

function setupAuth() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const authLink = document.getElementById("authLink");
    const loginMessage = document.getElementById("loginMessage");
    const reviewForm = document.getElementById("reviewForm");
    const bookId = localStorage.getItem("selectedBookIdToListen");
    if (userData) {
        authLink.innerHTML = `
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

        reviewForm.classList.remove("d-none");

        document
            .getElementById("submitReviewForm")
            .addEventListener("submit", function (event) {
                event.preventDefault();
                const reviewText = document.getElementById("reviewText").value;
                const reviewRating = document.getElementById("reviewRating")
                    .value;
                const review = {
                    username: userData.username,
                    review: reviewText,
                    rating: reviewRating,
                };
                submitReview(
                    localStorage.getItem("selectedBookIdToListen"),
                    review
                );
            });

        document
            .getElementById("logoutLink")
            .addEventListener("click", function () {
                localStorage.removeItem("userData");
                window.location.reload();
            });
    } else {
        authLink.innerHTML = `
            <a class="nav-link" href="Login.html"><i class="fas fa-sign-in-alt"></i> Đăng nhập</a>
        `;
        listenButton.disabled = true;
        loginMessage.classList.remove("d-none");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetchBookDetails();
    fetchReviews(localStorage.getItem("selectedBookIdToListen"));
    fetchCategories();
    setupAuth();
});

//tim kiem
document
    .getElementById("searchForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();
        const searchInput = document.getElementById("searchInput");
        const searchValue = searchInput.value.trim();
        if (searchValue) {
            localStorage.setItem("keywordToSearch", searchValue);
            window.location.href = "ResultSearch.html";
        } else {
            alert("Vui lòng nhập từ khóa tìm kiếm.");
        }
    });
