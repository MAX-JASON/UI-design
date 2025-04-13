/**
 * 直接变量修复脚本
 * 通过全局拦截声明，在脚本执行前预防变量重复声明问题
 * 版本: 1.0.0 (2025-04-14)
 */

// 立即执行，确保在所有其他脚本前运行
(function() {
    console.log("直接变量修复脚本启动...");
    
    // 防止脚本解析错误的全局方案
    
    // 1. 保存原始defineProperty方法
    const originalDefineProperty = Object.defineProperty;
    
    // 2. 重写defineProperty，拦截对关键变量的定义尝试
    Object.defineProperty = function(obj, prop, descriptor) {
        // 如果尝试为window定义我们想保护的属性
        if (obj === window && ['isIOS', 'isIPad', 'policyData', 'lastWidth'].includes(prop)) {
            console.log(`拦截到对${prop}的定义尝试，已忽略`);
            return window; // 返回window但不执行真正的defineProperty
        }
        
        // 对其他属性正常执行defineProperty
        return originalDefineProperty.apply(this, arguments);
    };
    
    // 3. 预先定义这些变量，确保它们已存在
    window.isIOS = false;
    window.isIPad = false;
    window.policyData = {};
    window.lastWidth = window.innerWidth;
    
    // 4. 保存eval和Function构造函数
    const originalEval = window.eval;
    const originalFunction = window.Function;
    
    // 5. 重写eval，移除变量声明
    window.eval = function(code) {
        // 替换const/let/var声明为赋值语句
        code = code.replace(/\b(const|let|var)\s+(isIOS|isIPad|policyData|lastWidth)\b/g, 'window.$2');
        return originalEval.call(window, code);
    };
    
    // 6. 重写Function构造函数
    window.Function = function() {
        let args = Array.from(arguments);
        // 最后一个参数是函数体
        if (args.length > 0) {
            let body = args[args.length - 1];
            // 替换const/let/var声明为赋值语句
            body = body.replace(/\b(const|let|var)\s+(isIOS|isIPad|policyData|lastWidth)\b/g, 'window.$2');
            args[args.length - 1] = body;
        }
        // 调用原始Function构造函数
        return originalFunction.apply(this, args);
    };
    
    // 7. 监听script标签加载事件，预防内嵌脚本中的变量声明问题
    document.addEventListener('DOMContentLoaded', function() {
        console.log("DOM内容加载完成，处理内嵌脚本...");
        
        // 监听动态创建的script标签
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.tagName === 'SCRIPT') {
                            console.log("检测到脚本添加，预处理内容");
                            handleScriptNode(node);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
        
        // 处理产品导入标签点击问题
        fixProductTab();
    });
    
    // 处理script节点
    function handleScriptNode(scriptNode) {
        if (scriptNode.src) return; // 不处理外部脚本
        
        const originalContent = scriptNode.textContent;
        // 替换const/let/var声明为赋值语句
        const newContent = originalContent.replace(
            /\b(const|let|var)\s+(isIOS|isIPad|policyData|lastWidth)\b/g, 
            'window.$2'
        );
        
        if (originalContent !== newContent) {
            scriptNode.textContent = newContent;
            console.log("已预处理脚本内容，移除变量声明");
        }
    }
    
    // 修复产品导入标签点击问题
    function fixProductTab() {
        // 设置一个定时器，等待所有DOM元素渲染完成
        setTimeout(function() {
            console.log("修复产品导入标签点击");
            
            // 找到产品标签和面板
            const productsTab = document.getElementById('products-tab');
            const productsPane = document.getElementById('products');
            
            if (productsTab && productsPane) {
                console.log("找到产品标签和面板，设置直接点击处理");
                
                // 移除现有的事件监听器
                const newTab = productsTab.cloneNode(true);
                productsTab.parentNode.replaceChild(newTab, productsTab);
                
                // 添加新的点击处理
                newTab.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log("产品标签被点击");
                    
                    // 隐藏所有面板
                    document.querySelectorAll('.tab-pane').forEach(function(pane) {
                        pane.classList.remove('show', 'active');
                        pane.style.display = 'none';
                    });
                    
                    // 显示产品面板
                    productsPane.classList.add('show', 'active');
                    productsPane.style.display = 'block';
                    
                    // 更新标签状态
                    document.querySelectorAll('.nav-link').forEach(function(tab) {
                        tab.classList.remove('active');
                        tab.setAttribute('aria-selected', 'false');
                    });
                    
                    newTab.classList.add('active');
                    newTab.setAttribute('aria-selected', 'true');
                    
                    // 更新产品表格（如果存在）
                    if (window.updateProductTable) {
                        window.updateProductTable();
                    }
                    
                    console.log("产品标签切换成功");
                    return false;
                });
            }
        }, 1000); // 等待1秒确保DOM完全加载
    }
    
    console.log("直接变量修复脚本初始化完成");
})();
