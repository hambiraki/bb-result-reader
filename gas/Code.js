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

    // 名前がある行をまとめる
    const nameColumn = sheet.getRange(1, 2, sheet.getLastRow()).getValues();
    const playerRankMap = new Map(
      nameColumn.map((nameCol, row) => {
        // 別名あるプレイヤーは○○(××,△△)の形で書かれている
        // filterで""を除去(末尾の)の後ろに""が発生してしまう)
        const nameList = nameCol[0].split(/[,\(\)]/).filter(val => Boolean(val));
        return nameList.map(name => [name, row])
      }).flat()
    );

    let playersStatus = [];
    for(let player of playersScore){
      let status = true;
      const updateRow = playerRankMap.get(player.name);
      if( player.name === "" ) {
        status = true;
      } else if(updateRow === undefined){
        status = false;
      } else {
        sheet.getRange(updateRow + 1, updateColumn).setValue(player.score);
        status = true;
      }
      playersStatus.push({"name":player.name, "wasUpdated":status})
    }

    // 更新列の戦場を更新
    sheet.getRange(1,updateColumn).setValue(battleField);

    // 成功メッセージの返却
    return {
      "status": "success",
      "updateColumn": updateColumn,
      "playersUpdated": playersStatus
    };
  } catch (error) {
    // エラーハンドリング
    return { "status": "error", "message": error.message, "stack":error.stack };
  }
}
