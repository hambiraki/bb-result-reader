/**
 * addEventListenerをするjavascriptを記載する。
 * 基本的にはhtmlに呼び出すjavascriptを記載するが、
 * dragとMVPのラジオボタンじみた挙動はhtmlに記載すると煩雑なのでここに記載する。
 */

//// ファイル選択またはドラッグ&ドロップした時にhandleImageUploadを実行する。
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

/**
 * 画像の表示をし、画像の読み込み関数を呼び出す。
 */
function handleImageUpload(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const imageDisplay = document.getElementById('drop-text');
            imageDisplay.innerHTML = ''; // 既存の画像やメッセージをクリア

            const img = new Image();
            img.src = event.target.result;

            img.onload = function() {
                // 画像を表示
                imageDisplay.appendChild(img);
                // 名前を抽出
                extractPlayerNames(img);  // 関数importはhtmlが行う
            };
        };

        reader.readAsDataURL(file);
    } else {
        alert('画像をアップロードしてください');
    }
}

//// 表の列をカスタムラジオボタンにする
/**
 * 引数の要素配列をカスタムラジオボタンにする
 * ラジオボタンのように1つだけ選択できる
 * 同じボタンを複数回押すと「」→「緑」→「金」→「」で循環する
 */
function addCustomRadioEvent(customRadios){
    // すべてのカスタムラジオボタンにクリックイベントを追加
    customRadios.forEach(radio => {
        radio.addEventListener('click', function() {
            // クリックされたラジオボタンの次の状態を決定
            const transition = {
                "" : "緑", "緑":"金", "金":""
            }
            const next_state = transition[radio.textContent];

            // すべてのカスタムラジオボタンを未選択状態にする
            customRadios.forEach(r => r.textContent = "");
        
            // クリックされたラジオボタンを次の状態にする
            radio.textContent = next_state;
        });
    });
}

// MVPの列それぞれをカスタムラジオボタンにする
addCustomRadioEvent(document.querySelectorAll('.blue-table tr td:nth-child(2)'));
addCustomRadioEvent(document.querySelectorAll('.blue-table tr td:nth-child(3)'));
addCustomRadioEvent(document.querySelectorAll('.blue-table tr td:nth-child(4)'));
addCustomRadioEvent(document.querySelectorAll('.blue-table tr td:nth-child(5)'));
addCustomRadioEvent(document.querySelectorAll('.blue-table tr td:nth-child(6)'));
addCustomRadioEvent(document.querySelectorAll('.red-table tr td:nth-child(2)'));
addCustomRadioEvent(document.querySelectorAll('.red-table tr td:nth-child(3)'));
addCustomRadioEvent(document.querySelectorAll('.red-table tr td:nth-child(4)'));
addCustomRadioEvent(document.querySelectorAll('.red-table tr td:nth-child(5)'));
addCustomRadioEvent(document.querySelectorAll('.red-table tr td:nth-child(6)'));


