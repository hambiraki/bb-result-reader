/**
 * OAuth認証のためリダイレクトした場合に入力が消えないようにする
 */

const MAX_TEAM_MEMBER = 12;
const SESSIONSTORAGE_PAGE_INPUTS_KEY = "page-inputs-key";

class PageInputs {
    /**
     * 
     * @param {boolean} isBlueWin
     * @param {boolean} isRedWin
     * @param {boolean} isBreak
     * @param {boolean} isCompletely 
     * @param {boolean} isEarly 
     * @param {{name:string, mvp:string[]}[]} blueMvpPlayers 
     * @param {{name:string, mvp:string[]}[]} redMvpPlayers 
     * @param {string} spreadsheetURL 
     * @param {string} battleField 
     * @param {number|""} correctedColumn 
     */
    constructor(
        isBlueWin, isRedWin,
        isBreak, isCompletely, isEarly,
        blueMvpPlayers, redMvpPlayers,
        spreadsheetURL, battleField, correctedColumn
    ) {
        this.isBlueWin = isBlueWin;
        this.isRedWin = isRedWin;
        this.isBreak = isBreak;
        this.isCompletely = isCompletely;
        this.isEarly = isEarly;
        this.blueMvpPlayers = blueMvpPlayers;
        this.redMvpPlayers = redMvpPlayers;
        this.spreadsheetURL = spreadsheetURL;
        this.battleField = battleField;
        this.correctedColumn = correctedColumn;
    }

    /**
     * DOMから入力内容を集計
     * @returns {PageInputs}
     */
    static fromPage(){
        return new this(
            // 勝敗情報をもつHTML要素を取得する
            document.querySelector('input[name="win-team-is"][value="blue"]').checked,
            document.querySelector('input[name="win-team-is"][value="red"]').checked,
            document.querySelector('#isBreak').checked,
            document.querySelector('#isCompletely').checked,
            document.querySelector('#isEarly').checked,
            // プレイヤーごとの情報　名前、MVP
            aggregateScoreTable(document.querySelectorAll('.blue-table tbody tr')),
            aggregateScoreTable(document.querySelectorAll('.red-table tbody tr')),
            // 反映先スプレッドシートの情報
            document.querySelector('#spreadsheet-url').value,
            document.querySelector("#battle-field").value,
            document.querySelector("#corrected-column").value
        );
    }
    /**
     * DOMへ情報を反映
     */
    toPage(){
        // 勝敗情報をもつHTML要素を取得する
        document.querySelector('input[name="win-team-is"][value="blue"]').checked = this.isBlueWin;
        document.querySelector('input[name="win-team-is"][value="red"]').checked = this.isRedWin;
        document.querySelector('#isBreak').checked = this.isBreak;
        document.querySelector('#isCompletely').checked = this.isCompletely;
        document.querySelector('#isEarly').checked = this.isEarly;
        // プレイヤーごとの情報　名前、MVP
        loadScoreTable(document.querySelectorAll('.blue-table tbody tr'), this.blueMvpPlayers),
        loadScoreTable(document.querySelectorAll('.red-table tbody tr'), this.redMvpPlayers),
        // 反映先スプレッドシートの情報
        document.querySelector('#spreadsheet-url').value = this.spreadsheetURL;
        document.querySelector("#battle-field").value = this.battleField;
        document.querySelector("#corrected-column").value = this.correctedColumn;
    }
    /**
     * SessionStorageへ情報を保存
     */
    toSessionstorage(){
        sessionStorage.setItem(
            SESSIONSTORAGE_PAGE_INPUTS_KEY, JSON.stringify(this)
        );
    }
    /**
     * SessionStorageから情報を再構成
     */
    static fromSessionStorage(){
        const ssData = JSON.parse(sessionStorage.getItem(SESSIONSTORAGE_PAGE_INPUTS_KEY));
        if(ssData == undefined) return undefined;
        return new this(
            ssData.isBlueWin, ssData.isRedWin,
            ssData.isBreak, ssData.isCompletely, ssData.isEarly,
            ssData.blueMvpPlayers, ssData.redMvpPlayers,
            ssData.spreadsheetURL, ssData.battleField, ssData.correctedColumn
        );
    }
}

// mvp:string[]は['撃破', '進行', 'コア', '偵察', '防衛']の順番
/**
 *  DOMから名前とMVPを集計
 * @param {NodeListOf<Element>} scoreTable
 * @returns {{name:string, mvp:string[]}[]}
 */
function aggregateScoreTable(scoreTable) {
    return Array.from(scoreTable).map((row) => {
        const name = row.querySelector('td:nth-child(1) input');
        // MVP['撃破', '進行', 'コア', '偵察', '防衛']
        const cells = Array.from(row.querySelectorAll('td')).slice(1, 6);    
        const mvp_arr = cells.map(cell => cell.textContent.trim() );
        for(const mvp of mvp_arr){
            if(! ["", "緑", "金"].includes(mvp)){
                alert("MVPのセルに['', '緑', '金']以外が入っています。")
            }
        }
        return {
            name: name.value,
            mvp: mvp_arr,
        }
    });
}

/**
 * 名前とMVPをDOMに反映
 * @param {NodeListOf<Element>} scoreTable
 * @param {{name:string, mvp:string[]}[]} mvpPlayers
 */
function loadScoreTable(scoreTable, mvpPlayers){
    const scoreRows = Array.from(scoreTable);
    if(scoreRows.length !== MAX_TEAM_MEMBER){
        throw Error(`画面上の表が${MAX_TEAM_MEMBER}行ではありません。`);
    }
    if(mvpPlayers.length !== MAX_TEAM_MEMBER){
        throw Error(`プレイヤーMVPデータが${MAX_TEAM_MEMBER}行ではありません。`);
    }
    for(let index=0; index<MAX_TEAM_MEMBER; index++){
        const row = scoreRows[index];
        const mvpPlayer = mvpPlayers[index];
        row.querySelector('td:nth-child(1) input').value = mvpPlayer.name;
        // MVP['撃破', '進行', 'コア', '偵察', '防衛']
        const cells = Array.from(row.querySelectorAll('td')).slice(1, 6);    
        cells.forEach((cell, index) => {
            cell.textContent = mvpPlayer.mvp[index];
        });
    }
}
