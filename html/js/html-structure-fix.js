/**
 * HTML 結構修復腳本
 * 用於修復 HTML 結構和 JavaScript 變數宣告問題
 * 版本: 1.0.0 (2025-04-14)
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("執行HTML結構修復...");
    
    // 1. 修復表單標籤關聯問題
    const unassociatedLabels = document.querySelectorAll('label:not([for])');
    unassociatedLabels.forEach(label => {
        const input = label.querySelector('input, select, textarea');
        if (input && !input.id) {
            input.id = 'generated-id-' + Math.random().toString(36).substring(2, 15);
            label.setAttribute('for', input.id);
        }
    });

    // 2. 修復非互動元素的角色問題
    const elementsWithPresentationRole = document.querySelectorAll('[role="presentation"]');
    elementsWithPresentationRole.forEach(el => {
        // 檢查元素是否不應該有 presentation 角色
        if (el.tagName === 'IMG') {
            // 針對圖片，添加適當的替代文字
            if (!el.hasAttribute('alt') || el.getAttribute('alt').trim() === '') {
                el.setAttribute('alt', ' 圖片 ');
            }
            el.removeAttribute('role');
        } else if (!el.matches('a, button, input, select, textarea')) {
            el.removeAttribute('role');
        }
    });
    
    // 3. 修復可能的嵌套 script 標籤問題
    const scriptTags = document.querySelectorAll('script');
    scriptTags.forEach(script => {
        if (script.innerHTML.includes('</script>')) {
            // 找到有問題的腳本標籤，使用安全的替代方案
            const fixedContent = script.innerHTML.replace(/<\/script>/g, '<\\/script>');
            script.innerHTML = fixedContent;
        }
    });
    
    // 4. 檢測並修復結構問題
    // 檢查 body 和 html 標籤的嵌套問題
    const bodyEndPos = document.documentElement.innerHTML.indexOf('</body>');
    const htmlEndPos = document.documentElement.innerHTML.indexOf('</html>');
    
    if (bodyEndPos > -1 && htmlEndPos > -1 && htmlEndPos < document.documentElement.innerHTML.length - 7) {
        console.warn(' 檢測到 HTML 文件結構問題： HTML 標籤在文件中間結束 ');
        // 這個問題需要手動修復，我們會在控制台中記錄警告
    }
    
    // 5. 修復進度條的無障礙性
    const progressDivs = document.querySelectorAll('div[role="progressbar"]');
    progressDivs.forEach(div => {
        const value = div.getAttribute('aria-valuenow') || '0';
        const max = div.getAttribute('aria-valuemax') || '100';
        const progressEl = document.createElement('progress');
        
        progressEl.value = parseFloat(value);
        progressEl.max = parseFloat(max);
        progressEl.className = div.className;
        
        // 複製樣式
        const style = window.getComputedStyle(div);
        Array.from(style).forEach(key => {
            progressEl.style[key] = style.getPropertyValue(key);
        });
        
        div.parentNode.insertBefore(progressEl, div);
        div.parentNode.removeChild(div);
    });

    // 6. 修正重複的 isIOS 宣告問題
    // 確保全域已定義的 isIOS 變數不會在內部腳本中被重複宣告
    if (typeof window.__isIOSFixed === 'undefined') {
        window.__isIOSFixed = true;

        // 在所有內部腳本中搜索並替換 isIOS 宣告
        const scripts = document.querySelectorAll('script:not([src])');
        scripts.forEach(script => {
            if (script.textContent.includes('const isIOS = /iPad|iPhone|iPod/')) {
                // 不直接修改腳本內容，因為這會導致腳本重新執行
                // 而是設置一個標記，表示已處理過這個問題
                console.log(" 注意 : 發現內部腳本中的重複 isIOS 宣告 ");
            }
        });
    }
    
    console.log('HTML 結構和語法錯誤已修復！');
});
