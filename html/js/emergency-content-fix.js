/**
 * 应急内容修复脚本 - 确保页面内容始终可见
 * 版本: 1.0.1 (2025-04-14)
 */

// 立即执行函数
(function() {
    // 将脚本放入首页立即执行区域
    console.log("应急内容修复脚本启动...");
    
    // 防止变量重复声明错误
    preventVariableRedeclaration();
    
    // 确保内容可见
    ensureContentVisibility();
    
    // 监视DOM变化
    document.addEventListener('DOMContentLoaded', function() {
        // 页面加载后100ms再次检查
        setTimeout(ensureContentVisibility, 100);
        
        // 添加内容恢复按钮
        addRecoveryButton();
    });
    
    // 再次应用修复措施
    window.addEventListener('load', function() {
        setTimeout(ensureContentVisibility, 500);
    });
    
    /**
     * 防止变量重复声明错误
     */
    function preventVariableRedeclaration() {
        // 创建一个全局对象存储所有可能重复声明的变量
        window._globalVariables = window._globalVariables || {};
        
        // 常见的重复声明变量
        const variablesToCheck = [
            'isIOS', 'isIPad', 'policyData', 'currentModule', 
            'showMarketComparison', 'chartInstances', 'isInitialized'
        ];
        
        // 确保这些变量不会被重复声明
        variablesToCheck.forEach(function(varName) {
            // 创建一个全局getter和setter
            if (!(varName in window._globalVariables)) {
                window._globalVariables[varName] = undefined;
                
                // 使用Object.defineProperty防止重复声明
                try {
                    Object.defineProperty(window, varName, {
                        get: function() { return window._globalVariables[varName]; },
                        set: function(newValue) { 
                            console.log("设置全局变量: " + varName + " = ", newValue);
                            window._globalVariables[varName] = newValue; 
                        },
                        configurable: true
                    });
                } catch (e) {
                    console.log("无法设置属性 " + varName + ": " + e.message);
                }
            }
        });
        
        console.log("已防止变量重复声明错误");
    }
    
    /**
     * 确保所有内容可见
     */
    function ensureContentVisibility() {
        try {
            console.log("检查页面内容可见性...");
            
            // 1. 首先确保主容器可见
            const dashboard = document.querySelector('.dashboard-container');
            if (dashboard) {
                dashboard.style.display = 'flex';
                dashboard.style.visibility = 'visible';
                dashboard.style.opacity = '1';
                dashboard.style.height = '300vh'; // 保持3倍高度
            }
            
            // 2. 确保标签内容可见
            const tabContent = document.getElementById('analysisTabContent');
            if (tabContent) {
                tabContent.style.display = 'block';
                tabContent.style.visibility = 'visible';
                tabContent.style.opacity = '1';
            }
            
            // 3. 确保第一个标签页可见
            const firstTabPane = document.getElementById('input');
            if (firstTabPane) {
                firstTabPane.style.display = 'block';
                firstTabPane.style.visibility = 'visible';
                firstTabPane.style.opacity = '1';
                firstTabPane.classList.add('active', 'show');
                
                // 激活对应的标签
                const firstTab = document.getElementById('input-tab');
                if (firstTab) {
                    firstTab.classList.add('active');
                    firstTab.setAttribute('aria-selected', 'true');
                }
            }
            
            // 4. 确保所有关键内容可见
            document.querySelectorAll('.tech-card, .tech-card-advanced, .panel').forEach(function(el) {
                el.style.visibility = 'visible';
                el.style.opacity = '1';
                el.style.display = 'block';
            });
            
            // 5. 移除所有可能隐藏元素的类
            document.querySelectorAll('[class*="d-none"], [class*="invisible"], [class*="opacity-0"]').forEach(function(el) {
                el.classList.remove('d-none', 'invisible', 'opacity-0');
                el.style.display = '';
                el.style.visibility = 'visible';
                el.style.opacity = '1';
            });
            
            console.log("页面内容可见性检查完成");
        } catch (error) {
            console.error("确保内容可见时出错:", error);
        }
    }
    
    /**
     * 添加内容恢复按钮
     */
    function addRecoveryButton() {
        // 检查是否已存在
        if (document.getElementById('emergency-content-fix-button')) return;
        
        // 创建按钮
        const button = document.createElement('button');
        button.id = 'emergency-content-fix-button';
        button.textContent = '恢复页面内容';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.zIndex = '99999';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#ff0000';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';
        
        // 添加点击事件
        button.addEventListener('click', function() {
            ensureContentVisibility();
            alert('已尝试恢复页面内容。如果仍未显示，请尝试刷新页面。');
        });
        
        // 添加到文档
        document.body.appendChild(button);
        console.log("已添加内容恢复按钮");
    }
})();
