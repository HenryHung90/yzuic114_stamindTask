INIT_HTML_CODE = """
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <title>Todo List Preview</title>
</head>
<body>
    <!-- 主應用程式容器 -->
    <!-- 主應用程式容器 -->
    <div class="app">
        <!-- 待辦事項表單 -->
        <div class="todo-form">
            <!-- 表單標題 -->
            <h1>Todo List</h1>
            <!-- 表單內容 -->
            <form id="todoForm">
                <!-- 事項標題 -->
                <!-- <input type="???" name="title" ???="事項標題"> -->
                <!-- 事項內容 -->
                <!-- <input type="???" name="content" ???="事項內容"> -->
                <!-- 表單按鈕區域 -->
                <div class="form-buttons">
                    <!-- <button type="???">新增</button> -->
                    <!-- <button type="???">清除</button> -->
                </div>
            </form>
        </div>
        <!-- 待辦事項列表 -->
        <div class="todo-list" id="todoList">
            <!-- 待辦事項卡片將由 JavaScript 動態生成並插入此處 -->
        </div>
    </div>
</body>
</html>
"""

INIT_CSS_CODE = """
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: "Segoe UI", Arial, sans-serif;
}

body {
    /* 設定背景顏色 */
    background: #f2f4f8;
    /* 使用 Flex 排列置中 */
    display: flex;
    /* 水平置中 */
    justify-content: center;
    padding: 3em;
}
/* 主應用程式容器 */
.app {
    /* 設定容器寬度 */
    width: 70%;
}
/* 待辦事項表單樣式 */
.todo-form {
    /* 設定背景顏色 */
    background: white;
    /* 設定內邊距 */
    padding: 1em;
    /* 設定圓角 */
    border-radius: 1em;
    /* 設定外邊距 */
    margin-bottom: 1em;
    /* 設定陰影效果 */
    box-shadow: 0 6px 16px rgba(0,0,0,.08);
}
/* 設定表單內的標題樣式 */
.todo-form h1 {
    /* 設定標題字體大小 */
    margin-bottom: 0.5em;
}
/* 表單內容 */
.todo-form form {
    /* 使用 Flex 排列 */
    display: flex;
    /* 設定水平間距 */
    /* ??? */
}
/* 表單內的輸入框樣式 */
.todo-form input {
    /* 佔滿剩餘空間 */
    flex: 1;
    /* 設定內邊距 */
    padding: 0.5em;
    /* 設定字體大小 */
    font-size: 1em;
}
/* 表單按鈕區域 */
.form-buttons {
    /* 使用 Flex 排列 */
    display: flex;
    /* 設定水平間距 */
    /* ??? */
}
/* 表單按鈕樣式 */
.form-buttons button {
    /* 設定按鈕寬度 */
    padding: 0.5em 1em;
    /* 設定字體大小 */
    font-size: 1em;
    /* 設定游標為指標狀 */
    /* ??? */
}

/* 待辦事項列表樣式 */
.todo-list {
    /* 使用 Flex 排列 */
    display: flex;
    /* 換行顯示 */
    flex-wrap: wrap;
    /* 設定水平間距 */
    gap: 1em;
}

/* 待辦事項卡片樣式 */
.todo-card {
    /* 設定背景顏色 */
    background: white;
    /* 設定內邊距 */
    padding: 1em;
    /* 設定圓角 */
    border-radius: 1em;
    /* 設定陰影效果 */
    box-shadow: 0 4px 12px rgba(0,0,0,.1);
    /* 使用 Flex 排列 */
    display: flex;
    /* 垂直置中 */
    align-items: center;
    /* 換行顯示 */
    flex-wrap: wrap;
    /* 設定水平間距 */
    /* ??? */

    /* 垂直排列 */
    /* ??? */
    /* 設定待辦事項卡片寬度，每個卡片佔 1/3，扣除卡片間距 */
    /* ??? */

    /* 不縮小 */
    flex-shrink: 0;
}
/* 編輯與檢視模式 */
.view-mode, .edit-mode {
    /* 填滿剩餘空間，推動按鈕到下方 */
    flex: 1;   
    /* 使用 Flex 排列 */
    display: flex;
    /* 垂直排列 */
    flex-direction: column;
}
/* 待辦事項標題樣式 */
.todo-title {
    /* 設定字體大小 */
    font-size: 1.5em;
    /* 設定字體粗細 */
    font-weight: bold;
    /* 設定底部外邊距 */
    margin-bottom: 0.5em;
}
/* 待辦事項內容樣式 */
.todo-content {
    /* 填滿剩餘空間 */
    flex: 1;
    /* 自動換行 */
    word-wrap: break-word;
    /* 設定文字顏色 */
    color: #555;
}
/* 編輯模式下的輸入框樣式 */
.todo-card input {
    /* 設定寬度 */
    width: 100%;
    /* 設定內邊距 */
    padding: 0.5em;
    /* 設定字體大小 */
    margin-bottom: 0.5em;
}
/* 卡片按鈕區域 */
.card-buttons {
    /* 使用 Flex 排列 */
    /* ??? */

    /* 設定水平間距 */
    gap: 0.5em;
    /* 設定頂部外邊距 */
    margin-top: 1em;
}
/* 卡片按鈕樣式 */
.card-buttons button {
    /* 填滿剩餘空間 */
    flex: 1;
    /* 設定內邊距 */
    padding: 0.5em;
    /* 設定字體大小 */
    font-size: 1em;
    /* 設定游標為指標狀 */
    /* ??? */
}
/* 不同按鈕的背景顏色 */
.edit { background: #eef3ff; }
.save { background: #e6fff0; }
.cancel { background: #f0f0f0; }
.delete { background: #ffecec; }
"""

INIT_JS_CODE = """
const todoForm = document.getElementById("todoForm");
const todoListElement = document.getElementById("todoList");

// 初始待辦事項現有資料
let todoList = [
    { title: "2024/09/08", content: "Web 作業" },
    { title: "2024/09/15", content: "CS 作業" },
    { title: "2024/09/20", content: "電腦繪圖電腦繪圖電腦繪圖電腦繪圖電腦繪圖電腦繪圖電腦繪圖電腦繪圖電腦繪圖電腦繪圖 作業" }
];

// 按下表單送出按鈕新增待辦事項
todoForm.addEventListener("submit", function (e) {
    // 阻止表單預設送出行為
    e.preventDefault();
    // 去除輸入值前後空白並取得標題輸入值
    const title = todoForm.title.value.trim();
    // 去除輸入值前後空白並取得內容輸入值
    const content = todoForm.content.value.trim();
    // 檢查標題與內容是否有輸入，若無則跳出提示
    if (!title || !content) return alert("請輸入完整資料");
    // 將新待辦事項加入待辦事項陣列
    todoList.push({ title, content });
    // 重設表單清空輸入欄位
    todoForm.reset();
    // 重新渲染待辦事項列表
    renderTodos();
});

// 渲染待辦事項列表函式
function renderTodos() {
    // 渲染前先清空待辦事項列表
    todoListElement.innerHTML = "";
    // 逐一建立待辦事項卡片並加入待辦事項列表
    todoList.forEach((item, index) => {
        // 建立待辦事項卡片元素
        const card = document.createElement("div");
        // 設定卡片類別名稱與內容
        card.className = "todo-card";
        // 設定卡片內部 HTML 結構，其中每個按鈕帶有對應的索引值，使用${index} 來區分
        // 卡片結構包含檢視模式和編輯模式兩種狀態，以及編輯、儲存、取消和刪除按鈕
        card.innerHTML = `
            <div class="view-mode">
                <div class="todo-title">${item.title}</div>
                <div class="todo-content">${item.content}</div>
            </div>
            <div class="edit-mode" style="display:none">
                <input class="edit-title" value="${item.title}">
                <input class="edit-content" value="${item.content}">
            </div>
            <div class="card-buttons">
                <button class="edit" data-index="${index}">編輯</button>
                <button class="save" data-index="${index}" style="display:none">儲存</button>
                <button class="cancel" data-index="${index}" style="display:none">取消</button>
                <button class="delete" data-index="${index}">刪除</button>
            </div>`;
        // 將卡片加入待辦事項列表元素中的最後面
        // ???
    });
}
// 監聽待辦事項列表的點擊事件，使用事件代理處理按鈕功能
todoListElement.addEventListener("click", function (e) {
    // 取得被點擊的按鈕的索引值
    // 其中e是事件物件
    // target是事件目標元素
    // dataset.index是自訂資料屬性
    const index = e.target.dataset.index;
    // 若索引值不存在則跳出
    if (index === undefined) return;
    // 取得被點擊按鈕所在的待辦事項卡片元素，closest方法用於尋找最近的符合選擇器的父元素
    const card = e.target.closest(".todo-card");
    // 取得卡片中的檢視模式元素
    const view = card.querySelector(".view-mode");
    // 取得卡片中的編輯模式元素
    const edit = card.querySelector(".edit-mode");
    // 取得卡片中的編輯按鈕元素
    const editBtn = card.querySelector(".edit");
    // 取得卡片中的儲存按鈕元素
    const saveBtn = card.querySelector(".save");
    // 取得卡片中的取消按鈕元素
    const cancelBtn = card.querySelector(".cancel");
    // 根據點擊的按鈕類別執行對應功能，使用contains方法檢查按鈕類別是否包含特定delete類別名稱
    // 以下 if 應該填入什麼？
    if (e) {
        // 刪除對應索引的待辦事項，splice方法用於從陣列中移除元素，第一個參數是起始索引，第二個參數1表示只移除一個元素
        // ???
        // 重新渲染待辦事項列表
        renderTodos();
    }
    // 根據點擊的按鈕類別執行對應功能，使用contains方法檢查按鈕類別是否包含特定edit類別名稱
    // 以下 if 應該填入什麼？
    if (e) {
        // 切換到編輯模式，隱藏檢視模式並顯示編輯模式
        view.style.display = "none";
        // 顯示編輯模式元素
        edit.style.display = "block";
        // 切換按鈕顯示狀態
        editBtn.style.display = "none";
        // 顯示儲存與取消按鈕
        saveBtn.style.display = "block";
        // 顯示取消按鈕
        cancelBtn.style.display = "block";
    }
    // 根據點擊的按鈕類別執行對應功能，使用contains方法檢查按鈕類別是否包含特定save類別名稱
    // 以下 if 應該填入什麼？
    if (e) {
        // 儲存編輯後的待辦事項資料，從輸入edit-title欄位取得新標題與內容並更新到待辦事項陣列中
        todoList[index].title = card.querySelector(".edit-title").value;
        // 儲存編輯後的待辦事項資料，從輸入edit-content欄位取得新內容並更新到待辦事項陣列中
        todoList[index].content = card.querySelector(".edit-content").value;
        // 重新渲染待辦事項列表
        renderTodos();
    }
    // 根據點擊的按鈕類別執行對應功能，使用contains方法檢查按鈕類別是否包含特定cancel類別名稱
    // 以下 if 應該填入什麼？
    if (e) {
        // 取消編輯，恢復檢視模式顯示並隱藏編輯模式
        renderTodos();
    }
});

// 初始渲染待辦事項列表
// ???
"""
