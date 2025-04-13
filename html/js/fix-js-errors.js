/**
 * JavaScript 錯誤修復腳本
 * 特別處理重複宣告變數的問題
 * 版本: 1.0.0 (2025-04-14)
 */

// 修復 JavaScript 錯誤，特別是重複宣告的 isIOS 變數問題
(function() {
    // 立即執行的匿名函數，確保變數不污染全局範圍
    
    // 檢查全局變數 isIOS 是否已被宣告，如果已存在則不再重複宣告
    if (typeof window.isIOSFixed === 'undefined') {
        window.isIOSFixed = true;

        // 定義全局 isIOS 檢測函數，確保這個函數只被定義一次
        window.detectIOS = function() {
            return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        };

        // 設定全局 isIOS 變數
        window.isIOS = window.detectIOS();
        
        // 監聽並攔截所有嘗試重新宣告 isIOS 的代碼
        const originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, desc) {
            if (obj === window && prop === 'isIOS' && window.isIOS !== undefined) {
                console.warn(' 避免重複宣告 isIOS 變數 ');
                return window; // 阻止重新定義
            }
            return originalDefineProperty.call(this, obj, prop, desc);
        };
        
        // 修復 HTML 頁面中可能存在的 isIOS 重複宣告問題
        setTimeout(function() {
            const scripts = document.querySelectorAll('script:not([src])');
            scripts.forEach(script => {
                if (script.textContent.includes('const isIOS') || 
                    script.textContent.includes('let isIOS') || 
                    script.textContent.includes('var isIOS')) {
                    
                    // 替換內嵌腳本中的變數宣告
                    const newContent = script.textContent
                        .replace(/const\s+isIOS\s*=\s*/g, '// const isIOS = ( 已使用全局變數 ) // ')
                        .replace(/let\s+isIOS\s*=\s*/g, '// let isIOS = ( 已使用全局變數 ) // ')
                        .replace(/var\s+isIOS\s*=\s*/g, '// var isIOS = ( 已使用全局變數 ) // ');
                    
                    // 使用執行時替換來避免直接修改 script 內容引起的問題
                    const newScript = document.createElement('script');
                    newScript.textContent = newContent;
                    script.parentNode.replaceChild(newScript, script);
                }
            });
        }, 0);
        
        console.log("JavaScript 錯誤修復完成 : isIOS 變數已統一定義並防止重複宣告 ");
    }
})();
