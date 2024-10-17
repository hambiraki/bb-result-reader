/**
 * 
 */
const CLIENT_ID = "439336057984-01tr2f1abg2n349bkt4035sj4jlg6lg7.apps.googleusercontent.com";
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets'; // スプレッドシートへのアクセスを許可するスコープ
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

function login() {
    const authUrl = `${AUTH_URL}`
     + `?client_id=${CLIENT_ID}`
     + `&redirect_uri=${encodeURIComponent(window.location.origin)}` 
     + `&response_type=token`
     + `&scope=${encodeURIComponent(SCOPE)}`;
    //  + `&access_type=offline`;
     window.location.href = authUrl;
}

function redirectToGoogleOAuth() {
    const authUrl = `${AUTH_URL}`
     + `?client_id=${CLIENT_ID}`
     + `&redirect_uri=${encodeURIComponent(window.location.origin)}` 
     + `&response_type=token`
     + `&scope=${encodeURIComponent(SCOPE)}`;
    //  + `&access_type=offline`;
    window.open(authUrl, "_blank");
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

// 4. 認証コードをキャプチャしてアクセストークンを取得
async function handleAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
        try {
            const accessToken = await getAccessToken(code);
            console.log('Access Token:', accessToken);
            // アクセストークンを使ってGAS APIなどを呼び出す
        } catch (error) {
            console.error('Error during authentication:', error);
        }
    }
}

// ページが読み込まれたときに、認証コードがあれば処理する
window.onload = () => {
    handleAuthCallback();
};

function sendScore(){
    // GASのURLを指定
    const deployId = "AKfycbxZq_kdOldm5gkCe_H3JgLyxSigtmwoKbscHCy_lu4ehwkA_CRaQjbpnXuKDxq9rkSC";
    const gasUrl = `https://script.googleapis.com/v1/scripts/AKfycbzR7x9QkrHpk8zvFBE7dnK_aDqSt5IV7-i4t9ZU4RzchCPu_3rakL0jQ5iaGgXW56Va_A:run`;

    const access_token = getAccessToken();
    console.log(access_token);

    // POSTするデータを設定
    const postData = {
        spreadsheetUrl: "https://docs.google.com/spreadsheets/d/180GM9rGzcetAT_s_qkwSwetYZPIpFQyKb7gHl8Q8Cy0/edit?gid=0#gid=0",
        grades: "テスト太郎"
    };
    
    // リクエストの設定
    const requestOptions = {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: postData
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
