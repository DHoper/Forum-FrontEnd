# Wildens 野生攝影分享網站
Wildens 是一個全球旅行愛好者的社區，讓用戶可以紀錄並分享他們旅途中的精彩時刻、探索不同地方，並與其他用戶互動交流。

## 作品概述
前端: 使用Vue3 + TypeScript + Tailwind，並串接mapbox地圖。
後端: 使用Node.js，資料庫為MongoDB Atlas，圖片資源則轉存在Cloudinary。

## 功能簡介
### 主頁
主頁是 Wildens 的入口，僅作展示用途。

### 文章頁
由管理者使用後台管理系統來發布官方文章(暫無功能)。

### 探索頁
串接 Mapbox 互動式地圖，可以在這裡探索、搜尋照片牆上的貼文。

### 照片牆
可以在這裡檢視或發布照片牆貼文，分享自己的照片，或在他人的貼文底下留言。貼文可以透過點擊翻至背面，以查看更多內容。

### 社區
僅限已註冊的用戶進入。可以在這裡參與社群討論，檢視或發布社群討論貼文(投票區塊暫無功能)。

### 用戶頁 (透過頭像選單)
#### 個人資訊：編輯和更新自己的個人資訊。
#### 檢視其他用戶：通過點擊其他發文者的頭像，可以查看他們的個人資訊。
#### 個人貼文記錄：列出了自己曾發布的貼文，可以檢視、編輯或刪除它們。
#### 追蹤與幫助頁 : (暫無功能)

### 登錄與註冊頁
進行登錄和註冊操作，註冊時可以選擇頭像，和感興趣的主題。(Google 相關選項暫無功能)。