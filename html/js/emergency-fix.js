/**
 * 緊急修復腳本 - 解決頁面載入問題與優化使用體驗
 * 針對UI-design-rebuild項目的重構版本
 * 版本: 1.0.0 (2025-04-14)
 */

// 在頁面開始載入時就執行，不等待DOM完全載入
(function() {
    console.log("緊急修復程序啟動 v1.0.0...");
    
    // 在文檔開始解析時就添加基本樣式修復
    addEmergencyStyles();
    
    // 監聽DOM載入進度
    document.addEventListener('readystatechange', function() {
        console.log("文檔載入狀態: " + document.readyState);
        
        if (document.readyState === 'interactive') {
            // DOM已解析完成但資源如圖片、樣式表等可能還在加載
            preparePageStructure();
        }
        
        if (document.readyState === 'complete') {
            // 頁面完全載入
            finalizePageFix();
        }
    });
    
    // 添加兜底計時器，確保即使事件未觸發也能執行修復
    setTimeout(preparePageStructure, 500);
    setTimeout(finalizePageFix, 1000);
    
    // 向window對象添加緊急重置功能
    window.resetPage = function() {
        preparePageStructure();
        finalizePageFix();
        alert("頁面已重置。如果仍無法正常顯示，請嘗試重新整理。");
    };
})();

/**
 * 添加緊急樣式修復
 */
function addEmergencyStyles() {
    // 創建並添加緊急修復樣式
    const style = document.createElement('style');
    style.innerHTML = `
        /* 防止頁面布局崩潰的基本修復 */
        body {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            overflow-y: auto !important;
        }
        
        /* 確保關鍵容器可見 */
        .dashboard-container {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            height: auto !important;
            min-height: 100vh;
        }
        
        /* 修復頁籤顯示 */
        .tab-pane {
            position: relative !important;
            opacity: 1;
            height: auto !important;
        }
        
        /* 隱藏非活動頁籤 */
        .tab-pane:not(.active) {
            display: none !important;
        }
        
        /* 確保活動頁籤顯示 */
        .tab-pane.active {
            display: block !important;
        }
        
        /* 按鈕發光效果 */
        .glow-border-blue {
            box-shadow: 0 0 5px #4dabf7, 0 0 10px rgba(77, 171, 247, 0.5) !important;
            border: 1px solid #4dabf7 !important;
        }
    `;
    document.head.appendChild(style);
    console.log("緊急樣式已添加");
}

/**
 * 初步準備頁面結構
 */
function preparePageStructure() {
    console.log("準備頁面結構...");
    
    try {
        // 1. 隱藏啟動畫面
        const splashScreen = document.getElementById('splashScreen');
        if (splashScreen) {
            setTimeout(() => {
                splashScreen.style.display = 'none';
                console.log("已隱藏啟動畫面");
            }, 2000); // 給予足夠的時間顯示啟動畫面
        }
        
        // 2. 禁用可能導致問題的特效
        safelyDisableEffects();
        
        // 3. 確保第一個頁籤被激活
        activateFirstTab();
    } catch (error) {
        console.error("頁面準備過程出錯: ", error);
    }
}

/**
 * 完成頁面修復
 */
function finalizePageFix() {
    console.log("完成頁面修復...");
    
    try {
        // 1. 再次確保頁籤結構正確
        fixTabStructure();
        
        // 2. 選擇性地移除動畫效果，避免影響正常動畫
        document.querySelectorAll('.animate__animated.animate__infinite').forEach(el => {
            Array.from(el.classList)
                .filter(cls => cls.startsWith('animate__infinite'))
                .forEach(cls => el.classList.remove(cls));
        });
        
        // 3. 確保頁面可滾動
        document.body.style.overflow = 'auto';
        
        // 4. 添加緊急修復按鈕
        addEmergencyButton();
        
        // 5. 更新版本號
        updateVersionNumber();
        
        console.log("頁面修復完成");
    } catch (error) {
        console.error("頁面修復完成階段出錯: ", error);
    }
}

/**
 * 啟用特效及動態背景
 */
function safelyDisableEffects() {
    try {
        // 環境檢測
        console.log("正在啟用視覺特效和動態背景...");
        
        // 確保粒子效果是從額高低前動態切換
        const particlesJS = document.getElementById('particles-js');
        if (particlesJS) {
            particlesJS.style.visibility = 'visible';
            particlesJS.style.display = 'block';
            particlesJS.style.opacity = '1';
            particlesJS.style.position = 'fixed';
            particlesJS.style.top = '0';
            particlesJS.style.left = '0';
            particlesJS.style.width = '100%';
            particlesJS.style.height = '100%';
            particlesJS.style.zIndex = '-1';
            console.log("已啟用粒子背景效果");
        }
        
        // 確保閃爍效果應用到所有元素
        document.querySelectorAll('.panel').forEach(panel => {
            // 確保每個面板都有閃爍和雷電效果
            if (!panel.querySelector('.shimmer-effect')) {
                const shimmerEffect = document.createElement('div');
                shimmerEffect.className = 'shimmer-effect';
                panel.appendChild(shimmerEffect);
            }
            
            if (!panel.querySelector('.lightning-effect')) {
                const lightningEffect = document.createElement('div');
                lightningEffect.className = 'lightning-effect';
                panel.appendChild(lightningEffect);
            }
        });
        
        console.log("所有視覺特效已經啟用");
    } catch (error) {
        console.error("啟用特效過程出錯: ", error);
    }
}

/**
 * 確保第一個頁籤被激活
 */
function activateFirstTab() {
    // 獲取所有頁籤
    const tabs = document.querySelectorAll('.nav-tabs .nav-link');
    const firstTab = tabs[0];
    
    if (firstTab) {
        // 檢查是否已有激活頁籤
        const hasActiveTab = Array.from(tabs).some(tab => tab.classList.contains('active'));
        
        // 只有當沒有激活頁籤時才激活第一個
        if (!hasActiveTab) {
            // 移除所有頁籤的活動狀態
            tabs.forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            });
            
            // 激活第一個頁籤
            firstTab.classList.add('active');
            firstTab.setAttribute('aria-selected', 'true');
            
            // 獲取頁籤對應的內容區域
            const target = firstTab.getAttribute('data-bs-target') || firstTab.getAttribute('href');
            if (target) {
                // 隱藏所有頁籤內容
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active', 'show');
                });
                
                // 顯示第一個頁籤的內容
                const targetPane = document.querySelector(target);
                if (targetPane) {
                    targetPane.classList.add('active', 'show');
                    console.log("已激活第一個頁籤: ", target);
                }
            }
            
            console.log("已激活第一個頁籤");
        } else {
            console.log("已有激活頁籤，不需重新激活");
        }
    }
}

/**
 * 修復頁籤結構
 */
function fixTabStructure() {
    // 獲取當前激活的頁籤
    const activeTab = document.querySelector('.nav-tabs .nav-link.active');
    
    if (activeTab) {
        // 獲取對應的內容區域
        const target = activeTab.getAttribute('data-bs-target') || activeTab.getAttribute('href');
        if (target) {
            // 確保只有激活的頁籤內容可見
            document.querySelectorAll('.tab-pane').forEach(pane => {
                const shouldBeActive = pane.id === target.substring(1); // 移除#符號
                
                if (shouldBeActive) {
                    pane.classList.add('active', 'show');
                } else {
                    pane.classList.remove('active', 'show');
                }
            });
        }
    } else {
        // 如果沒有活動的頁籤，激活第一個
        activateFirstTab();
    }
    
    // 優化Bootstrap標籤切換，解決可能的點擊問題
    document.querySelectorAll('.nav-tabs .nav-link').forEach(tab => {
        tab.removeEventListener('click', handleTabClick); // 移除以防重複
        tab.addEventListener('click', handleTabClick);
    });
    
    console.log("頁籤結構已修復");
}

/**
 * 頁籤點擊處理函數
 */
function handleTabClick(e) {
    if (this.hasAttribute('disabled')) return;
    
    // 獲取目標
    const target = this.getAttribute('data-bs-target') || this.getAttribute('href');
    if (!target) return;
    
    // 只有在非Bootstrap環境下才需手動切換頁籤
    if (!window.bootstrap) {
        e.preventDefault();
        
        // 更新頁籤狀態
        document.querySelectorAll('.nav-tabs .nav-link').forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        
        // 更新內容區域
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active', 'show');
        });
        
        const targetPane = document.querySelector(target);
        if (targetPane) {
            targetPane.classList.add('active', 'show');
        }
    }
}

/**
 * 添加緊急修復按鈕
 */
function addEmergencyButton() {
    // 檢查是否已存在緊急按鈕
    if (document.getElementById('emergency-reset-btn')) return;
    
    // 創建緊急修復按鈕
    const resetButton = document.createElement('button');
    resetButton.id = 'emergency-reset-btn';
    resetButton.innerHTML = '🛠️ 修復頁面';
    resetButton.style.position = 'fixed';
    resetButton.style.bottom = '20px';
    resetButton.style.right = '20px';
    resetButton.style.zIndex = '9999';
    resetButton.style.padding = '8px 15px';
    resetButton.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    resetButton.style.color = 'white';
    resetButton.style.border = '1px solid #4dabf7';
    resetButton.style.borderRadius = '4px';
    resetButton.style.cursor = 'pointer';
    resetButton.style.boxShadow = '0 0 5px #4dabf7';
    resetButton.style.fontFamily = 'Arial, sans-serif';
    resetButton.style.fontSize = '14px';
    resetButton.style.opacity = '0.7';
    resetButton.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // 滑鼠懸停效果
    resetButton.onmouseover = function() {
        this.style.opacity = '1';
        this.style.transform = 'scale(1.05)';
    };
    resetButton.onmouseout = function() {
        this.style.opacity = '0.7';
        this.style.transform = 'scale(1)';
    };
    
    // 點擊時執行頁面修復
    resetButton.onclick = function() {
        window.resetPage();
    };
    
    // 為了不干擾用戶體驗，10秒後自動隱藏按鈕
    document.body.appendChild(resetButton);
    setTimeout(() => {
        resetButton.style.opacity = '0';
        resetButton.style.pointerEvents = 'none';
    }, 10000);
    
    console.log("已添加緊急修復按鈕");
}

/**
 * 更新版本號
 */
function updateVersionNumber() {
    // 更新啟動畫面版本號
    const versionElement = document.querySelector('.splash-version');
    if (versionElement && versionElement.textContent === 'v3.0.1') {
        versionElement.textContent = 'v3.0.2';
        console.log("版本號已更新至 v3.0.2");
    }
}

// 初始化iPad觸控優化
document.addEventListener('DOMContentLoaded', function() {
    // 檢測是否為 iPad 設備
    const isIPad = /iPad/.test(navigator.userAgent) || 
                 (/Macintosh/i.test(navigator.platform) && navigator.maxTouchPoints > 1);
                 
    if (isIPad) {
        document.documentElement.classList.add('ipad-device');
        
        // 檢測初始方向
        const isLandscape = window.innerWidth > window.innerHeight;
        document.documentElement.classList.add(isLandscape ? 'ios-landscape' : 'ios-portrait');
        console.log("已為iPad設備優化界面");
    }
});
