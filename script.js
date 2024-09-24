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
let bluePlayers = [
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
let redPlayers = [
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

    // 勝敗情報
    const isBlueWin = document.querySelector('input[name="win-team-is"][value="blue"]').checked;
    const isRedWin = document.querySelector('input[name="win-team-is"][value="red"]').checked;
    const isBreak = document.querySelector('#isBreak').checked;
    const isCompletely = document.querySelector('#isCompletely').checked;
    const isEarly = document.querySelector('#isEarly').checked;

    const blueResult = WIN_LOSE_TYPE[[isBlueWin, isBreak, isCompletely, isEarly].toString()];
    const redResult = WIN_LOSE_TYPE[[isRedWin, isBreak, isCompletely, isEarly].toString()];

    function updateTeamResult(players, teamResult) {
        players.forEach((player) => {
            if (player.result && player.result.length >= 3) {
                player.result = teamResult + player.result.slice(3);
            }
        });
    }
    updateTeamResult(bluePlayers, blueResult);
    updateTeamResult(redPlayers, redResult);

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

