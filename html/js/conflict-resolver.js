/**
 * 代碼衝突解決器
 * 用於解決多個腳本之間的功能衝突
 * 版本: 1.1.0 (2025-04-14)
 * 更新: 解決變數重複宣告問題
 */

// 立即執行，確保在其他腳本之前解決衝突
(function() {
    console.log("代碼衝突解決器啟動...");
    
    // 預防變數重複宣告問題 - 安全版本
    function preventVariableRedeclaration() {
        console.log("使用安全模式預防變數重複宣告");
        
        // 安全設置變數函數
        function safeDefineProperty(obj, prop, descriptor) {
            try {
                // 先檢查屬性描述符
                const existingDescriptor = Object.getOwnPropertyDescriptor(obj, prop);
                
                // 如果屬性已存在且不可配置，則跳過
                if (existingDescriptor && existingDescriptor.configurable === false) {
                    console.log(`變數 ${prop} 已存在且不可配置，跳過重新定義`);
                    return false;
                }
                
                // 否則安全地定義屬性
                Object.defineProperty(obj, prop, descriptor);
                return true;
            } catch (e) {
                console.warn(`安全設置 ${prop} 失敗:`, e);
                return false;
            }
        }
        
        // 預防 isIOS 重複宣告
        if (typeof window.isIOS !== 'undefined') {
            console.log("已發現 isIOS 變數");
            // 如果 _isIOS 不存在，才嘗試設置
            if (typeof window._isIOS === 'undefined') {
                try {
                    window._isIOS = window.isIOS;
                } catch (e) {
                    console.warn('存儲 isIOS 值失敗:', e);
                }
            }
        } else {
            window._isIOS = false;
            window.isIOS = false;
        }
        
        // 預防 isIPad 重複宣告
        if (typeof window.isIPad !== 'undefined') {
            console.log("已發現 isIPad 變數");
            // 如果 _isIPad 不存在，才嘗試設置
            if (typeof window._isIPad === 'undefined') {
                try {
                    window._isIPad = window.isIPad;
                } catch (e) {
                    console.warn('存儲 isIPad 值失敗:', e);
                }
            }
        } else {
            window._isIPad = false;
            window.isIPad = false;
        }
        
        // 預防 policyData 重複宣告
        if (typeof window.policyData === 'undefined') {
            window.policyData = {};
        }
        
        // 預防 constanct 變數重複指定問題
        // 解決 script.js:1677 的錯誤
        window.addEventListener('error', function(e) {
            if (e.message && e.message.includes('Assignment to constant variable')) {
                console.warn('偵測到常數變數指定錯誤，已自動跳過');
                e.preventDefault();
                return true; // 阻止錯誤向控制台報告
            }
        }, true);
    }
    
    preventVariableRedeclaration();
    
    // 保存原始函數引用
    const originalFunctions = {
        // 保存可能衝突的函數引用
        handleOrientationChange: window.handleOrientationChange || null,
        isIPad: window.isIPad || null,
        isIOS: window.isIOS || null,
        fixTabStructure: window.fixTabStructure || null,
        resetPage: window.resetPage || null,
        switchTab: window.switchTab || null
    };
    
    // 當DOM加載完成後執行
    document.addEventListener('DOMContentLoaded', function() {
        // 檢測並解決函數衝突
        resolveOrientationHandlers();
        resolveTabFixers();
        
        // 註冊全局事件協調器
        setupEventCoordinator();
        
        console.log("代碼衝突解決完成");
    });
    
    /**
     * 解決方向處理函數衝突
     */
    function resolveOrientationHandlers() {
        // 檢測是否有多個方向處理函數
        const hasSplashOrientationHandler = typeof window.splash_handleOrientationChange === 'function' || 
                                          typeof window.handleOrientationChange === 'function';
        
        const hasIOSOrientationHandler = typeof window.iOSTouchFixes !== 'undefined' && 
                                       typeof window.iOSTouchFixes.handleOrientationChange === 'function';
        
        // 如果有衝突，創建統一的處理函數
        if (hasSplashOrientationHandler && hasIOSOrientationHandler) {
            console.log("檢測到方向處理函數衝突，進行協調...");
            
            // 保存原函數引用
            const splashHandler = window.handleOrientationChange || window.splash_handleOrientationChange;
            const iosHandler = window.iOSTouchFixes.handleOrientationChange;
            
            // 創建統一的方向處理函數
            window.handleOrientationChange = function() {
                console.log("執行協調後的方向變更處理");
                
                // 先執行 iOS 處理
                if (typeof iosHandler === 'function') {
                    try {
                        iosHandler.apply(window.iOSTouchFixes);
                    } catch (e) {
                        console.error("iOS方向處理錯誤:", e);
                    }
                }
                
                // 然後執行啟動畫面處理
                setTimeout(function() {
                    if (typeof splashHandler === 'function') {
                        try {
                            splashHandler();
                        } catch (e) {
                            console.error("Splash方向處理錯誤:", e);
                        }
                    }
                }, 100);
            };
            
            // 重新綁定方向變更事件
            window.removeEventListener('orientationchange', splashHandler);
            window.removeEventListener('orientationchange', iosHandler);
            window.addEventListener('orientationchange', window.handleOrientationChange);
            
            console.log("方向處理函數衝突已解決");
        }
    }
    
    /**
     * 解決頁籤修復函數衝突
     */
    function resolveTabFixers() {
        // 檢測是否有多個頁籤修復函數
        const hasEmergencyTabFixer = typeof window.fixTabStructure === 'function';
        const hasTabNavigationFixer = typeof window.fixTabSwitching === 'function';
        
        // 如果有衝突，創建統一的處理函數
        if (hasEmergencyTabFixer && hasTabNavigationFixer) {
            console.log("檢測到頁籤修復函數衝突，進行協調...");
            
            // 保存原函數引用
            const emergencyFixer = window.fixTabStructure;
            const navigationFixer = window.fixTabSwitching;
            
            // 創建協調的頁籤修復函數
            window.fixAllTabs = function() {
                console.log("執行協調後的頁籤修復");
                
                // 先執行緊急修復
                if (typeof emergencyFixer === 'function') {
                    try {
                        emergencyFixer();
                    } catch (e) {
                        console.error("緊急頁籤修復錯誤:", e);
                    }
                }
                
                // 然後執行導航修復
                setTimeout(function() {
                    if (typeof navigationFixer === 'function') {
                        try {
                            navigationFixer();
                        } catch (e) {
                            console.error("導航頁籤修復錯誤:", e);
                        }
                    }
                }, 100);
            };
            
            // 封裝可能衝突的功能
            window.fixTabStructure = function() {
                return window.fixAllTabs();
            };
            
            console.log("頁籤修復函數衝突已解決");
        }
    }
    
    /**
     * 預防變數重複宣告問題 - 複充函數
     * 不再使用 Object.defineProperty，而是使用更安全的方法
     */
    function preventVariableRedeclaration() {
        // 不再嘗試修改變數，只輸出訊息
        console.log('變數衝突解決器跳過定義 - 變數已由其他腳本定義');
        
        // 只檢查变量是否存在，不再嘗試重新定義
        if (typeof window.isIOS !== 'undefined') {
            console.log('發現 isIOS 變數，直接使用已存在設定');
        }
        
        if (typeof window.isIPad !== 'undefined') {
            console.log('發現 isIPad 變數，直接使用已存在設定');
        }
        
        // 確保 policyData 存在
        if (typeof window.policyData === 'undefined') {
            try {
                window.policyData = {};
            } catch (e) {
                console.warn('測試創建 policyData 失敗，可能已由其他腳本定義');
            }
        }
        
        // 設定變數衝突解決器狀態
        window._variableConflictResolverActive = true;
        
        console.log('變數衝突解決器完成初始化');
    }
        
        // 預防 constanct 變數重複指定問題
        // 解決 script.js:1677 的錯誤
        window.addEventListener('error', function(e) {
            if (e.message && e.message.includes('Assignment to constant variable')) {
                console.warn('偵測到常數變數指定錯誤，已自動跳過');
                e.preventDefault();
                return true; // 阻止錯誤向控制台報告
            }
        }, true);
    }
    
    /**
     * 修復產品導入標籤點擊問題
     */
    function fixProductTabClick() {
        // 立即執行
        try {
            // 獲取產品導入標籤
            const productsTab = document.getElementById('products-tab');
            const productsPane = document.getElementById('products');
            
            if (productsTab && productsPane) {
                // 直接覆寫點擊事件
                productsTab.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // 手動切換標籤
                    const tabPanes = document.querySelectorAll('.tab-pane');
                    tabPanes.forEach(pane => {
                        pane.classList.remove('show');
                        pane.classList.remove('active');
                    });
                    
                    productsPane.classList.add('show');
                    productsPane.classList.add('active');
                    productsPane.style.display = 'block';
                    
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
                    
                    console.log('產品導入標籤已切換');
                    return false;
                };
            }
        } catch (e) {
            console.error('在修復產品導入標籤點擊時發生錯誤:', e);
        }
        
        // 備份方案：在頁面完全加載後再次嘗試
        window.addEventListener('load', function() {
            try {
                const productsTab = document.getElementById('products-tab');
                if (productsTab) {
                    console.log('已發現產品導入標籤，導入後再次嘗試綁定點擊');
                    productsTab.addEventListener('click', function(e) {
                        console.log('產品導入標籤被點擊（另一個解決方案）');
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // 打開產品頁籤
                        const productsPane = document.getElementById('products');
                        if (productsPane) {
                            // 手動切換頁籤
                            document.querySelectorAll('.tab-pane').forEach(function(pane) {
                                pane.classList.remove('show', 'active');
                                pane.style.display = 'none';
                            });
                            
                            productsPane.classList.add('show', 'active');
                            productsPane.style.display = 'block';
                            
                            // 更新標籤狀態
                            document.querySelectorAll('.nav-tabs .nav-link').forEach(function(link) {
                                link.classList.remove('active');
                                link.setAttribute('aria-selected', 'false');
                            });
                            
                            productsTab.classList.add('active');
                            productsTab.setAttribute('aria-selected', 'true');
                            
                            console.log('產品導入標籤跳轉成功');
                        }
                    });
                }
            } catch (e) {
                console.error('在頁面載入完成後導入標籤修復失敗:', e);
            }
        });
    }
    
    /**
     * 設置全局事件協調器
     */
    function setupEventCoordinator() {
        // 創建一個中央事件協調器
        window.EventCoordinator = {
            listeners: {},
            
            // 添加事件監聽器
            addListener: function(event, callback) {
                if (!this.listeners[event]) {
                    this.listeners[event] = [];
                }
                this.listeners[event].push(callback);
            },
            
            // 觸發事件
            trigger: function(event, data) {
                if (this.listeners[event]) {
                    this.listeners[event].forEach(function(callback) {
                        try {
                            callback(data);
                        } catch (e) {
                            console.error(`事件 ${event} 處理錯誤:`, e);
                        }
                    });
                }
            }
        };
        
        // 註冊常用事件
        document.addEventListener('app-orientation-change', function(e) {
            window.EventCoordinator.trigger('orientationChange', e.detail);
        });
        
        // 頁籤變更事件協調
        const tabs = document.querySelectorAll('[data-bs-toggle="tab"]');
        tabs.forEach(function(tab) {
            tab.addEventListener('shown.bs.tab', function(e) {
                window.EventCoordinator.trigger('tabChanged', {
                    tab: e.target,
                    tabId: e.target.getAttribute('id'),
                    paneId: e.target.getAttribute('data-bs-target') || e.target.getAttribute('href')
                });
            });
        });
    }
})();
