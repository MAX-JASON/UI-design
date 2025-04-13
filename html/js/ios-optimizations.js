/**
 * iOS/iPad 專用優化腳本
 * 解決iOS設備上的特定問題，尤其是iPad旋轉和觸摸交互問題
 * 版本: 1.0.0 (2025-04-14)
 */

// 創建全局iOS修復對象
window.iOSTouchFixes = {
    isApplied: false,
    
    // 檢測是否為iOS設備
    isIOS: function() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    },
    
    // 檢測是否為IPad - 使用方法而非變量來避免重複宣告
    checkIsIPad: function() {
        // 如果全局已有定義則使用現有定義
        if (typeof window.isIPadDevice !== 'undefined') {
            return window.isIPadDevice;
        }
        
        // 否則進行檢測並存到全局對象
        window.isIPadDevice = /iPad/.test(navigator.userAgent) || 
               (/Macintosh/i.test(navigator.platform) && navigator.maxTouchPoints > 1);
        return window.isIPadDevice;
    },
    
    // 應用所有iOS觸控修復
    apply: function() {
        if (!this.isIOS()) {
            return; // 不是iOS設備，無需修復
        }
        
        console.log("應用iOS觸控修復...");
        
        // 修復iOS上的滾動問題
        this.fixScrolling();
        
        // 修復iOS上的點擊延遲問題
        this.fixTouchDelay();
        
        // 修復iPad旋轉問題
        if (this.isIPad()) {
            this.fixIPadRotation();
        }
        
        // 標記修復已應用
        this.isApplied = true;
    },
    
    // 重新應用修復（用於動態加載的內容）
    reapply: function() {
        if (this.isApplied) {
            console.log("重新應用iOS觸控修復...");
            // 重新應用修復
            this.fixScrolling();
        } else {
            // 初次應用
            this.apply();
        }
    },
    
    // 修復iOS上的滾動問題
    fixScrolling: function() {
        // 允許滾動的容器
        const scrollContainers = document.querySelectorAll('.scroll-container, .tab-pane, .allow-scroll');
        
        scrollContainers.forEach(container => {
            // 移除現有監聽器以避免重複
            container.removeEventListener('touchmove', this.handleTouchMove);
            
            // 添加優化的觸摸移動事件處理
            container.addEventListener('touchmove', this.handleTouchMove, { passive: false });
            
            // 添加專門的iOS樣式類
            container.classList.add('ios-scroll-fix');
        });
        
        // 添加iOS滾動樣式修復
        this.addScrollStyles();
    },
    
    // 處理觸摸移動事件，防止iOS橡皮筋效果
    handleTouchMove: function(e) {
        const scrollTop = this.scrollTop;
        const scrollHeight = this.scrollHeight;
        const height = this.clientHeight;
        
        // 在頂部或底部時防止過度滾動
        if ((scrollTop <= 0 && e.touches[0].clientY > 0) || 
            (scrollTop + height >= scrollHeight && e.touches[0].clientY < 0)) {
            e.preventDefault();
        }
    },
    
    // 添加iOS滾動樣式修復
    addScrollStyles: function() {
        // 檢查樣式是否已添加
        if (document.getElementById('ios-scroll-fix-style')) {
            return;
        }
        
        // 創建並添加樣式
        const style = document.createElement('style');
        style.id = 'ios-scroll-fix-style';
        style.innerHTML = `
            /* iOS滾動容器修復 */
            .ios-scroll-fix {
                -webkit-overflow-scrolling: touch;
                overflow-y: auto;
            }
            
            /* 防止整個頁面滾動時的橡皮筋效果 */
            html, body {
                position: fixed;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
            
            /* 主容器需要能夠滾動 */
            .dashboard-container {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
            
            /* 修復iPad旋轉問題 */
            @media only screen and (min-width: 768px) {
                .ipad-device .chart-container {
                    min-height: 250px;
                    height: 100%;
                }
                
                .ipad-device.ios-landscape .chart-container {
                    min-height: 200px;
                }
                
                .ipad-device.ios-portrait .chart-row {
                    display: flex;
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
        console.log("已添加iOS滾動樣式修復");
    },
    
    // 修復iOS上的點擊延遲問題
    fixTouchDelay: function() {
        // 應用於整個文檔
        document.documentElement.style.touchAction = 'manipulation';
        
        // 為所有按鈕和可點擊元素添加觸摸處理
        const clickableElements = document.querySelectorAll('button, .btn, a, .nav-link, [role="button"]');
        clickableElements.forEach(element => {
            element.style.touchAction = 'manipulation';
        });
        
        console.log("已修復iOS點擊延遲問題");
    },
    
    // 修復iPad旋轉問題
    fixIPadRotation: function() {
        // 標記文檔為iPad設備
        document.documentElement.classList.add('ipad-device');
        
        // 檢測當前方向並添加相應的類
        const isLandscape = window.innerWidth > window.innerHeight;
        document.documentElement.classList.toggle('ios-landscape', isLandscape);
        document.documentElement.classList.toggle('ios-portrait', !isLandscape);
        
        // 標記所有圖表行
        document.querySelectorAll('.row:has(.chart-container)').forEach(row => {
            row.classList.add('chart-row');
        });
        
        // 使用更可靠的旋轉處理方法
        this.setupOrientationHandling();
        
        console.log("已應用iPad旋轉修復");
    },
    
    // 設置方向變化處理
    setupOrientationHandling: function() {
        // 移除現有監聽器以避免重複
        window.removeEventListener('orientationchange', this.handleOrientationChange);
        window.removeEventListener('resize', this.debounceOrientationCheck);
        
        // 添加方向變化監聽器
        window.addEventListener('orientationchange', this.handleOrientationChange);
        window.addEventListener('resize', this.debounceOrientationCheck);
    },
    
    // 處理方向變化
    handleOrientationChange: function() {
        console.log("設備方向已變更");
        // 添加遮罩以隱藏旋轉期間的視覺抖動
        const mask = document.createElement('div');
        mask.style.position = 'fixed';
        mask.style.top = '0';
        mask.style.left = '0';
        mask.style.width = '100%';
        mask.style.height = '100%';
        mask.style.backgroundColor = '#040b19';
        mask.style.zIndex = '10000';
        mask.style.transition = 'opacity 0.5s ease';
        document.body.appendChild(mask);
        
        // 延遲後處理方向變化
        setTimeout(() => {
            const isLandscape = window.innerWidth > window.innerHeight;
            document.documentElement.classList.toggle('ios-landscape', isLandscape);
            document.documentElement.classList.toggle('ios-portrait', !isLandscape);
            
            // 重新渲染所有圖表
            if (window.Chart) {
                Object.values(Chart.instances || {}).forEach(chart => {
                    chart.resize();
                });
            }
            
            // 淡出遮罩
            mask.style.opacity = '0';
            setTimeout(() => {
                mask.remove();
            }, 500);
        }, 300);
    },
    
    // 延遲處理方向檢查，防止過多調用
    debounceOrientationCheck: function() {
        if (window.iOSTouchFixes.orientationTimeout) {
            clearTimeout(window.iOSTouchFixes.orientationTimeout);
        }
        
        window.iOSTouchFixes.orientationTimeout = setTimeout(() => {
            const isLandscape = window.innerWidth > window.innerHeight;
            document.documentElement.classList.toggle('ios-landscape', isLandscape);
            document.documentElement.classList.toggle('ios-portrait', !isLandscape);
        }, 200);
    }
};

// 在頁面加載後自動應用修復
document.addEventListener('DOMContentLoaded', function() {
    // 應用iOS修復
    window.iOSTouchFixes.apply();
    
    // 為緊急重置按鈕添加事件處理
    const resetButton = document.getElementById('emergency-reset');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (window.resetPage) {
                window.resetPage();
            }
        });
    }
    
    const disableEffectsButton = document.getElementById('emergency-disable-effects');
    if (disableEffectsButton) {
        disableEffectsButton.addEventListener('click', function() {
            // 禁用粒子效果
            const particlesJS = document.getElementById('particles-js');
            if (particlesJS) {
                particlesJS.style.display = 'none';
            }
            
            // 禁用動畫
            const style = document.createElement('style');
            style.innerHTML = `
                * { animation-duration: 0s !important; transition-duration: 0s !important; }
                .shimmer-effect, .scan-effect { display: none !important; }
            `;
            document.head.appendChild(style);
            
            alert("已禁用所有特效和動畫。");
        });
    }
    
    const fixTabsButton = document.getElementById('emergency-fix-tabs');
    if (fixTabsButton) {
        fixTabsButton.addEventListener('click', function() {
            // 修復頁籤問題
            if (typeof fixTabStructure === 'function') {
                fixTabStructure();
                alert("已嘗試修復頁籤結構。");
            } else {
                alert("修復函數不可用，請嘗試重新整理頁面。");
            }
        });
    }
});
