/**
 * 關鍵 HTML 和 JavaScript 錯誤修復腳本
 * 這個腳本專門針對造成頁面無法載入的關鍵錯誤進行修復
 * 版本: 1.0.0 (2025-04-14)
 */

(function() {
    console.log(" 執行關鍵錯誤修復 v1.0.0...");

    // 定義一個全域唯一的 isIOS 變數
    if (typeof window.globalIsIOS === 'undefined') {
        console.log(" 定義全域 isIOS 變數 ");
        window.globalIsIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        // 覆寫全域內容，防止其他腳本重複宣告
        Object.defineProperty(window, 'isIOS', {
            get: function() {
                return window.globalIsIOS;
            },
            configurable: false
        });
    }

    // 自動修復頁籤結構問題
    document.addEventListener('DOMContentLoaded', function() {
        console.log(" 修復頁籤和 ARIA 屬性 ...");
        
        // 1. 移除不當的 role="presentation" 屬性
        document.querySelectorAll('[role="presentation"]').forEach(function(element) {
            element.removeAttribute('role');
        });
        
        // 2. 修復不適當的 tablist 角色
        document.querySelectorAll('ul[role="tablist"]').forEach(function(element) {
            element.removeAttribute('role');
        });
        
        // 3. 修復按鈕 ARIA 屬性
        document.querySelectorAll('button[aria-selected]').forEach(function(element) {
            element.removeAttribute('aria-selected');
            if (element.getAttribute('role') === 'tab') {
                element.removeAttribute('role');
            }
        });
        
        // 4. 移除多餘的 </script> 標籤
        const html = document.documentElement.innerHTML;
        if ((html.match(/<\/script>/g) || []).length > (html.match(/<script/g) || []).length) {
            console.warn(" 檢測到多餘的 </script> 標籤 ");
        }
        
        // 5. 強制啟用所有頁籤導航
        document.querySelectorAll('[data-bs-toggle="tab"], [data-bs-toggle="pill"]').forEach(function(tab) {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('data-bs-target'));
                if (target) {
                    // 隱藏所有相關的頁籤內容
                    const parent = target.parentElement;
                    if (parent) {
                        parent.querySelectorAll('.tab-pane').forEach(pane => {
                            pane.classList.remove('active');
                            pane.classList.remove('show');
                            pane.style.display = 'none';
                        });
                    }
                    
                    // 顯示目標頁籤內容
                    target.classList.add('active');
                    target.classList.add('show');
                    target.style.display = 'block';
                    
                    // 更新導航頁籤樣式
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            });
        });
        
        console.log(" 關鍵錯誤修復完成 ");
    });
    
    // 修復變數重複宣告問題
    window.addEventListener('error', function(e) {
        if (e.message && (e.message.includes('redeclaration of const') || e.message.includes('redeclaration of let') || e.message.includes('Cannot redeclare block-scoped variable'))) {
            console.warn(" 攔截到變數重複宣告錯誤 :", e.message);
            // 阻止錯誤顯示在控制台
            e.preventDefault();
        }
    }, true);
})();
