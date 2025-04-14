/**
 * 針對高級分析選項的直接下拉式選單修復腳本
 * 採用最直接的方法解決下拉式選單無法收起和點回去的問題
 */
(function() {
    // 立即執行，不等待DOMContentLoaded
    console.log("立即修復高級分析選項下拉菜單");
    
    // 立即執行的修復函數
    function directFixDropdowns() {
        // 全局通用修復 - 移除所有現有事件監聽器
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            const newToggle = toggle.cloneNode(true);
            if (toggle.parentNode) {
                toggle.parentNode.replaceChild(newToggle, toggle);
            }
        });
        
        // 立即修復現有問題 - 強制關閉所有當前顯示的下拉菜單
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
            const dropdown = menu.closest('.dropdown');
            if (dropdown) dropdown.classList.remove('show');
        });

        // 專門針對高級分析選項下拉菜單的修復
        const fixAdvancedDropdown = function() {
            // 嘗試多種選擇器找到高級分析選項下拉菜單
            const selectors = [
                '#advancedAnalysisDropdown', 
                '.advanced-analysis-dropdown',
                '.dropdown:has(button:contains("高級分析"))',
                '.dropdown:has(.dropdown-toggle:contains("高級"))',
                '.dropdown:has([data-advanced="true"])',
                // 如果上面都失敗，嘗試找到所有下拉菜單並處理
                '.dropdown'
            ];
            
            let advancedDropdowns = [];
            
            // 嘗試每個選擇器
            for (const selector of selectors) {
                try {
                    const elements = document.querySelectorAll(selector);
                    if (elements && elements.length > 0) {
                        elements.forEach(el => advancedDropdowns.push(el));
                        break; // 找到了就停止
                    }
                } catch (e) {
                    console.warn("選擇器無效:", selector);
                }
            }
            
            // 處理所有找到的下拉菜單
            advancedDropdowns.forEach(dropdown => {
                // 獲取下拉菜單的按鈕和菜單
                const toggle = dropdown.querySelector('.dropdown-toggle') || 
                               dropdown.querySelector('button') ||
                               dropdown.querySelector('a[data-toggle="dropdown"]');
                               
                const menu = dropdown.querySelector('.dropdown-menu');
                
                if (!toggle || !menu) return;
                
                // 移除所有現有的點擊事件
                const newToggle = toggle.cloneNode(true);
                toggle.parentNode.replaceChild(newToggle, toggle);
                
                // 添加新的點擊事件處理程序
                newToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    console.log("高級分析下拉按鈕被點擊");
                    
                    // 檢查菜單是否已顯示
                    const isVisible = menu.classList.contains('show');
                    
                    // 首先關閉所有打開的菜單
                    document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
                        openMenu.classList.remove('show');
                        const parentDropdown = openMenu.closest('.dropdown');
                        if (parentDropdown) parentDropdown.classList.remove('show');
                    });
                    
                    // 如果菜單原本沒有顯示，則顯示它
                    if (!isVisible) {
                        menu.classList.add('show');
                        dropdown.classList.add('show');
                    }
                    
                    return false;
                }, true);
                
                // 確保點擊菜單項時關閉菜單
                menu.querySelectorAll('.dropdown-item').forEach(item => {
                    item.addEventListener('click', function(e) {
                        menu.classList.remove('show');
                        dropdown.classList.remove('show');
                        e.stopPropagation();
                    }, true);
                });
            });
            
            // 確保點擊頁面其他區域時關閉下拉菜單
            document.addEventListener('click', function(e) {
                const openDropdowns = document.querySelectorAll('.dropdown.show');
                openDropdowns.forEach(dropdown => {
                    if (!dropdown.contains(e.target)) {
                        dropdown.classList.remove('show');
                        const menu = dropdown.querySelector('.dropdown-menu');
                        if (menu) menu.classList.remove('show');
                    }
                });
            }, true);
            
            // 添加自定義樣式確保下拉菜單正確顯示
            if (!document.getElementById('dropdown-fix-style')) {
                const style = document.createElement('style');
                style.id = 'dropdown-fix-style';
                style.textContent = `
                    .dropdown-menu.show {
                        display: block !important;
                        opacity: 1 !important;
                        visibility: visible !important;
                        transform: none !important;
                        transition: none !important;
                        pointer-events: auto !important;
                    }
                    .dropdown-toggle::after {
                        display: inline-block;
                        margin-left: 0.255em;
                        vertical-align: 0.255em;
                        content: "";
                        border-top: 0.3em solid;
                        border-right: 0.3em solid transparent;
                        border-bottom: 0;
                        border-left: 0.3em solid transparent;
                    }
                `;
                document.head.appendChild(style);
            }
        };
        
        // 立即修復
        fixAdvancedDropdown();
        
        // 頁面加載後再次修復
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fixAdvancedDropdown);
        }
        
        // 在所有資源加載完成後再次修復
        window.addEventListener('load', fixAdvancedDropdown);
        
        // 定期檢查並修復
        setInterval(fixAdvancedDropdown, 2000);
        
        // 添加到全局，可以從控制台手動調用
        window.fixAdvancedDropdown = fixAdvancedDropdown;
    }
    
    // 立即執行修復
    directFixDropdowns();
    
    // 頁面加載後再次執行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', directFixDropdowns);
    }
    
    // 資源加載完成後再次執行
    window.addEventListener('load', directFixDropdowns);
    
    // 添加到全局以便手動調用
    window.fixDropdowns = directFixDropdowns;
})();
