document.getElementById('file-upload').addEventListener('change', handleImageUpload);

// ドラッグ＆ドロップ機能の実装
const dropArea = document.getElementById('drop-area');

// ドラッグしている間のスタイル変更
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
    });
});

// ドラッグが離れた時にスタイルを戻す
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
    });
});

// ドロップされた時の処理
dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
        handleImageUpload({ target: { files: files } });
    }
});

function handleImageUpload(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const imageDisplay = document.getElementById('drop-area');
            imageDisplay.innerHTML = ''; // 既存の画像やメッセージをクリア

            const img = new Image();
            img.src = event.target.result;

            img.onload = function() {
                // 画像を表示
                imageDisplay.appendChild(img);
            };
        };

        reader.readAsDataURL(file);
    } else {
        alert('画像をアップロードしてください');
    }
}

// 読み込みボタンの有効化チェック
document.getElementById('option1').addEventListener('change', validateForm);
document.getElementById('option2').addEventListener('change', validateForm);
document.getElementById('option3').addEventListener('change', validateForm);

function validateForm() {
    const file = document.getElementById('file-upload').files[0];
    const option1Checked = document.getElementById('option1').checked;
    const option2Checked = document.getElementById('option2').checked;
    const option3Checked = document.getElementById('option3').checked;

    const loadBtn = document.getElementById('load-btn');
    if (file && (option1Checked || option2Checked || option3Checked)) {
        loadBtn.disabled = false;
    } else {
        loadBtn.disabled = true;
    }
}
