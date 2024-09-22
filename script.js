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
                // 画像を追加して表示（縦横比を維持しつつ高さを40%に設定するCSSが適用される）
                imageDisplay.appendChild(img);
            };
        };

        reader.readAsDataURL(file);
    } else {
        alert('画像をアップロードしてください');
    }
}

document.getElementById('upload-btn').addEventListener('click', () => {
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        
        // 画像ファイルを読み込んで表示する
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;

            img.onload = function() {
                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');

                // Canvasに画像を描画
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // 画像を処理するコード（OCRやピクセルデータの読み取りなど）をここに追加
                // ここでは仮に固定データとして表を更新
                updateTable([
                    { player: '新プレイヤー1', result: '勝利' },
                    { player: '新プレイヤー2', result: '敗北' }
                ]);
            };
        };
        
        reader.readAsDataURL(file);
    } else {
        alert('画像をアップロードしてください');
    }
});

// 表を更新する関数
function updateTable(data) {
    const tbody = document.getElementById('result-table').querySelector('tbody');
    tbody.innerHTML = ''; // 既存の表をクリア

    // 新しいデータで表を更新
    data.forEach(item => {
        const row = document.createElement('tr');
        const playerCell = document.createElement('td');
        const resultCell = document.createElement('td');

        playerCell.textContent = item.player;
        resultCell.textContent = item.result;

        row.appendChild(playerCell);
        row.appendChild(resultCell);
        tbody.appendChild(row);
    });
}
