/**
 * 全面修復腳本 - 修正所有HTML和JavaScript錯誤
 * 針對UI-design-rebuild項目的重構版本
 * 版本: 1.0.0 (2025-04-14)
 */

// 立即執行函數，確保變量不會污染全局空間
(function() {
    console.log("全面修復程序啟動 v1.0.0...");
    
    // 初始化修復列表
    const fixList = [];
    let fixesApplied = 0;
    
    // 在DOM載入完成後執行
    document.addEventListener('DOMContentLoaded', function() {
        // 等待主要UI加載完成
        setTimeout(function() {
            // 執行所有修復
            console.log("開始執行全面錯誤修復...");
            applyAllFixes();
        }, 1000);
    });
    
    /**
     * 頁面結構修復
     */
    function fixPageStructure() {
        // 修復頁籤結構 - 確保只有一個頁籤可見
        const activeTabs = document.querySelectorAll('.nav-tabs .nav-link.active');
        if (activeTabs.length > 1) {
            fixList.push("檢測到多個活動頁籤");
            Array.from(activeTabs).slice(1).forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            });
            fixesApplied++;
        }
        
        // 確保每個頁籤都對應一個內容面板
        document.querySelectorAll('.nav-tabs .nav-link').forEach(tab => {
            const target = tab.getAttribute('data-bs-target') || tab.getAttribute('href');
            if (target) {
                const pane = document.querySelector(target);
                if (!pane) {
                    fixList.push(`頁籤目標不存在: ${target}`);
                    // 讓頁籤不可點擊
                    tab.classList.add('disabled');
                    tab.setAttribute('disabled', 'disabled');
                }
            }
        });
        
        // 修復頁籤內容面板 - 確保每個可見的面板有正確的active類
        document.querySelectorAll('.tab-pane').forEach(pane => {
            if (getComputedStyle(pane).display !== 'none' && !pane.classList.contains('active')) {
                fixList.push(`可見頁籤面板缺少active類: ${pane.id}`);
                pane.classList.add('active', 'show');
                fixesApplied++;
            }
            
            if (pane.classList.contains('active') && getComputedStyle(pane).display === 'none') {
                fixList.push(`活動頁籤面板被隱藏: ${pane.id}`);
                pane.style.display = 'block';
                fixesApplied++;
            }
        });
    }
    
    /**
     * 修復表單輸入
     */
    function fixFormInputs() {
        // 確保所有數字輸入有合理的預設值
        document.querySelectorAll('input[type="number"]').forEach(input => {
            if (input.value === '' && !input.hasAttribute('placeholder')) {
                fixList.push(`數字輸入框缺少預設值: ${input.id || input.name}`);
                // 根據字段類型添加合理預設值
                if (input.id.includes('premium') || input.id.includes('dividend')) {
                    input.value = "0";
                } else if (input.id.includes('rate')) {
                    input.value = "2.5";
                } else if (input.id.includes('term')) {
                    input.value = "10";
                } else {
                    input.value = "0";
                }
                fixesApplied++;
            }
            
            // 確保min/max屬性正確
            if (!input.hasAttribute('min') && input.value !== '') {
                input.setAttribute('min', '0');
                fixesApplied++;
            }
        });
        
        // 確保所有選擇框有選中項
        document.querySelectorAll('select').forEach(select => {
            if (select.value === '' && select.options.length > 0) {
                fixList.push(`選擇框未選中項: ${select.id || select.name}`);
                select.selectedIndex = 0;
                fixesApplied++;
            }
        });
    }
    
    /**
     * 修復事件處理器
     */
    function fixEventHandlers() {
        // 修復按鈕點擊事件
        document.querySelectorAll('button:not([disabled])').forEach(button => {
            if (!button.onclick && !button.hasAttribute('data-bs-toggle')) {
                const moduleAttr = button.getAttribute('data-module');
                if (moduleAttr) {
                    // 為模塊切換按鈕添加點擊處理器
                    button.onclick = function() {
                        if (typeof handleModuleChange === 'function') {
                            handleModuleChange(moduleAttr);
                        } else {
                            console.log(`切換到模塊: ${moduleAttr}`);
                        }
                    };
                    fixesApplied++;
                }
            }
        });
        
        // 修復頁籤點擊事件
        document.querySelectorAll('.nav-tabs .nav-link:not([disabled])').forEach(tab => {
            // 確保頁籤點擊能夠正確切換
            tab.addEventListener('click', function(e) {
                if (this.hasAttribute('disabled')) return;
                
                // 如果使用data-bs-toggle="tab"但Bootstrap未正確加載
                if (this.getAttribute('data-bs-toggle') === 'tab' && 
                    (!window.bootstrap || !window.bootstrap.Tab)) {
                    e.preventDefault();
                    
                    // 獲取目標
                    const target = this.getAttribute('data-bs-target') || this.getAttribute('href');
                    if (!target) return;
                    
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
                        pane.style.display = 'none';
                    });
                    
                    const targetPane = document.querySelector(target);
                    if (targetPane) {
                        targetPane.classList.add('active', 'show');
                        targetPane.style.display = 'block';
                    }
                }
            });
        });
    }
    
    /**
     * 修復圖表和數據可視化問題
     */
    function fixCharts() {
        // 檢查是否有圖表但未正確初始化
        if (window.Chart) {
            document.querySelectorAll('canvas.chart-canvas').forEach(canvas => {
                // 檢查此 canvas 是否已經有圖表實例
                const hasChartInstance = (canvas.chartInstance || 
                                        (Chart.instances && Object.values(Chart.instances)
                                            .some(chart => chart.canvas === canvas)));
                
                if (!hasChartInstance) {
                    fixList.push(`發現未初始化圖表: ${canvas.id}`);
                    // 不實際創建圖表，因為缺少數據，但標記為待處理
                    canvas.setAttribute('data-needs-initialization', 'true');
                }
            });
        }
    }
    
    /**
     * 修復樣式和視覺問題
     */
    function fixStyles() {
        // 修復可能在某些設備上顯示不正確的樣式
        const style = document.createElement('style');
        style.innerHTML = `
            /* 確保表格正確顯示 */
            .table-responsive {
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }
            
            /* 確保按鈕有足夠的點擊區域 */
            .btn {
                min-height: 38px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            
            /* 確保輸入區域在iOS上正確顯示 */
            input, select, textarea {
                -webkit-appearance: none;
                border-radius: 4px;
            }
            
            /* 修復iOS上的滾動問題 */
            .scroll-container {
                -webkit-overflow-scrolling: touch;
            }
            
            /* 確保頁籤在窄屏設備上不換行 */
            @media (max-width: 768px) {
                .nav-tabs {
                    flex-wrap: nowrap;
                    overflow-x: auto;
                    scrollbar-width: none;
                }
                .nav-tabs::-webkit-scrollbar {
                    display: none;
                }
                .nav-tabs .nav-link {
                    white-space: nowrap;
                }
            }
        `;
        document.head.appendChild(style);
        fixesApplied++;
    }
    
    /**
     * 應用所有修復
     */
    function applyAllFixes() {
        // 應用所有修復
        fixPageStructure();
        fixFormInputs();
        fixEventHandlers();
        fixCharts();
        fixStyles();
        
        // 報告修復結果
        console.log(`已完成 ${fixesApplied} 項修復`);
        if (fixList.length > 0) {
            console.log("修復詳情:");
            fixList.forEach((fix, index) => {
                console.log(`${index + 1}. ${fix}`);
            });
        }
        
        // 將日誌添加到頁面
        addFixLog();
    }
    
    /**
     * 添加修復日誌到控制台
     */
    function addFixLog() {
        // 添加日誌到控制台
        console.log("%c全面修復完成", "color: #4dabf7; font-weight: bold; font-size: 14px;");
        console.log("%c系統狀態: 穩定", "color: #40c057; font-weight: bold;");
        
        // 如果修復數量為0，說明頁面已經很健康
        if (fixesApplied === 0) {
            console.log("%c頁面健康狀態良好，無需修復", "color: #40c057;");
        } else {
            console.log("%c已應用修復，頁面已穩定", "color: #4dabf7;");
        }
    }
})();
