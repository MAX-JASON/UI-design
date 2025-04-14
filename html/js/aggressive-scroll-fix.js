/**
 * 強制修復iPad滾動問題
 * 這個腳本使用最激進的方法來確保iOS設備上的滾動正常工作
 */
(function() {
    // 立即執行，不等待DOMContentLoaded
    console.log("強制滾動修復已啟動");
    
    // 檢測iOS設備
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (/Macintosh/i.test(navigator.platform) && navigator.maxTouchPoints > 1);
    
    // 即使不是iOS也應用修復，確保所有設備都可以滾動
    
    // 方法1: 強制啟用文檔滾動
    function enableScrolling() {
        document.ontouchmove = function(e) {
            return true;
        };
        
        // 移除所有可能阻止滾動的樣式
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.documentElement.style.height = 'auto';
        
        // 強制啟用-webkit-overflow-scrolling
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // 移除可能阻止觸摸的事件
        document.removeEventListener('touchmove', preventDefault, { passive: false });
        document.removeEventListener('touchmove', preventDefault, { passive: true });
        
        // 遍歷所有元素並移除可能阻止滾動的樣式和事件
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            // 啟用溢出滾動
            if (getComputedStyle(el).overflow === 'hidden') {
                el.style.overflow = 'auto';
            }
            
            // 確保內部可滾動區域正常工作
            if (el.scrollHeight > el.clientHeight) {
                el.style.webkitOverflowScrolling = 'touch';
                el.style.overflowY = 'auto';
            }
            
            // 移除阻止觸摸的事件
            el.removeEventListener('touchmove', preventDefault, { passive: false });
            el.removeEventListener('touchmove', preventDefault, { passive: true });
        });
    }
    
    // 方法2: 添加自定義滾動處理
    function addCustomScrolling() {
        // 主要內容區域
        const mainContent = document.querySelector('.container') || document.body;
        
        // 禁用頁面縮放
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        } else {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(meta);
        }
        
        // 為可滾動元素添加觸摸滾動支持
        const scrollableElements = document.querySelectorAll('.scrollable, .content, .container, .table-responsive, .card-body, .tab-content, .modal-body');
        scrollableElements.forEach(el => {
            // 設置樣式
            el.style.webkitOverflowScrolling = 'touch';
            el.style.overflowY = 'auto';
            el.style.overflowX = 'hidden';
            el.style.height = 'auto';
            
            // 添加觸摸處理
            let startY, startTopScroll;
            
            el.addEventListener('touchstart', function(e) {
                startY = e.touches[0].pageY;
                startTopScroll = el.scrollTop;
                
                if (startTopScroll <= 0) {
                    el.scrollTop = 1;
                }
                
                if (startTopScroll + el.offsetHeight >= el.scrollHeight) {
                    el.scrollTop = el.scrollHeight - el.offsetHeight - 1;
                }
            }, { passive: true });
        });
    }
    
    // 方法3: 創建一個覆蓋的可滾動容器
    function createScrollableWrapper() {
        if (document.getElementById('ios-scroll-wrapper')) {
            return; // 已經創建過了
        }
        
        // 獲取頁面主要內容
        const mainContent = document.querySelector('main') || 
                           document.querySelector('.container-fluid') ||
                           document.querySelector('.container');
        
        if (!mainContent) return;
        
        // 創建可滾動包裝器
        const scrollWrapper = document.createElement('div');
        scrollWrapper.id = 'ios-scroll-wrapper';
        scrollWrapper.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
            z-index: 1000;
        `;
        
        // 克隆內容到包裝器
        const contentClone = mainContent.cloneNode(true);
        scrollWrapper.appendChild(contentClone);
        
        // 隱藏原內容
        mainContent.style.display = 'none';
        
        // 添加到頁面
        document.body.appendChild(scrollWrapper);
    }
    
    // 阻止默認行為的函數
    function preventDefault(e) {
        e.preventDefault();
    }
    
    // 應用所有修復
    function applyAllFixes() {
        enableScrolling();
        addCustomScrolling();
        
        // 如需更激進的修復，取消下面的註釋
        // createScrollableWrapper();
        
        // 持續監控DOM變化並應用修復
        const observer = new MutationObserver(function() {
            enableScrolling();
            addCustomScrolling();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
        
        // 每秒檢查一次，以確保滾動始終正常工作
        setInterval(function() {
            enableScrolling();
            addCustomScrolling();
        }, 1000);
    }
    
    // 立即應用修復
    applyAllFixes();
    
    // 頁面加載完成後再次應用修復
    window.addEventListener('load', applyAllFixes);
    
    // 暴露到全局，以便可以從控制台手動調用
    window.fixScrolling = applyAllFixes;
})();
