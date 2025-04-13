/**
 * 内容恢复脚本 - 确保页面内容始终可见
 * 版本: 1.0.0 (2025-04-14)
 */

// 在页面刷新时确保内容可见
window.addEventListener('load', function() {
    // 检测页面是否有可见内容
    setTimeout(function() {
        ensureContentVisible();
    }, 1000); // 等待1秒后检查
});

// 确保内容可见的函数
function ensureContentVisible() {
    const mainContent = document.getElementById('analysisTabContent');
    
    // 检查主内容是否可见
    if (mainContent && (getComputedStyle(mainContent).display === 'none' || 
                         getComputedStyle(mainContent).visibility === 'hidden' ||
                         getComputedStyle(mainContent).opacity === '0')) {
        console.log("检测到内容不可见，正在恢复...");
        
        // 强制显示内容
        mainContent.style.display = 'block';
        mainContent.style.visibility = 'visible';
        mainContent.style.opacity = '1';
        
        // 确保第一个标签页内容可见
        const firstTab = document.getElementById('input');
        if (firstTab) {
            firstTab.style.display = 'block';
            firstTab.style.visibility = 'visible';
            firstTab.style.opacity = '1';
            firstTab.classList.add('active', 'show');
        }
        
        // 移除可能阻止内容显示的CSS
        const styleSheets = document.styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
            try {
                const sheet = styleSheets[i];
                // 跳过外部资源
                if (!sheet.href || sheet.href.includes('bootstrap') || sheet.href.includes('font-awesome')) continue;
                
                // 检查禁用规则
                if (sheet.cssRules) {
                    for (let j = 0; j < sheet.cssRules.length; j++) {
                        const rule = sheet.cssRules[j];
                        // 找到可能隐藏内容的规则
                        if (rule.selectorText && 
                           (rule.selectorText.includes('#analysisTabContent') || 
                            rule.selectorText.includes('#input') || 
                            rule.selectorText.includes('.tab-pane'))) {
                            
                            // 检查是否含有隐藏属性
                            const style = rule.style;
                            if (style.display === 'none' || 
                                style.visibility === 'hidden' || 
                                style.opacity === '0') {
                                // 禁用该规则
                                sheet.deleteRule(j);
                                j--; // 调整索引
                            }
                        }
                    }
                }
            } catch (e) {
                // 跨域错误处理
                console.log("无法访问样式表:", e);
            }
        }
        
        console.log("内容恢复完成");
    } else {
        console.log("内容检查正常");
    }
}
