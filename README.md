# AzurLane-Live2D-Viewer
## 說明
實現碧藍L2D開場動畫、觸摸動畫  
外加背景圖片跟縮放功能(良心  

## model3_convert.py用法
轉換拆包出來的model3.json  
重命名、組織motions以及增加n個hitarea，如Head, Body, Special  

檔案結構須為(例)
```
assets
├─edu_3
│  │  edu_3.moc3
│  │  edu_3.model3.json
│  │  edu_3.physics3.json
│  ├─motions
│  └─textures
│
└─edu_4
    │  edu_4.moc3
    │  edu_4.model3.json
    │  edu_4.physics3.json
    ├─motions
    └─textures
```
接著執行檔案，輸入頂層資料夾名稱(範例中為assets) 即可幫你把HitAreas導出 + 整理Motions  

具體如何拆包請到**perfare大佬**的repo、blog:  
https://www.perfare.net/archives/1556  
https://github.com/Perfare/UnityLive2DExtractor  

## 展示網頁操作說明
- 滾輪縮放
- 滑鼠中鍵重新定位Model
- 左鍵可拖曳Model
- Model名稱都是漢拼，請自行想像(?
- 背景、Model載入時間較久，勿噴
- 有Cookie記錄，我才不管你接不接受

## 後言
HitArea如何實現困擾我很久，爬文也沒有東西  

原本想參考這位大佬:  
https://l2d.algwiki.moe/  
https://gitgud.io/alg-wiki/azurlanel2dviewer  
直接轉換vertices座標，結果發現技術含量過高，我玩不起  

之後去pixi-live2d導出的model中找找，在`model.internalModel.coreModel._drawableIds`中找到TouchSpecial、TouchBody、TouchHead這三個Id  
突發奇想丟到hitarea看看，成了  

再來就是把想法擴展到更多的HitAreas，另外我也放了更多背景圖片  
版本是日版(目前最新)，拆包拆出來一定有瑕疵，手變兩條腳變三條之類的，請不要噴我  

## TODO

1. 將Drag類的HitArea也做出來

## 有bug歡迎提出
