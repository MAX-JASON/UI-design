/**
 * 专门修复第一页输入参数框架动态效果问题
 * 版本: 1.0.0 (2025-04-14)
 */

// 立即执行函数
(function() {
    console.log("第一页输入参数框架静态化开始...");
    
    // 在DOM开始解析时就执行
    document.addEventListener('readystatechange', function() {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            makeInputFrameStatic();
        }
    });
    
    // 再次尝试修复
    document.addEventListener('DOMContentLoaded', makeInputFrameStatic);
    
    // 延迟执行，确保覆盖其他脚本的改动
    setTimeout(makeInputFrameStatic, 500);
    
    /**
     * 使第一页输入参数框架完全静态
     */
    function makeInputFrameStatic() {
        console.log("正在移除第一页的动态效果...");
        
        try {
            // 1. 定位主面板
            const mainPanel = document.querySelector('.dashboard-grid .panel');
            if (mainPanel) {
                // 移除所有特效元素
                const effects = mainPanel.querySelectorAll('.shimmer-effect, .lightning-effect');
                effects.forEach(effect => {
                    effect.parentNode.removeChild(effect);
                });
                
                // 确保框架角落保持静态
                const frames = mainPanel.querySelectorAll('.tech-frame');
                frames.forEach(frame => {
                    frame.style.animation = 'none';
                    frame.style.transition = 'none';
                    frame.style.transform = 'none';
                    frame.style.borderColor = 'rgba(0, 229, 255, 0.7)';
                });
            }
            
            // 2. 定位输入参数区域
            const inputPane = document.getElementById('input');
            if (inputPane) {
                // 移除所有动画类
                inputPane.className = 'tab-pane fade show active single-tab-content';
                
                // 移除内部所有动画效果
                const allElements = inputPane.querySelectorAll('*');
                allElements.forEach(el => {
                    // 移除所有动画相关类
                    if (el.classList) {
                        for (let i = el.classList.length - 1; i >= 0; i--) {
                            const cls = el.classList[i];
                            if (cls.includes('animate') || 
                                cls.includes('fade') || 
                                cls.includes('slide') || 
                                cls.includes('pulse') || 
                                cls.includes('glow') || 
                                cls.includes('shimmer')) {
                                el.classList.remove(cls);
                            }
                        }
                    }
                    
                    // 添加内联样式禁用动画
                    el.style.animation = 'none';
                    el.style.transition = 'none';
                    el.style.transform = 'none';
                    
                    // 移除hover效果
                    el.onmouseover = null;
                    el.onmouseout = null;
                });
                
                // 特别处理卡片
                const cards = inputPane.querySelectorAll('.tech-card, .tech-card-advanced');
                cards.forEach(card => {
                    card.style.boxShadow = '0 0 8px rgba(0, 229, 255, 0.4)';
                    card.style.border = '1px solid rgba(0, 229, 255, 0.7)';
                    card.style.animation = 'none';
                    card.style.transition = 'none';
                    card.style.transform = 'none';
                });
            }
            
            // 3. 移除所有可能的动画监听器
            if (typeof window.jQuery !== 'undefined') {
                try {
                    // 尝试移除jQuery动画
                    window.jQuery('#input, #input *, .panel, .panel *').stop(true, true);
                } catch (e) {
                    console.log("无法停止jQuery动画:", e);
                }
            }
            
            console.log("第一页输入参数框架动态效果已移除");
        } catch (e) {
            console.error("移除动态效果出错:", e);
        }
    }
})();
