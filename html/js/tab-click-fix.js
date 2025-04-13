/**
 * 標籤點擊修復腳本
 * 版本: 1.0.0 (2025-04-14)
 * 
 * 這個腳本確保所有標籤頁和導航按鈕可以正常點擊和顯示
 */

(function() {
    // 頁面加載完成後執行
    document.addEventListener('DOMContentLoaded', function() {
        console.log('標籤點擊修復腳本啟動...');
        
        // 修復主導航按鈕點擊
        fixMainNavButtons();
        
        // 修復標籤頁點擊
        fixTabClicks();
        
        // 修復產品導入功能
        fixProductImportTab();
    });
    
    /**
     * 修復主導航按鈕
     */
    function fixMainNavButtons() {
        // 獲取所有主導航按鈕
        const navButtons = document.querySelectorAll('.btn-tech.btn-nav');
        
        navButtons.forEach(button => {
            // 確保按鈕文字可見
            button.style.color = 'white';
            button.style.fontWeight = 'bold';
            button.style.opacity = '1';
            button.style.visibility = 'visible';
            
            // 增強點擊處理
            button.addEventListener('click', function(e) {
                // 移除所有活動狀態
                document.querySelectorAll('.btn-tech.btn-nav').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // 添加活動狀態到當前按鈕
                this.classList.add('active');
                
                // 獲取模塊名稱
                const module = this.getAttribute('data-module');
                
                // 如果是正在開發的模塊，顯示提示
                if (module === 'retirement' || module === 'portfolio' || module === 'market') {
                    showModuleNotification(module);
                }
            });
        });
        
        // 強制顯示所有按鈕文字
        setTimeout(forceShowButtonText, 500);
    }
    
    /**
     * 修復標籤頁點擊
     */
    function fixTabClicks() {
        // 獲取所有標籤
        const tabs = document.querySelectorAll('.nav-tabs .nav-link');
        
        tabs.forEach(tab => {
            // 確保標籤文字可見
            tab.style.color = 'white';
            tab.style.fontWeight = 'bold';
            tab.style.opacity = '1';
            tab.style.visibility = 'visible';
            
            // 移除禁用屬性
            tab.removeAttribute('disabled');
            
            // 增強點擊處理
            tab.addEventListener('click', function(e) {
                // 阻止默認行為，自己處理標籤切換
                e.preventDefault();
                
                // 獲取目標內容區域ID
                const targetId = this.getAttribute('data-bs-target').substring(1); // 移除#前綴
                const targetPane = document.getElementById(targetId);
                
                if (targetPane) {
                    // 隱藏所有標籤內容
                    document.querySelectorAll('.tab-pane').forEach(pane => {
                        pane.classList.remove('show');
                        pane.classList.remove('active');
                    });
                    
                    // 顯示目標內容
                    targetPane.classList.add('show');
                    targetPane.classList.add('active');
                    
                    // 更新標籤狀態
                    document.querySelectorAll('.nav-tabs .nav-link').forEach(link => {
                        link.classList.remove('active');
                        link.setAttribute('aria-selected', 'false');
                    });
                    
                    this.classList.add('active');
                    this.setAttribute('aria-selected', 'true');
                }
            });
        });
    }
    
    /**
     * 專門修復產品導入標籤頁
     */
    function fixProductImportTab() {
        const productsTab = document.getElementById('products-tab');
        const productsPane = document.getElementById('products');
        
        if (productsTab && productsPane) {
            // 加強產品導入標籤的點擊處理
            productsTab.addEventListener('click', function(e) {
                console.log('產品導入標籤被點擊');
                
                // 確保標籤內容可見
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('show');
                    pane.classList.remove('active');
                });
                
                productsPane.classList.add('show');
                productsPane.classList.add('active');
                productsPane.style.display = 'block';
                productsPane.style.opacity = '1';
                productsPane.style.visibility = 'visible';
                
                // 更新標籤狀態
                document.querySelectorAll('.nav-tabs .nav-link').forEach(link => {
                    link.classList.remove('active');
                    link.setAttribute('aria-selected', 'false');
                });
                
                productsTab.classList.add('active');
                productsTab.setAttribute('aria-selected', 'true');
                
                // 刷新產品數據
                if (window.productDatabase && typeof window.updateProductTable === 'function') {
                    window.updateProductTable();
                }
                
                if (window.productDatabase && typeof window.updateSelectedProductsDisplay === 'function') {
                    window.updateSelectedProductsDisplay();
                }
            });
        }
    }
    
    /**
     * 強制顯示所有按鈕文字
     */
    function forceShowButtonText() {
        // 獲取所有按鈕
        const allButtons = document.querySelectorAll('button, .btn');
        
        allButtons.forEach(button => {
            // 確保按鈕文字可見
            button.style.color = '';
            button.style.opacity = '1';
            button.style.visibility = 'visible';
            button.style.overflow = 'visible';
            
            // 修復計算分析按鈕
            if (button.id === 'calculateBtn') {
                button.style.fontSize = '1.2rem';
                button.style.fontWeight = 'bold';
                button.style.color = 'white';
                button.style.textShadow = '0 0 5px rgba(0, 229, 255, 0.7)';
            }
        });
    }
    
    /**
     * 顯示模塊提示
     */
    function showModuleNotification(module) {
        // 模塊名稱映射
        const moduleNames = {
            'retirement': '退休規劃',
            'portfolio': '資產配置',
            'market': '市場數據'
        };
        
        // 創建通知
        const notification = document.createElement('div');
        notification.className = 'module-notification';
        notification.innerHTML = `
            <div class="module-notification-content">
                <i class="fas fa-info-circle"></i>
                <span>${moduleNames[module]}模塊已激活，點擊頁面標籤可切換不同功能</span>
                <button class="close-notification">×</button>
            </div>
        `;
        
        // 添加樣式
        notification.style.position = 'fixed';
        notification.style.top = '70px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'rgba(0, 40, 80, 0.9)';
        notification.style.color = 'white';
        notification.style.padding = '15px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 0 15px rgba(0, 229, 255, 0.3)';
        notification.style.zIndex = '9999';
        notification.style.borderLeft = '4px solid rgba(0, 229, 255, 0.7)';
        notification.style.maxWidth = '350px';
        notification.style.backdropFilter = 'blur(5px)';
        
        // 內容樣式
        const content = notification.querySelector('.module-notification-content');
        content.style.display = 'flex';
        content.style.alignItems = 'center';
        content.style.gap = '10px';
        
        // 關閉按鈕樣式
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.style.border = 'none';
        closeBtn.style.background = 'none';
        closeBtn.style.color = 'white';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.marginLeft = 'auto';
        
        // 關閉按鈕點擊事件
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(notification);
        });
        
        // 添加到頁面
        document.body.appendChild(notification);
        
        // 3秒後自動關閉
        setTimeout(function() {
            if (document.body.contains(notification)) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(20px)';
                notification.style.transition = 'all 0.5s ease';
                
                setTimeout(function() {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 500);
            }
        }, 3000);
    }
})();
