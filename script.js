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

// 勝敗, 割れ, 大差, 早割
const WIN_LOSE_TYPE = {
    "true,true,true,true": "〇早圧",
    "true,true,true,false": "〇圧勝",
    "true,true,false,true": "〇早勝",
    "true,true,false,false": "〇割勝",
    "true,false,true,true": "〇早圧",
    "true,false,true,false": "〇圧勝",
    "true,false,false,true": "〇早勝",
    "true,false,false,false": "〇勝利",
    "false,true,true,true": "×早大",
    "false,true,true,false": "×大敗",
    "false,true,false,true": "×早敗",
    "false,true,false,false": "×割敗",
    "false,false,true,true": "×早大",
    "false,false,true,false": "×大敗",
    "false,false,false,true": "×早敗",
    "false,false,false,false": "×敗北",
};

// 画像を読み取る
function readScoreImage() {
}

// 名前:勝敗(MVP)に変形する
function aggregate() {
    // 勝敗情報
    const isBlueWin = document.querySelector('input[name="win-team-is"][value="blue"]').checked;
    const isRedWin = document.querySelector('input[name="win-team-is"][value="red"]').checked;
    const isBreak = document.querySelector('#isBreak').checked;
    const isCompletely = document.querySelector('#isCompletely').checked;
    const isEarly = document.querySelector('#isEarly').checked;

    const blueResult = WIN_LOSE_TYPE[[isBlueWin, isBreak, isCompletely, isEarly].toString()];
    const redResult = WIN_LOSE_TYPE[[isRedWin, isBreak, isCompletely, isEarly].toString()];

    // DOMからスコアを集計
    function aggregateScoreTable(teamResult, scoreTable) {
        return Array.from(scoreTable).map((row) => {
            const name = row.querySelector('td:nth-child(1) input');
            // MVP
            let mvp = "";
            const labels = ['撃破', '進行', 'コア', '偵察', '防衛'];
            const cells = Array.from(row.querySelectorAll('td')).slice(1, 6);    
            cells.forEach((cell, index) => {
                if (cell.textContent.trim() !== '') {
                    mvp += labels[index] + cell.textContent.trim();
                }
            });
            if(mvp) mvp = `(${mvp})`;
            return {
                name: name.value,
                score: teamResult + mvp,
            }
        });
    }
    console.log(aggregateScoreTable(
        blueResult,
        document.querySelectorAll('.blue-table tbody tr'),
    ));
    console.log(aggregateScoreTable(
        redResult,
        document.querySelectorAll('.red-table tbody tr'),
    ));
}


