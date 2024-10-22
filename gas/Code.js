function doGet(e){
  
  return  ContentService.createTextOutput(JSON.stringify({ "hello": "world3" }))
  // return JSON.stringify({ "hello": "world3" });
}

function doPost(e) {
   var output = ContentService.createTextOutput(e.postData.contents);
  // // 正しいCORSヘッダーを含めたレスポンスを返す
  // var output = editSpreadSheet(e);
  output.setMimeType(ContentService.MimeType.JSON);
  output.setHeader('Access-Control-Allow-Origin', '*');  // すべてのオリジンを許可
  output.setHeader('Access-Control-Allow-Methods', 'POST');  // 許可するメソッド
  output.setHeader('Access-Control-Allow-Headers', '*');  // 許可するヘッダー

  return output;
}
/**
 * spreadsheetに反映
 * @param {string} sheetUrl
 * @param {{name:string, score:string}[]} playersScore
 * @returns {{name:string, status:string}[]} 
 */
function editSpreadSheet(sheetUrl, playersScore){
  try {
    // スプレッドシートIDの取得 (URLからID部分を抜き出す)
    const spreadsheetId = sheetUrl.match(/[-\w]{25,}/); // 正規表現でスプレッドシートのIDを抽出
    if (!spreadsheetId) {
      return { "status": "error", "message": "Invalid Spreadsheet URL" };
    }

    // スプレッドシートにアクセス
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheets()[0];

    // 最右列の次を更新する
    const updateColumn = sheet.getLastColumn();

    // 名前がある行をまとめる
    const nameColumn = sheet.getRange(1, 2, sheet.getLastRow()).getValues();
    const playerRankMap = new Map();
    for(let [row, nameCol] of nameColumn.entries()){
      playerRankMap.set(nameCol[0],row);
    }

    for(let player of playersScore){
      if( player.name == "" ) continue;
      const updateRow = playerRankMap.get(player.name);
      if(updateRow === undefined){
        return { "status": "error", "message": `${player.name}さんは未登録です。` };
      }  
      sheet.getRange(updateRow + 1, updateColumn + 1 ).setValue(player.score);
    }

    // 成功メッセージの返却
    return { "status": "success", "message": "Grades updated successfully" };
  } catch (error) {
    // エラーハンドリング
    return { "status": "error", "message": error.message };
  }
}


// preflightリクエストに対応したいこちらのメソッドですが、GASはPOSTとGETしか対応していません
function doOptions(e) {
  // OPTIONSリクエスト用のレスポンス
  var output = ContentService.createTextOutput('');
  output.setMimeType(ContentService.MimeType.JSON);
  output.setHeader('Access-Control-Allow-Origin', '*');  // すべてのオリジンを許可
  output.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');  // 許可するメソッド
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // 許可するヘッダー
  return output;
}
