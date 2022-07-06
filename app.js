'use strict';
const fs =require('fs');
//ファイルシステムです。
const readline = require('readline');
//ファイルを1行ずつ読み込んでください。
const rs = fs.createReadStream('./popu-pref.csv');
//その読み込むファイルシステムはpopu-pref.csvです
const rl = readline.createInterface({ input: rs, output: {} });
//rsで定義したcsvを一行目から読み込みます。
const prefectureDataMap = new Map(); 
// key: 都道府県 value:集計データのオブジェクト
rl.on('line', lineString => {
//読み込むファイルシステムを一行目から読み込みますが、
//その際lineというイベントが発生したらlineStringが作動します。
//そのlineStringとは、、、
    const columns = lineString.split(',');
    //カンマで分割し、columnsという名前とします。
    const year =parseInt(columns[0]);
    //カンマで区切られるcolumns0は集計年です。
    //.splitは文字列に対して行うからperseIntの関数を使用し、数値として認識させます。
    const prefecture = columns[1];
    //カンマで区切られるcolumns1は都道府県です
    const popu = parseInt(columns[3]);
    //カンマで区切られるcolumns3は15～19歳の人口です。
    if (year === 2010 || year === 2015) {
        let value = null;
        if (prefectureDataMap.has(prefecture)){
            value = prefectureDataMap.get(prefecture);
        } else {
          value = {
            popu10: 0,
            popu15: 0,
            change: null
          };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    for (const [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) =>{
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings =rankingArray.map(([key, value]) => {
        return (
            `${key}: ${value.popu10}=>${value.popu15} 変化率: ${value.change}`
        );
    });
    console.log(rankingStrings);
  });