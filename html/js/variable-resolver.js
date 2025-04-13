/**
 * 变量解析器 - 直接解决变量重复声明问题
 * 版本: 1.0.0 (2025-04-14)
 */

// 立即执行，确保在其他脚本之前运行
(function() {
    console.log('变量解析器启动...');
    
    // 将会被多个脚本重复声明的全局变量
    window.__globalVars = {
        // 存储变量值的内部对象
        _store: {
            isIOS: false,
            isIPad: false,
            policyData: {}
        },
        
        // 检查变量是否已定义
        has: function(name) {
            return this._store.hasOwnProperty(name);
        },
        
        // 获取变量值
        get: function(name) {
            return this._store[name];
        },
        
        // 设置变量值
        set: function(name, value) {
            this._store[name] = value;
            return value;
        }
    };
    
    // 将频繁被重复声明的变量通过Object.defineProperty定义为全局变量
    // 这样即使其他脚本尝试重新声明，也不会抛出错误
    
    // isIOS
    Object.defineProperty(window, 'isIOS', {
        get: function() { return window.__globalVars.get('isIOS'); },
        set: function(value) { return window.__globalVars.set('isIOS', value); },
        configurable: false // 防止被重新定义
    });
    
    // isIPad
    Object.defineProperty(window, 'isIPad', {
        get: function() { return window.__globalVars.get('isIPad'); },
        set: function(value) { return window.__globalVars.set('isIPad', value); },
        configurable: false
    });
    
    // policyData 
    Object.defineProperty(window, 'policyData', {
        get: function() { return window.__globalVars.get('policyData'); },
        set: function(value) { return window.__globalVars.set('policyData', value); },
        configurable: false
    });
    
    // 直接修复产品导入标签点击问题
    window.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            try {
                // 获取产品导入标签和内容
                const productsTab = document.getElementById('products-tab');
                const productsPane = document.getElementById('products');
                
                if (productsTab && productsPane) {
                    console.log('产品导入标签已找到，修复点击事件');
                    
                    // 强制移除原有事件监听器
                    const oldElement = productsTab;
                    const newElement = oldElement.cloneNode(true);
                    oldElement.parentNode.replaceChild(newElement, oldElement);
                    
                    // 添加新的点击事件
                    newElement.addEventListener('click', function(e) {
                        console.log('产品导入标签被点击');
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // 手动切换标签
                        document.querySelectorAll('.tab-pane').forEach(function(pane) {
                            pane.classList.remove('show', 'active');
                            pane.style.display = 'none';
                        });
                        
                        productsPane.classList.add('show', 'active');
                        productsPane.style.display = 'block';
                        
                        // 更新标签状态
                        document.querySelectorAll('.nav-tabs .nav-link').forEach(function(link) {
                            link.classList.remove('active');
                            link.setAttribute('aria-selected', 'false');
                        });
                        
                        newElement.classList.add('active');
                        newElement.setAttribute('aria-selected', 'true');
                        
                        // 手动触发 tab-content-fix.js 中的逻辑
                        if (window.productDatabase && typeof window.updateProductTable === 'function') {
                            window.updateProductTable();
                        }
                        
                        if (window.productDatabase && typeof window.updateSelectedProductsDisplay === 'function') {
                            window.updateSelectedProductsDisplay();
                        }
                        
                        console.log('产品导入标签切换成功');
                    });
                }
            } catch (error) {
                console.error('修复产品导入标签点击时出错:', error);
            }
        }, 500);
    });
    
    console.log('变量解析器初始化完成');
})();
