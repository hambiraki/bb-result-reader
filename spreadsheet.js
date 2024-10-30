/**
 * 
 */
const CLIENT_ID = "439336057984-01tr2f1abg2n349bkt4035sj4jlg6lg7.apps.googleusercontent.com";
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets'; // スプレッドシートへのアクセスを許可するスコープ
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
// GASのURLを指定
const deployId = "AKfycbxKZ61AjZALLav2AEpWsa2UNwV-T55UjX0PZF4-7IiD";
const SCRIPT_ID = "AKfycbz1rpPkEzaw6OWIKt0lTB_wuLEhMtIMANdsrrlMuvH2jGEON7o9cw6OWuignbwL7BS2Rg";
const gasUrl = `https://script.googleapis.com/v1/scripts/${deployId}:run`;
// const gasUrl = "https://script.googleapis.com/v1/scripts/AKfycbzUuoDNA097LEIOSJtpfR_nGQbkH5MYKLk3h4Jut29hpycdcIqv-icTcFn3_tTMQjNFNg:run";
function login() {
    const authUrl = `${AUTH_URL}`
     + `?client_id=${CLIENT_ID}`
     + `&redirect_uri=${encodeURIComponent(window.location.origin)}` 
     + `&response_type=token`
     + `&scope=${encodeURIComponent(SCOPE)}`;
     window.location.href = authUrl;
}

function getAccessToken() {
    // URLのハッシュからアクセストークンを取得
    const hash = window.location.hash;
    if (hash) {
        const params = new URLSearchParams(hash.substring(1)); // '#' を取り除く
        return accessToken = params.get('access_token');
    }
    return undefined;
}

async function sendScore(){
    const access_token = getAccessToken();
    console.log(access_token);
    if(access_token == undefined){
        login();
        return;
    }

    // request parameterを画面から収集
    const spreadsheetURL = document.querySelector('#spreadsheet-url').value;
    const battleField = document.querySelector("#battle-field").value;
    const correctedColumn = document.querySelector("#corrected-column").value;
    const playersScore = aggregate();

    // リクエストの設定
    const requestOptions = {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            function: "editSpreadSheet",
            parameters: [spreadsheetURL, battleField, correctedColumn, playersScore],
            devMode: true,
        })
    };
    
    // fetch APIを使ってリクエストを送信
    const errMsgCallingGAS = "GAS呼出し時にエラーが発生しました: ";
    const errMsgExecuteGAS = "GAS関数でエラーが発生しました: ";
    const errMsgGAS = "GASでエラーが発生しました: ";
    try{
        const response = await fetch(gasUrl, requestOptions).then(response => response.json());
        if( response["done"] !== true || response["response"] == undefined){
            console.error(errMsgCallingGAS, response);
            return;
        }
        const gasResponse = response["response"];
        if(gasResponse["@type"] !== "type.googleapis.com/google.apps.script.v1.ExecutionResponse"){
            console.error(errMsgCallingGAS, gasResponse);
            return;
        }
        const gasResult = gasResponse["result"];
        console.log(gasResult);
        if(gasResult["status"] !== "success"){
            console.error(errMsgExecuteGAS, gasResult);
            return;
        }
        document.querySelector("#corrected-column").value = gasResult["updateColumn"];
        // 更新に失敗したプレイヤーを警告する
        const playersCell = [
            ...Array.from(document.querySelectorAll('.blue-table tbody tr')),
            ...Array.from(document.querySelectorAll('.red-table tbody tr'))
        ];        
        gasResult["playersUpdated"].forEach((player,index) =>{
            if(! player.wasUpdated){
                playerCell = playersCell[index];
                playerCell.classList.add("update-fail");
            }
        })
    } catch(error) {
        console.error(errMsgGAS, error);
        return;
    }
}

/**
 * 更新に失敗したプレイヤーを警告する
 * 名前セルの背景色を変更
 * @param {string} playerName
 */
function alertUpdateFailPlayer(playerName){
    [
        ...Array.from(document.querySelectorAll('.blue-table tbody tr')),
        ...Array.from(document.querySelectorAll('.red-table tbody tr'))
    ]
}

/**
 * 名前:勝敗(MVP)に変形する
 * @returns {{name:string, score:string}[]}
 */
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

    /**
     *  DOMからスコアを集計
     * @param {string} teamResult
     * @param {NodeListOf<Element>} scoreTable
     * @returns {{name:string, score:string}[]}
     */
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
    return [
        ... aggregateScoreTable(
            blueResult,
            document.querySelectorAll('.blue-table tbody tr'),
        ),
        ... aggregateScoreTable(
            redResult,
            document.querySelectorAll('.red-table tbody tr'),
        )
    ];
}
