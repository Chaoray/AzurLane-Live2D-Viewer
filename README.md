# AzurLane-Live2D-Viewer-Covert
實現碧藍L2D開場動畫、觸摸動畫  
藉由config.js設定l2d  

convert.py用法:  
轉換拆包出來的model3.json  
重命名、組織motions以及增加3個hitarea(Head, Body, Special)  

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
接著執行檔案，輸入assets即可轉換

具體如何拆包請到perfare大佬的repo、blog:  
https://www.perfare.net/archives/1556  
https://github.com/Perfare/UnityLive2DExtractor

後言:  
這個hitarea如何實現困擾我很久，爬文也沒有東西  
原本想參考這位大佬:  
https://l2d.algwiki.moe/  
https://gitgud.io/alg-wiki/azurlanel2dviewer  
直接轉換vertices座標，結果發現技術含量過高，我玩不起TAT  
之後去pixi-live2d導出的model中找找，在  
model.internalModel.coreModel._drawableIds中找到TouchSpecial、TouchBody、TouchHead這三個Id  
突發奇想丟到hitarea看看，乓，成了  