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

function login() {
    const authUrl = `${AUTH_URL}`
     + `?client_id=${CLIENT_ID}`
     + `&redirect_uri=${encodeURIComponent(window.location.origin)}` 
     + `&response_type=token`
     + `&scope=${encodeURIComponent(SCOPE)}`;
    //  + `&access_type=offline`;
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

function sendScore(){
    const access_token = getAccessToken();
    console.log(access_token);

    // request parameterを画面から収集
    const spreadsheetURL = document.querySelector('#spreadsheet-url').value;
    const allResult = aggregate();

    // リクエストの設定
    const requestOptions = {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            function: "editSpreadSheet",
            parameters: [spreadsheetURL, allResult],
            //     "https://docs.google.com/spreadsheets/d/1gf2aCn4eP50x3hI8ap5UFNdws1Bw0i1wurJ0WGPfoNI/edit?gid=0#gid=0",
            //     "半開き", "hoge",
            // ],
            devMode: true,
        })
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

// function authenticate() {
//     return gapi.auth2.getAuthInstance()
//         .signIn({scope: "https://www.googleapis.com/auth/spreadsheets"})
//         .then(() => console.log("Sign-in successful"))
//         .catch(err => console.error("Error signing in", err));
// }

// function loadClient() {
//     gapi.client.setApiKey("YOUR_API_KEY");
//     return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/drive/v3/rest")
//         .then(() => console.log("GAPI client loaded for API"))
//         .catch(err => console.error("Error loading GAPI client for API", err));
// }

// gapi.load("client:auth2", () => {
//     gapi.auth2.init({client_id: clientId});
// });



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
