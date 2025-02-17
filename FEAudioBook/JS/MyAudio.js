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
var size;
async function fetchMyAudios(username) {
    const myAudioTable = document.getElementById("myAudioTableBody");
    const response = await fetch(
        "http://localhost:8080/getMyAudio/" + username
    );
    const myAudios = await response.json();
    var index = 1;
    myAudios.forEach(audio => {
        var row = `
            <tr>
                <td>${index}</td>
                <td>${audio.audio_name}</td>
                <td>
                    <audio controls>
                        <source src="${audio.audio_url}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                </td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editMyAudio(${audio.id},'${audio.audio_name}','${audio.audio_url}')">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteMyAudio(${audio.id})">Xóa</button>
                </td>
            </tr>
            `;
        index++;
        myAudioTable.insertAdjacentHTML('beforeend', row);
    });
    size = index;
}
//////////////////////////////////////add audio
const addMyAudio = () => {
    if (size === 6) {
        alert('Số lượng âm thanh tối đa là 5.');
    } else {
        const addAudioModal = new bootstrap.Modal(document.getElementById('addAudioModal'));
        addAudioModal.show();
    }
};
// Hàm gửi yêu cầu thêm âm thanh
async function submitAudio() {
    const audioName = document.getElementById('audioName').value;
    const audioFile = document.getElementById('audioFile').files[0];
    const audioPlayback = document.getElementById('audioPlayback');
    const progressBar = document.getElementById('addAudioProgress');
    const textI = document.getElementById('textProgressBar');
    if (audioName && (audioFile || audioPlayback.src)) {
        progressBar.style.display = 'block';
        textI.style.display = 'block';
        try {
            let audioUrl;
            if (audioFile) {
                audioUrl = await uploadAudio(audioFile);
            } else {
                const response = await fetch(audioPlayback.src);
                const blob = await response.blob();
                const file = new File([blob], `${audioName}.wav`, { type: 'audio/wav' });
                audioUrl = await uploadAudio(file);
            }

            const userData = JSON.parse(localStorage.getItem('userData'));
            const username = userData.username;
            const audioData = {
                audio_name: audioName,
                audio_url: audioUrl,
                username: username
            };

            const response = await fetch('http://localhost:8080/addMyAudio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(audioData)
            });

            if (await response.text() === 'Ok') {
                alert('Thêm âm thanh thành công.');
                // Close the modal after submission
                const addAudioModal = bootstrap.Modal.getInstance(document.getElementById('addAudioModal'));
                addAudioModal.hide();
                window.location.reload();
            } else {
                alert('Thêm âm thanh thất bại.');
            }
        } catch (error) {
            console.error('Error adding audio:', error);
            alert('Thêm âm thanh thất bại.');
        } finally {
            progressBar.style.display = 'none';
        }
    } else {
        alert('Vui lòng điền đầy đủ thông tin.');
    }
}
///////////////////////////////////update audio

let audioIdToUpdate;
let updateMediaRecorder;
let updateAudioChunks = [];
let audioUrlToUpdate;
const editMyAudio = (audioId, audioName, audioUrl) => {
    audioIdToUpdate = audioId;
    audioUrlToUpdate = audioUrl;
    document.getElementById('audioNameUpdate').value = audioName;
    document.getElementById('audioFileUpdate').src = '';
    const updateAudioModal = new bootstrap.Modal(document.getElementById('updateAudio'));
    updateAudioModal.show();
};
document.getElementById('startRecordingUpdate').addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    updateMediaRecorder = new MediaRecorder(stream);
    updateMediaRecorder.start();

    document.getElementById('startRecordingUpdate').disabled = true;
    document.getElementById('stopRecordingUpdate').disabled = false;

    updateMediaRecorder.addEventListener('dataavailable', event => {
        updateAudioChunks.push(event.data);
    });

    updateMediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(updateAudioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioPlaybackUpdate = document.getElementById('audioPlaybackUpdate');
        audioPlaybackUpdate.src = audioUrl;
        audioPlaybackUpdate.style.display = 'block';
        updateAudioChunks = [];
    });
});

document.getElementById('stopRecordingUpdate').addEventListener('click', () => {
    updateMediaRecorder.stop();
    document.getElementById('startRecordingUpdate').disabled = false;
    document.getElementById('stopRecordingUpdate').disabled = true;
});

// async function submitUpdateAudio() {
//     const audioName = document.getElementById('audioNameUpdate').value;
//     const audioFile = document.getElementById('audioFileUpdate').files[0];
//     const audioPlayback = document.getElementById('audioPlaybackUpdate');
//     if (audioName) {
//         if(audioFile){
//             const audioUrl = await uploadAudio(audioFile);
//             const userData = JSON.parse(localStorage.getItem('userData'));
//             const username = userData.username;
//             const audioData = {
//                 audio_name: audioName,
//                 audio_url: audioUrl,
//                 username: username
//             };
//             const response = await fetch(`http://localhost:8080/updateMyAudio/${audioIdToUpdate}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(audioData)
//             });
//             if (await response.text() === 'Ok') {
//                 alert('Cập nhật âm thanh thành công.');
//                 // Close the modal after submission
//                 const addAudioModal = bootstrap.Modal.getInstance(document.getElementById('updateAudio'));
//                 addAudioModal.hide();
//                 window.location.reload();
//             }
//             else{
//                 alert('Cập nhật âm thanh thất bại.');
//             }
//         }
//         else if(audioPlayback.src){
//             const response = await fetch(audioPlayback.src);
//             const blob = await response.blob();
//             const file = new File([blob], `${audioName}.wav`, { type: 'audio/wav' });
//             const audioPath = await uploadAudio(file);
//             const userData = JSON.parse(localStorage.getItem('userData'));
//             const username = userData.username;
//             const audioData = {
//                 audio_name: audioName,
//                 audio_url: audioPath,
//                 username: username
//             };
//             const response1 = await fetch(`http://localhost:8080/updateMyAudio/${audioIdToUpdate}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(audioData)
//             });
//             if (await response1.text() === 'Ok') {
//                 alert('Cập nhật âm thanh thành công.');
//                 // Close the modal after submission
//                 const addAudioModal = bootstrap.Modal.getInstance(document.getElementById('updateAudio'));
//                 addAudioModal.hide();
//                 window.location.reload();
//             }
//             else{
//                 alert('Cập nhật âm thanh thất bại.');
//             }
//         }
//         else
//         {
//             const audioUrl = audioUrlToUpdate;
//             const userData = JSON.parse(localStorage.getItem('userData'));
//             const username = userData.username;
//             const audioData = {
//                 audio_name: audioName,
//                 audio_url: audioUrl,
//                 username: username
//             };
//             const response = await fetch(`http://localhost:8080/updateMyAudio/${audioIdToUpdate}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(audioData)
//             });
//             if (await response.text() === 'Ok') {
//                 alert('Cập nhật âm thanh thành công.');
//                 // Close the modal after submission
//                 const addAudioModal = bootstrap.Modal.getInstance(document.getElementById('updateAudio'));
//                 addAudioModal.hide();
//                 window.location.reload();
//             }
//             else{
//                 alert('Cập nhật âm thanh thất bại.');
//             }
//         }
//     } else {
//         alert('Vui lòng điền đầy đủ thông tin.');
//     }
// }

async function submitUpdateAudio() {
    const audioName = document.getElementById('audioNameUpdate').value;
    const audioFile = document.getElementById('audioFileUpdate').files[0];
    const audioPlayback = document.getElementById('audioPlaybackUpdate');
    const progressBar = document.getElementById('updateAudioProgress');
    const textI = document.getElementById('textProgressBarUpdate');

    if (audioName && (audioFile || audioPlayback.src)) {
        progressBar.style.display = 'block';
        textI.style.display = 'block';
        try {
            let audioUrl;
            if (audioFile) {
                audioUrl = await uploadAudio(audioFile);
            } else if (audioPlayback.src) {
                const response = await fetch(audioPlayback.src);
                const blob = await response.blob();
                const file = new File([blob], `${audioName}.wav`, { type: 'audio/wav' });
                audioUrl = await uploadAudio(file);
            } else {
                audioUrl = audioUrlToUpdate;
            }

            const userData = JSON.parse(localStorage.getItem('userData'));
            const username = userData.username;
            const audioData = {
                audio_name: audioName,
                audio_url: audioUrl,
                username: username
            };

            const response = await fetch(`http://localhost:8080/updateMyAudio/${audioIdToUpdate}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(audioData)
            });
            if (await response.text() === 'Ok') {
                alert('Cập nhật âm thanh thành công.');
                // Close the modal after submission
                const updateAudioModal = bootstrap.Modal.getInstance(document.getElementById('updateAudio'));
                updateAudioModal.hide();
                window.location.reload();
            } else {
                alert('Cập nhật âm thanh thất bại.');
            }
        } catch (error) {
            console.error('Error updating audio:', error);
            alert('Cập nhật âm thanh thất bại.');
        } finally {
            progressBar.style.display = 'none';
            textI.style.display = 'none';
        }
    } else {
        alert('Vui lòng điền đầy đủ thông tin.');
    }
}
//////////////////////////////////////delete audio
let audioIdToDelete;
const deleteMyAudio = (audioId) => {
    audioIdToDelete = audioId;
    const deleteAudioModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    deleteAudioModal.show();
};
document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
    try {
        const response = await fetch(`http://localhost:8080/deleteMyAudio/${audioIdToDelete}`, {
            method: 'DELETE'
        });

        if (await response.text() === 'ok') {
            alert('Xóa âm thanh thành công.');
            window.location.reload();
        } else {
            alert('Xóa âm thanh thất bại.');
        }
    } catch (error) {
        console.error('Error deleting audio:', error);
        alert('Xóa âm thanh thất bại.');
    }
    const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
    deleteConfirmationModal.hide();
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
        fetchMyAudios(userData.username);
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
});

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

//ghi ấm thanh
let mediaRecorder;
let audioChunks = [];
document.getElementById('startRecording').addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorder.start();

    document.getElementById('startRecording').disabled = true;
    document.getElementById('stopRecording').disabled = false;

    mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioPlayback = document.getElementById('audioPlayback');
        audioPlayback.src = audioUrl;
        audioPlayback.style.display = 'block';
        audioChunks = [];
    });
});
document.getElementById('stopRecording').addEventListener('click', () => {
    mediaRecorder.stop();
    document.getElementById('startRecording').disabled = false;
    document.getElementById('stopRecording').disabled = true;
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