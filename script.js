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


// プレイヤーデータの定数
const bluePlayers = [
    { name: 'プレイヤー1', result: '〇勝敗' },
    { name: 'プレイヤー2', result: '〇勝敗' },
    { name: 'プレイヤー3', result: '〇勝敗' },
    { name: 'プレイヤー4', result: '〇勝敗' },
    { name: 'プレイヤー5', result: '〇勝敗' },
    { name: 'プレイヤー6', result: '〇勝敗' },
    { name: 'プレイヤー7', result: '〇勝敗' },
    { name: 'プレイヤー8', result: '〇勝敗' },
    { name: 'プレイヤー9', result: '〇勝敗' },
    { name: 'プレイヤー10', result: '〇勝敗' },
    { name: '', result: '' },
    { name: '', result: '' },
];
// プレイヤーデータの定数
const redPlayers = [
    { name: 'プレイヤー1', result: '×勝敗' },
    { name: 'プレイヤー2', result: '×勝敗' },
    { name: 'プレイヤー3', result: '×勝敗' },
    { name: 'プレイヤー4', result: '×勝敗' },
    { name: 'プレイヤー5', result: '×勝敗' },
    { name: 'プレイヤー6', result: '×勝敗' },
    { name: 'プレイヤー7', result: '×勝敗' },
    { name: 'プレイヤー8', result: '×勝敗' },
    { name: 'プレイヤー9', result: '×勝敗' },
    { name: 'プレイヤー10', result: '×勝敗' },
    { name: '', result: '' },
    { name: '', result: '' },
];


// 画像を読み取る
function readScoreImage() {


    // 表に反映
    function showScoreTable(players,nameInputs,resultInputs) {
        players.forEach((player, index) => {
            if (nameInputs[index] && resultInputs[index]) {
                nameInputs[index].value = player.name;      // 名前を入力
                resultInputs[index].value = player.result;  // 結果を入力
            }
        });
    }
    showScoreTable(
        bluePlayers,
        document.querySelectorAll('.blue-table tbody tr td:nth-child(1) input'),
        document.querySelectorAll('.blue-table tbody tr td:nth-child(2) input'),    
    );
    showScoreTable(
        redPlayers,
        document.querySelectorAll('.red-table tbody tr td:nth-child(1) input'),
        document.querySelectorAll('.red-table tbody tr td:nth-child(2) input'),    
    );
}



function updateScoreTables(){
    function updateScoreTable(players,nameInputs,resultInputs){
        players.forEach((player, index) => {
            if (nameInputs[index] && resultInputs[index]) {
                player.name = nameInputs[index].value;      // 名前を入力
                player.result = resultInputs[index].value;  // 結果を入力
            }
        });
    }
    updateScoreTable(
        bluePlayers,
        document.querySelectorAll('.blue-table tbody tr td:nth-child(1) input'),
        document.querySelectorAll('.blue-table tbody tr td:nth-child(2) input'),    

    );
    updateScoreTable(
        redPlayers,
        document.querySelectorAll('.red-table tbody tr td:nth-child(1) input'),
        document.querySelectorAll('.red-table tbody tr td:nth-child(2) input'),    
    );
    console.log(bluePlayers);
}

