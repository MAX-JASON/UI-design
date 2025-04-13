/**
 * 頁籤導航和滾動修復腳本
 * 這個腳本修復了多個頁籤顯示和滾動問題
 * 1. 確保僅有第一個頁籤初始可見
 * 2. 限制滾動僅在單一頁籤內進行
 * 3. 防止不必要的頁面延伸
 * 4. 改進頁籤切換行為
 * 版本: 1.0.0 (2025-04-14)
 */

// 等待頁面完全載入後再執行修復
window.addEventListener('load', function() {
    // 等待一小段時間確保頁面上的其他腳本已完全初始化
    setTimeout(function() {
        console.log('開始應用頁籤修復');
        // 應用一些較溫和的修復，保留原有功能
        enhanceTabNavigation();
        fixScrollingIssues();
        // 確保第一個頁籤正確顯示
        initializeFirstTab();
    }, 300);
});

/**
 * 只增強頁籤導航，不替換原有功能
 */
function enhanceTabNavigation() {
    // 添加少量必要的CSS以修復滾動問題，但不改變基本佈局
    const fixStyles = document.createElement('style');
    fixStyles.innerHTML = `
        /* 確保頁籤內容區域不會堆疊 */
        .tab-pane:not(.active) {
            display: none !important;
        }
        
        /* 允許頁籤內容區域獨立滾動 */
        .tab-pane.active {
            height: auto;
            max-height: calc(100vh - 250px);
            overflow-y: auto;
        }
        
        /* 使單個頁籤內容更好地處理溢出 */
        .single-tab-content {
            overflow-y: auto;
        }
    `;
    document.head.appendChild(fixStyles);
    
    console.log('增強型頁籤樣式已套用');
    
    // 找到所有頁籤並確保它們有正確的初始狀態
    document.querySelectorAll('.tab-pane').forEach(function(pane) {
        if (!pane.classList.contains('active')) {
            pane.style.display = 'none';
        }
    });
}

/**
 * 修復頁籤切換功能但不完全覆蓋原有Bootstrap行為
 */
function fixTabSwitching() {
    // 僅增強現有的頁籤切換功能
    const tabLinks = document.querySelectorAll('#analysisTab .nav-link');
    
    // 移除已存在的事件監聽器以避免衝突
    tabLinks.forEach(tab => {
        const newTab = tab.cloneNode(true);
        tab.parentNode.replaceChild(newTab, tab);
    });
    
    // 重新獲取清理過的頁籤元素
    const cleanTabLinks = document.querySelectorAll('#analysisTab .nav-link');
    
    // 添加增強型切換功能
    cleanTabLinks.forEach(tab => {
        tab.addEventListener('click', function(e) {
            // 不阻止默認行為，讓Bootstrap的頁籤功能正常工作
            
            // 確保切換後正確重置滾動位置
            const targetId = this.getAttribute('data-bs-target') || this.getAttribute('href');
            if (targetId) {
                const targetPane = document.querySelector(targetId);
                if (targetPane) {
                    setTimeout(() => {
                        targetPane.scrollTop = 0;
                    }, 50);
                }
            }
        });
    });
    
    // 提供增強型switchTab函數，但不覆蓋現有函數
    if (typeof window.switchTab !== 'function') {
        window.switchTab = function(tabId) {
            const tabElement = document.getElementById(`${tabId}-tab`);
            if (tabElement && !tabElement.hasAttribute('disabled')) {
                tabElement.click();
            }
        };
    }
}

/**
 * 修復滾動問題，更溫和的方法
 */
function fixScrollingIssues() {
    // 為活動頁籤設置正確的滾動行為
    function updateActiveTabScrolling() {
        // 確保只有活動頁籤可以滾動
        document.querySelectorAll('.tab-pane:not(.active)').forEach(pane => {
            pane.style.display = 'none';
        });
        
        // 設置活動頁籤的滾動行為
        document.querySelectorAll('.tab-pane.active').forEach(pane => {
            pane.style.display = 'block';
            pane.style.overflowY = 'auto';
            pane.style.maxHeight = 'calc(100vh - 250px)';
        });
    }
    
    // 監聽頁籤變化來更新滾動行為
    const tabLinks = document.querySelectorAll('#analysisTab .nav-link');
    tabLinks.forEach(tab => {
        tab.addEventListener('shown.bs.tab', updateActiveTabScrolling);
    });
    
    // 對於iOS設備的特殊處理
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
                
    if (isIOS) {
        // 限制某些滾動但不太激進
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.addEventListener('touchmove', function(e) {
                // 只在滾動到邊緣時阻止橡皮筋效果
                const scrollTop = this.scrollTop;
                const scrollHeight = this.scrollHeight;
                const height = this.clientHeight;
                
                if ((scrollTop <= 0 && e.touches[0].clientY > 0) || 
                    (scrollTop + height >= scrollHeight && e.touches[0].clientY < 0)) {
                    e.preventDefault();
                }
            }, { passive: false });
        });
    }
    
    // 初始調用一次
    updateActiveTabScrolling();
    
    console.log('滾動問題修復已應用');
}

/**
 * 初始化第一個頁籤，更溫和的方法
 */
function initializeFirstTab() {
    // 延遲執行以確保與其他腳本兼容
    setTimeout(function() {
        console.log('初始化第一個頁籤');
        
        // 確保只有一個頁籤處於活動狀態
        const activeTab = document.querySelector('#analysisTab .nav-link.active');
        
        if (activeTab) {
            const targetId = activeTab.getAttribute('data-bs-target') || activeTab.getAttribute('href');
            if (targetId) {
                // 確保其他頁籤內容被隱藏
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    if (pane.id !== targetId.substring(1)) { // 移除#符號
                        pane.classList.remove('show', 'active');
                        pane.style.display = 'none';
                    } else {
                        pane.style.display = 'block';
                        pane.classList.add('show', 'active');
                    }
                });
            }
        } else {
            // 如果沒有活動頁籤，嘗試使用第一個可用頁籤
            const firstTabElement = document.querySelector('#analysisTab .nav-link:not([disabled])');
            if (firstTabElement) {
                // 僅設置類別，不觸發點擊事件
                firstTabElement.classList.add('active');
                firstTabElement.setAttribute('aria-selected', 'true');
                
                // 獲取對應的內容
                const targetId = firstTabElement.getAttribute('data-bs-target') || 
                                firstTabElement.getAttribute('href');
                if (targetId) {
                    const targetPane = document.querySelector(targetId);
                    if (targetPane) {
                        targetPane.classList.add('show', 'active');
                        targetPane.style.display = 'block';
                    }
                }
            }
        }
    }, 200);
}
