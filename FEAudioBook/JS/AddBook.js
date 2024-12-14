// Thêm audio cho phần
document.querySelectorAll('.add-audio').forEach(button => {
    button.addEventListener('click', function () {
        let audioContainer = document.createElement('div');
        audioContainer.classList.add('audio-container');
        audioContainer.innerHTML = `
            <div class="mb-3">
                <label for="audioFile" class="form-label">File âm thanh:</label>
                <input type="file" class="form-control audioFile">
            </div>
            <div class="mb-3">
                <label for="audioVoice" class="form-label">Giọng đọc:</label>
                <input type="text" class="form-control audioVoice" placeholder="Nhập tên giọng đọc">
            </div>
            <button type="button" class="btn btn-danger remove">Xóa Audio</button>
        `;
        this.previousElementSibling.appendChild(audioContainer);

        // Xóa audio
        audioContainer.querySelector('.remove').addEventListener('click', function () {
            audioContainer.remove();
        });
    });
});

// Thêm phần cho sách
document.querySelector('.add-part').addEventListener('click', function () {
    let partContainer = document.createElement('div');
    partContainer.classList.add('part-container');
    partContainer.innerHTML = `
        <div class="mb-3">
            <label for="partTitle" class="form-label">Tên phần:</label>
            <input type="text" class="form-control partTitle" placeholder="Nhập tên phần">
        </div>
        <div class="mb-3">
            <label for="partDescription" class="form-label">Mô tả phần:</label>
            <textarea class="form-control partDescription" rows="2" placeholder="Nhập mô tả phần (tùy chọn)"></textarea>
        </div>
        <div class="audio-list">
            <div class="audio-container">
                <div class="mb-3">
                    <label for="audioFile" class="form-label">File âm thanh:</label>
                    <input type="file" class="form-control audioFile">
                </div>
                <div class="mb-3">
                    <label for="audioVoice" class="form-label">Giọng đọc:</label>
                    <select class="form-select audioVoice">
                        <option value="">Chọn giọng đọc</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                    </select>
                </div>
                <button type="button" class="btn btn-danger remove">Xóa Audio</button>
            </div>
        </div>
        <button type="button" class="btn add-audio">+ Thêm Audio</button>
    `;
    document.getElementById('part-list').appendChild(partContainer);

    // Thêm sự kiện xóa audio trong phần mới thêm
    partContainer.querySelector('.add-audio').addEventListener('click', function () {
        let audioContainer = document.createElement('div');
        audioContainer.classList.add('audio-container');
        audioContainer.innerHTML = `
            <div class="mb-3">
                <label for="audioFile" class="form-label">File âm thanh:</label>
                <input type="file" class="form-control audioFile">
            </div>
            <div class="mb-3">
                <label for="audioVoice" class="form-label">Giọng đọc:</label>
                <select class="form-select audioVoice">
                    <option value="">Chọn giọng đọc</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                </select>
            </div>
            <button type="button" class="btn btn-danger remove">Xóa Audio</button>
        `;
        this.previousElementSibling.appendChild(audioContainer);

        audioContainer.querySelector('.remove').addEventListener('click', function () {
            audioContainer.remove();
        });
    });
});

// Xóa audio trong phần mặc định
document.querySelectorAll('.remove').forEach(button => {
    button.addEventListener('click', function () {
        button.parentElement.remove();
    });
});

//////////////////////////////////////////////////////
document.getElementById('bookForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Hiển thị vòng loading
    document.getElementById('loading').style.display = 'block';

    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('author').value;
    const published = document.getElementById('published').value;
    const categoryId = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const bookCover = document.getElementById('bookCover').files[0]; // File object
    if (!bookCover) {
        alert('Vui lòng tải lên hình bìa sách.');
        document.getElementById('loading').style.display = 'none'; // Ẩn vòng loading nếu có lỗi
        return;
    }
    try {
        const imageUrl = await uploadImage(bookCover);
        const bookData = {
            title: title,
            author: author,
            categoryId: parseInt(categoryId),
            description: description,
            published: published,
            image: imageUrl
        };
        const response = await fetch('http://localhost:8080/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });

        if (response.ok) {
            const bookId = await response.text(); // ID của sách đã được lưu
            // Lưu các phần của sách
            await saveChapters(bookId);
            alert('Sách đã được lưu thành công!');
            document.getElementById('bookForm').reset();
        } else {
            alert('Có lỗi xảy ra khi lưu sách.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra.');
    }finally {
             // Ẩn vòng loading sau khi quá trình hoàn tất
             document.getElementById('loading').style.display = 'none';
         }
});

// Hàm để lưu các phần của sách
async function saveChapters(bookId) {
    const partContainers = document.querySelectorAll('.part-container');
    for (let partContainer of partContainers) {
        const chapterTitle = partContainer.querySelector('.partTitle').value;
        const chapterText = partContainer.querySelector('.partDescription').value;
        
        // Dữ liệu cho chapter
        const chapterData = {
            chapter_title: chapterTitle,
            text: chapterText,
            book_id: bookId
        };

        try {
            // Gửi dữ liệu chapter tới API để lưu
            const response = await fetch('http://localhost:8080/chapter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(chapterData)
            });

            if (response.ok) {
                const chapterId = await response.text(); // Lấy ID của phần đã lưu
                // Lưu audio cho chapter này
                await saveAudioForChapter(partContainer, chapterId);
                console.log('Phần sách đã được lưu thành công!');
            } else {
                console.error('Lỗi khi lưu phần sách:', await response.text());
            }
        } catch (error) {
            console.error('Lỗi khi lưu phần sách:', error);
        }
    }
}

// Hàm để lưu audio cho từng chapter
async function saveAudioForChapter(partContainer, chapterId) {
    const audioContainers = partContainer.querySelectorAll('.audio-container');
    for (let audioContainer of audioContainers) {
        const audioFileInput = audioContainer.querySelector('.audioFile');
        const audioName = audioContainer.querySelector('.audioVoice').value; // Nếu cần lấy tên giọng đọc
        if (audioFileInput.files.length > 0) {
            const audioFile = audioFileInput.files[0];
            try {
                // Gọi API để tải lên audio và nhận URL
                const audioFilePath = await uploadAudio(audioFile);
                // Dữ liệu cho audio
                const audioData = {
                    audio_name: audioName,
                    audio_file: audioFilePath,
                    chapter_id: chapterId
                };
                // Gửi dữ liệu audio tới API để lưu
                const response = await fetch('http://localhost:8080/audio', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(audioData)
                });

                if (response.ok) {
                    console.log('Audio đã được lưu thành công!');
                } else {
                    console.error('Lỗi khi lưu audio:', await response.text());
                }
            } catch (error) {
                console.error('Lỗi khi tải lên audio:', error);
            }
        } else {
            console.warn('Không có file audio để lưu.');
        }
    }
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


// lấy path ảnh
async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('http://localhost:8080/generatePath', {
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        throw new Error('Image upload failed');
    }
    // trả về path ảnh
    const imageUrl = await response.text();
    return imageUrl;
}
// lấy danh mục
async function loadCategories() {
    try {
        const response = await fetch('http://localhost:8080/category/getCategories');
        const categories = await response.json();
        const categorySelect = document.getElementById('category');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id; 
            option.textContent = category.name; 
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}
//load trang thì lấy lại danh mục
window.onload = loadCategories;
