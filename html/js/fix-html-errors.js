/**
 * HTML 錯誤修復腳本
 * 修復 HTML 中的各種可能錯誤
 * 版本: 1.0.0 (2025-04-14)
 */

// 修復 HTML 中的錯誤
document.addEventListener('DOMContentLoaded', function() {
    console.log("開始修復 HTML 錯誤...");
    
    // 1. 移除所有 role="presentation" 屬性 - 修正可訪問性問題
    document.querySelectorAll('[role="presentation"]').forEach(el => {
        el.removeAttribute('role');
        
        // 如果是清單項目，確保它有適當的 ARIA 特性但沒有 presentation 角色
        if (el.tagName.toLowerCase() === 'li') {
            // 如果需要，可以在這裡添加適當的 ARIA 屬性
            // 例如： el.setAttribute('aria-label', el.textContent.trim());
        }
    });

    // 2. 移除非互動元素上的 role="tablist" 屬性
    document.querySelectorAll('ul[role="tablist"]').forEach(el => {
        el.removeAttribute('role');
        // 可以添加適當的 ARIA 標籤
        el.setAttribute('aria-label', ' 頁籤導航 ');
    });

    // 3. 修正按鈕元素的 ARIA 屬性
    document.querySelectorAll('button[aria-selected]').forEach(el => {
        // 移除不支援的 aria-selected 屬性
        el.removeAttribute('aria-selected');
        
        // 為按鈕添加適當的 ARIA 屬性，而不是使用 role="tab"
        if (el.getAttribute('role') === 'tab') {
            el.removeAttribute('role');
            // 如果按鈕是作為頁籤使用，使用適當的 ARIA 屬性
            el.setAttribute('aria-controls', el.getAttribute('data-bs-target').replace('#', ''));
        }
    });

    // 4. 修復無效註解和多餘 </script> 標籤
    const scriptTags = document.querySelectorAll('script');
    scriptTags.forEach(script => {
        // 檢查是否包含無效註解標籤
        if (script.textContent.includes('<!-- ') || script.textContent.includes(' -->')) {
            script.textContent = script.textContent
                .replace(/<!--\s*|\s*-->/g, '// ')
                .replace(/\/\/\s*\/\//g, '//');
        }
    });
    
    // 5. 移除註解掉的代碼塊
    const commentedCodeBlocks = document.querySelectorAll('*:not(script):not(style)');
    commentedCodeBlocks.forEach(el => {
        const htmlContent = el.innerHTML;
        if (htmlContent && htmlContent.includes('<!-- ') && htmlContent.includes(' -->')) {
            // 檢測並移除純註解代碼區塊
            const commentedOutCode = htmlContent.match(/<!--\s*[\s\S]*?\s*-->/g);
            if (commentedOutCode) {
                commentedOutCode.forEach(comment => {
                    // 只移除確定是代碼而非一般註解的內容
                    if (comment.includes('function') || comment.includes('<div') || comment.includes('var ') || comment.includes('const ')) {
                        el.innerHTML = htmlContent.replace(comment, '');
                    }
                });
            }
        }
    });

    console.log("HTML 訪問性和語法錯誤已修復！");
});
