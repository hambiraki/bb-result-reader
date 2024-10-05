function doPost(e) {
    try {
      // POSTされたデータをパース
      var data = JSON.parse(e.postData.contents);
  
      // 必要な情報の取得
      var sheetUrl = data.spreadsheetUrl; // POSTで送られてくるスプレッドシートのURL
      var grades = data.grades; // 成績（文字列）
  
      // スプレッドシートIDの取得 (URLからID部分を抜き出す)
      var spreadsheetId = sheetUrl.match(/[-\w]{25,}/); // 正規表現でスプレッドシートのIDを抽出
  
      if (!spreadsheetId) {
        return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Invalid Spreadsheet URL" }))
                              .setMimeType(ContentService.MimeType.JSON);
      }
  
      // スプレッドシートにアクセス
      var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      var sheet = spreadsheet.getActiveSheet(); // アクティブシートを使用 (特定のシート名を指定したい場合はシート名で取得)
  
      // 書き込みたいセルの設定 (例: A1セルに書き込む)
      sheet.getRange("A1").setValue(grades); // A1セルに成績を書き込み
  
      // 成功メッセージの返却
      return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Grades updated successfully" }))
                            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      // エラーハンドリング
      return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.message }))
                            .setMimeType(ContentService.MimeType.JSON);
    }
  }
  