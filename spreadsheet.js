/**
 * 
 */

function sendScore(){
    // GASのURLを指定
    const deployId = "AKfycbxVVLkxiQzTKUOiKyC8q8uPsGX1CcWVLDWchTJ744PHHc9T-GYaoIqVRohwcCGGY_xAYQ";
    const gasUrl = `https://script.google.com/macros/s/${deployId}/exec`;
    
    // POSTするデータを設定
    const postData = {
        spreadsheetUrl: "https://docs.google.com/spreadsheets/d/180GM9rGzcetAT_s_qkwSwetYZPIpFQyKb7gHl8Q8Cy0/edit?gid=0#gid=0",
        grades: "テスト太郎"
    };
    
    // リクエストの設定
    const requestOptions = {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    };
    
    // fetch APIを使ってリクエストを送信
    fetch(gasUrl, requestOptions)
        .then(response => response.json())  // レスポンスをJSON形式で受け取る
        .then(data => {
            console.log("GASからのレスポンス:", data);
        })
        .catch(error => {
            console.error("エラーが発生しました:", error);
        });
}


// 名前:勝敗(MVP)に変形する
function aggregate() {
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

    // 勝敗情報をもつHTML要素を取得する
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
