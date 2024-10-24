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
 * @param {string} battleField
 * @param {number} correctedCol 訂正される列
 * @param {{name:string, score:string}[]} playersScore
 * @returns {{name:string, status:string}[]} 
 */
function editSpreadSheet(sheetUrl, battleField, correctedCol, playersScore){
  try {
    // スプレッドシートIDの取得 (URLからID部分を抜き出す)
    const spreadsheetId = sheetUrl.match(/[-\w]{25,}/); // 正規表現でスプレッドシートのIDを抽出
    if (!spreadsheetId) {
      return { "status": "error", "message": "Spreadsheet URLが不明です。" };
    }

    // スプレッドシートにアクセス
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheets()[0];

    // 更新する列(訂正以外は一番右に列追加)
    if(correctedCol !==""){
      if(isNaN(correctedCol) || Number(correctedCol) < 0 ){
        return { 
          "status": "error", 
          "message": `訂正列${correctedCol}が自然数ではありません。`
        };
      }
      const settedBattleField = sheet.getRange(1,Number(correctedCol)).getValue();
      if(! ["", "-", battleField].includes(settedBattleField)){
        return  { "status": "error", "message": "訂正列と戦場が異なります。" };
      }
    }
    const updateColumn = (correctedCol === "")
      ? sheet.getLastColumn() + 1 
      : Number(correctedCol);
    // 更新列の戦場を更新
    sheet.getRange(1,updateColumn).setValue(battleField);

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
      sheet.getRange(updateRow + 1, updateColumn).setValue(player.score);
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
