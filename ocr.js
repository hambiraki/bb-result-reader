function extractPlayerNames(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const output = document.getElementById('output');
    const croppedImagesContainer = document.getElementById('croppedImagesContainer');
    croppedImagesContainer.innerHTML = ""; // クリア

    // キャンバスのサイズを画像のサイズに合わせる
    console.log(`img.width:${img.width}, img.height:${img.height}`);
    canvas.width = 3840;
    canvas.height = 2160;
    ctx.drawImage(img, 0, 0, 3840, 2160);

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

    // 各領域からテキストを抽出し、切り出した画像を表示
    async function extractNameByRegion(region_px, threshold, cellToShow) {
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

                    // 切り出した画像を表示
                    const croppedImageElement = new Image();
                    croppedImageElement.src = croppedCanvas.toDataURL();
                    croppedImageElement.className = 'cropped-image';
                    croppedImagesContainer.appendChild(croppedImageElement);

            // OCRによるテキスト認識
            try{
                const ocr_result = await Tesseract.recognize(
                    croppedCanvas.toDataURL(),
                    'jpn',
                    { logger: m => console.log(m) }
                );
            }catch(error){
                return "OCR処理でエラー発生";
            }
            const name = ocr_result.data.text.trim().replaceAll(" ","");
            cellToShow.textContent = name;
            return name;
    }
    const blueTable = document.getElementById("blue-table")
    const blueTeam = bluePlayerRegions_px.map((region_px, index) => {
        return extractNameByRegion(region_px, 128, blueTable.rows[index+1].cells[0]);
    });
    const redTable = document.getElementById("red-table")
    const redTeam = redPlayerRegions_px.map((region_px, index) => {
        return extractNameByRegion(region_px, 64, redTable.rows[index+1].cells[0]);
    });
}
