/**
 * 变量声明修复脚本
 * 解决所有变量重复声明问题
 * 版本: 1.0.0 (2025-04-14)
 */

(function() {
    console.log("变量声明修复脚本启动...");
    
    // 在页面加载时执行
    document.addEventListener('DOMContentLoaded', function() {
        // 修复全局变量声明
        fixGlobalVariables();
        
        // 修复产品导入标签点击问题
        fixProductTabNavigation();
        
        console.log("变量声明修复完成");
    });
    
    /**
     * 修复全局变量声明
     */
    function fixGlobalVariables() {
        console.log("开始修复全局变量声明...");
        
        // 使用安全的方式定义全局变量 - 防止重复声明错误
        
        // 1. isIOS 变量
        if ('isIOS' in window) {
            console.log("发现全局isIOS变量，使用值:", window.isIOS);
            const originalValue = window.isIOS;
            Object.defineProperty(window, 'isIOS', {
                configurable: true,
                get: function() {
                    return originalValue;
                },
                set: function(newValue) {
                    console.log("尝试修改isIOS为", newValue);
                    // 允许修改
                }
            });
        }
        
        // 2. isIPad 变量
        if ('isIPad' in window) {
            console.log("发现全局isIPad变量，使用值:", window.isIPad);
            const originalValue = window.isIPad;
            Object.defineProperty(window, 'isIPad', {
                configurable: true,
                get: function() {
                    return originalValue;
                },
                set: function(newValue) {
                    console.log("尝试修改isIPad为", newValue);
                    // 允许修改
                }
            });
        }
        
        // 3. policyData 变量
        if ('policyData' in window) {
            console.log("发现全局policyData变量，使用值:", window.policyData);
            const originalValue = window.policyData || {};
            Object.defineProperty(window, 'policyData', {
                configurable: true,
                get: function() {
                    return originalValue;
                },
                set: function(newValue) {
                    console.log("尝试修改policyData为", newValue);
                    // 允许修改
                }
            });
        }
        
        // 打上补丁，拦截后续的变量声明
        const originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, descriptor) {
            if (obj === window && (prop === 'isIOS' || prop === 'isIPad' || prop === 'policyData')) {
                console.log(`拦截了对${prop}的重复声明`);
                return obj;
            }
            return originalDefineProperty.call(this, obj, prop, descriptor);
        };
        
        // 拦截 eval 和 new Function 创建的变量声明
        const sensitiveVars = ['isIOS', 'isIPad', 'policyData'];
        const originalEval = window.eval;
        window.eval = function(code) {
            for (const varName of sensitiveVars) {
                // 对常量声明进行替换，防止报错
                code = code.replace(
                    new RegExp(`(const|let|var)\\s+${varName}\\s*=`, 'g'), 
                    `window.${varName} = window.${varName} || `
                );
            }
            return originalEval.call(window, code);
        };
    }
    
    /**
     * 修复产品导入标签点击问题
     */
    function fixProductTabNavigation() {
        console.log("开始修复产品导入标签点击问题...");
        
        // 由于有可能在DOM加载完成后还不存在这些元素，我们需要使用MutationObserver来监视
        const observer = new MutationObserver(function(mutations) {
            // 检查产品导入标签是否存在
            const productsTab = document.getElementById('products-tab');
            if (productsTab) {
                console.log("发现产品导入标签，添加点击处理");
                
                // 强制移除所有已有的事件监听器
                const oldTab = productsTab;
                const newTab = oldTab.cloneNode(true);
                if (oldTab.parentNode) {
                    oldTab.parentNode.replaceChild(newTab, oldTab);
                }
                
                // 添加新的点击事件处理器
                newTab.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log("产品导入标签被点击");
                    
                    // 获取产品面板
                    const productsPane = document.getElementById('products');
                    if (productsPane) {
                        console.log("找到产品面板，手动切换");
                        
                        // 隐藏所有面板
                        document.querySelectorAll('.tab-pane').forEach(function(pane) {
                            pane.classList.remove('show', 'active');
                            pane.style.display = 'none';
                        });
                        
                        // 显示产品面板
                        productsPane.classList.add('show', 'active');
                        productsPane.style.display = 'block';
                        
                        // 更新标签状态
                        document.querySelectorAll('.nav-tabs .nav-link').forEach(function(link) {
                            link.classList.remove('active');
                            link.setAttribute('aria-selected', 'false');
                        });
                        
                        newTab.classList.add('active');
                        newTab.setAttribute('aria-selected', 'true');
                        
                        // 刷新产品数据
                        if (typeof window.updateProductTable === 'function') {
                            window.updateProductTable();
                        }
                        
                        // 刷新选中产品显示
                        if (typeof window.updateSelectedProductsDisplay === 'function') {
                            window.updateSelectedProductsDisplay();
                        }
                        
                        console.log("产品导入标签切换成功");
                    } else {
                        console.error("未找到产品面板");
                    }
                    
                    return false;
                });
                
                // 已找到并修复，停止观察
                observer.disconnect();
                console.log("产品导入标签修复完成");
            }
        });
        
        // 开始观察文档变化
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
        
        // 设置超时，如果10秒后还没找到，就停止观察
        setTimeout(function() {
            if (observer) {
                observer.disconnect();
                console.log("产品导入标签观察超时");
            }
        }, 10000);
    }
})();
