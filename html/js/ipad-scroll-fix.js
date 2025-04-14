/**
 * iPad滚动修复脚本
 * 解决iOS Safari中滚动被阻止的问题
 */
document.addEventListener('DOMContentLoaded', function() {
    // 检测是否为iOS设备
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (/Macintosh/i.test(navigator.platform) && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
        console.log("iOS设备检测到，应用滚动修复");
        
        // 防止iOS橡皮筋效果
        document.body.addEventListener('touchmove', function(e) {
            if (e.target.closest('.scrollable, .tab-content, .tab-pane, .container, .container-fluid, .table-responsive, .card-body')) {
                e.stopPropagation();
            }
        }, { passive: false });
        
        // 启用滚动区域的自然滚动
        const scrollAreas = document.querySelectorAll('.scrollable, .tab-content, .tab-pane, .container, .container-fluid, .table-responsive, .card-body');
        scrollAreas.forEach(area => {
            area.style.webkitOverflowScrolling = 'touch';
            area.style.overflowY = 'auto';
        });
        
        // 修复滚动事件
        document.addEventListener('touchstart', function() {
            // 触摸开始时唤醒滚动
            window.scrollTo(0, window.scrollY);
        }, { passive: true });
        
        // 确保全局滚动正常工作
        window.addEventListener('load', function() {
            setTimeout(function() {
                window.scrollTo(0, 1);
                window.scrollTo(0, 0);
            }, 300);
        });
        
        // 针对固定容器添加可触控滚动
        const initScrollableElements = function() {
            const containers = document.querySelectorAll('.fixed-container, .modal-body, [data-fixed="true"]');
            containers.forEach(container => {
                container.style.overflow = 'auto';
                container.style.webkitOverflowScrolling = 'touch';
                container.setAttribute('data-scroll-fixed', 'true');
            });
        };
        
        initScrollableElements();
        // 动态添加的元素也应用相同的修复
        const observer = new MutationObserver(function() {
            initScrollableElements();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});
