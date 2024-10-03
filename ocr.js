// 各プレイヤー名の領域（座標とサイズ）を設定
// Blue team (左側)
const bluePlayerRegions_px = [
    { x_px: 1755, y_px: 292, width_px: 590, height_px: 60 }, // 1st player
    { x_px: 1755, y_px: 430, width_px: 590, height_px: 60 }, // 2nd player
    { x_px: 1755, y_px: 568, width_px: 590, height_px: 60 }, // 3rd player
    { x_px: 1755, y_px: 706, width_px: 590, height_px: 60 }, // 4th player
    { x_px: 1755, y_px: 844, width_px: 590, height_px: 60 }, // 5th player
    { x_px: 1755, y_px: 982, width_px: 590, height_px: 60 }, // 6th player
    { x_px: 1755, y_px: 1120, width_px: 590, height_px: 60 }, // 7th player
    { x_px: 1755, y_px: 1258, width_px: 590, height_px: 60 }, // 8th player
    { x_px: 1755, y_px: 1396, width_px: 590, height_px: 60 }, // 9th player
    { x_px: 1755, y_px: 1534, width_px: 590, height_px: 60 }, // 10th player
];
// Red team (右側)
const redPlayerRegions_px = [
    { x_px: 2899, y_px: 292, width_px: 590, height_px: 60 }, // 1st player
    { x_px: 2899, y_px: 430, width_px: 590, height_px: 60 }, // 2nd player
    { x_px: 2899, y_px: 568, width_px: 590, height_px: 60 }, // 3rd player
    { x_px: 2899, y_px: 706, width_px: 590, height_px: 60 }, // 4th player
    { x_px: 2899, y_px: 844, width_px: 590, height_px: 60 }, // 5th player
    { x_px: 2899, y_px: 982, width_px: 590, height_px: 60 }, // 6th player
    { x_px: 2899, y_px: 1120, width_px: 590, height_px: 60 }, // 7th player
    { x_px: 2899, y_px: 1258, width_px: 590, height_px: 60 }, // 8th player
    { x_px: 2899, y_px: 1396, width_px: 590, height_px: 60 }, // 9th player
    { x_px: 2899, y_px: 1534, width_px: 590, height_px: 60 }, // 10th player
];


const userAgent = navigator.userAgent.toLowerCase();
const mobileList = ["iphone", "ipod", "android"];
const isMobile = mobileList.some(device => userAgent.indexOf(device) > -1)
    || userAgent.indexOf("macintosh") >-1 && "ontouchend" in document;


async function extractPlayerNames(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const croppedImagesContainer = document.getElementById('croppedImagesContainer');
    croppedImagesContainer.innerHTML = ""; // クリア

    // キャンバスのサイズは固定
    console.log(`img.width:${img.width}, img.height:${img.height}`);
    canvas.width = 3840;
    canvas.height = 2160;
    ctx.drawImage(img, 0, 0, 3840, 2160);

    // 各領域からテキストを抽出し、切り出した画像を表示
    async function extractNameByRegion(region_px, threshold, playerNameCell) {
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCanvas.width = region_px.width_px;
        croppedCanvas.height = region_px.height_px;

        // 名前領域を描画
        croppedCtx.drawImage(canvas, region_px.x_px, region_px.y_px, region_px.width_px, region_px.height_px, 0, 0, region_px.width_px, region_px.height_px);

        // 白黒変換 (グレースケール化)
        const imageData = croppedCtx.getImageData(0, 0, croppedCanvas.width, croppedCanvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3; // RGB値の平均を計算
            data[i] = data[i + 1] = data[i + 2] = avg > threshold ? 255 : 0; // 2値化
        }
        croppedCtx.putImageData(imageData, 0, 0);

        // OCRによるテキスト認識
        const inputElement = playerNameCell.querySelector('input[type="text"]');
        try {
            const ocr_result = await Tesseract.recognize(
                croppedCanvas.toDataURL(),
                'jpn',
                { logger: m => console.log(m) }
            );
            const name = ocr_result.data.text.trim().replaceAll(" ","");
            inputElement.value = name;
            return name;
        } catch(error){
            inputElement.value = error.message;
            output.textContent = error;
            return error.message;
        }
    }    
    
  
    async function readNameWithOCR(pxRegionList, threshold, tableId){
        if(isMobile){
            const promiseTeam = [];
            for(let index=0; index < pxRegionList.length; index++){
                const region_px = pxRegionList[index];
                const teamTable = document.getElementById(tableId).querySelector("tbody");
                const promiseName = extractNameByRegion(
                    region_px, threshold, teamTable.rows[index].cells[0]
                );
                    // スマホの場合はメモリが足りないので非同期処理しない
                    promiseTeam.push(await promiseName);
                }
            return promiseTeam;
        } else {
            return Promise.all(pxRegionList.map((region_px,index)=>{
                const teamTable = document.getElementById(tableId).querySelector("tbody");
                return extractNameByRegion(
                    region_px, threshold, teamTable.rows[index].cells[0]
                );
            }))
        }
    }

    // ローディング表示を開始
    const loadingSpinner = document.getElementById("loadingSpinner");
    loadingSpinner.style.display = "flex";

    const blueTeam = await readNameWithOCR(bluePlayerRegions_px, 128, "blue-table");
    const redTeam = await readNameWithOCR(redPlayerRegions_px, 64, "red-table");
    
    // ローディング表示を終了
    console.log("完了");
    loadingSpinner.style.display = "none";
}



