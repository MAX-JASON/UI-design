/**
 * 下拉式選單修復腳本
 * 解決高級分析選項下拉式選單無法收起和切換的問題
 */
document.addEventListener('DOMContentLoaded', function() {
    // 修復所有下拉式選單
    function fixDropdowns() {
        // 獲取所有下拉式選單按鈕
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        // 為每個下拉式選單按鈕重新綁定點擊事件
        dropdownToggles.forEach(toggle => {
            // 移除現有的點擊事件以避免衝突
            const clone = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(clone, toggle);
            
            // 獲取下拉菜單元素
            const dropdown = clone.closest('.dropdown');
            const menu = dropdown ? dropdown.querySelector('.dropdown-menu') : null;
            
            if (dropdown && menu) {
                // 添加新的點擊事件
                clone.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // 切換顯示狀態
                    const isVisible = menu.classList.contains('show');
                    
                    // 首先關閉所有其他下拉菜單
                    document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
                        if (openMenu !== menu) {
                            openMenu.classList.remove('show');
                            openMenu.closest('.dropdown').classList.remove('show');
                        }
                    });
                    
                    // 切換當前下拉菜單
                    if (isVisible) {
                        menu.classList.remove('show');
                        dropdown.classList.remove('show');
                    } else {
                        menu.classList.add('show');
                        dropdown.classList.add('show');
                    }
                });
                
                // 點擊外部區域關閉下拉菜單
                document.addEventListener('click', function(e) {
                    if (!dropdown.contains(e.target)) {
                        menu.classList.remove('show');
                        dropdown.classList.remove('show');
                    }
                });
                
                // 為菜單項添加點擊事件
                const menuItems = menu.querySelectorAll('.dropdown-item');
                menuItems.forEach(item => {
                    item.addEventListener('click', function(e) {
                        // 點擊菜單項後關閉下拉菜單
                        menu.classList.remove('show');
                        dropdown.classList.remove('show');
                    });
                });
            }
        });
        
        // 特別處理高級分析選項的下拉菜單
        const advancedAnalysisDropdown = document.querySelector('#advancedAnalysisDropdown');
        if (advancedAnalysisDropdown) {
            const advancedToggle = advancedAnalysisDropdown.querySelector('.dropdown-toggle');
            const advancedMenu = advancedAnalysisDropdown.querySelector('.dropdown-menu');
            
            if (advancedToggle && advancedMenu) {
                // 強制性解決方案
                advancedToggle.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isVisible = advancedMenu.classList.contains('show');
                    
                    if (isVisible) {
                        advancedMenu.classList.remove('show');
                        advancedAnalysisDropdown.classList.remove('show');
                    } else {
                        advancedMenu.classList.add('show');
                        advancedAnalysisDropdown.classList.add('show');
                    }
                    
                    return false;
                };
                
                // 確保點擊外部能關閉
                document.body.addEventListener('click', function(e) {
                    if (!advancedAnalysisDropdown.contains(e.target)) {
                        advancedMenu.classList.remove('show');
                        advancedAnalysisDropdown.classList.remove('show');
                    }
                });
            }
        }
    }
    
    // 立即修復
    fixDropdowns();
    
    // 當網頁變化時重新修復
    const observer = new MutationObserver(fixDropdowns);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 添加到全局以便手動調用
    window.fixDropdownMenus = fixDropdowns;
});
