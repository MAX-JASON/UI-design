/**
 * 強制靜態模式腳本 - 確保所有動態效果被禁用
 * 版本: 1.0.0 (2025-04-14)
 */

// 立即執行函數，但確保不會阻止頁面顯示
(function() {
    console.log("減弱動態效果模式啟動...");
    
    // 確保頁面先完成載入再應用靜態模式
    window.addEventListener('load', function() {
        // 等待100ms確保頁面已完全顯示
        setTimeout(reduceAnimations, 100);
    });
    
    // 在DOMContentLoaded事件之後的500ms再次處理，確保動態元素也被處理
    document.addEventListener('DOMContentLoaded', function() {
        // 等待500ms再處理動態元素
        setTimeout(reduceAnimations, 500);
    });
    
    /**
     * 減弱動畫效果而不完全移除
     */
    function reduceAnimations() {
        // 禁用所有animate.css效果
        document.querySelectorAll('.animate__animated, [class*="animate__"]').forEach(function(el) {
            // 移除所有animate類
            for (var i = el.classList.length - 1; i >= 0; i--) {
                if (el.classList[i].startsWith('animate__')) {
                    el.classList.remove(el.classList[i]);
                }
            }
            
            // 確保沒有內聯動畫樣式
            el.style.animation = 'none';
            el.style.animationDelay = '0s';
            el.style.animationDuration = '0s';
            el.style.transition = 'none';
            el.style.transform = 'none';
            el.style.opacity = '1';
        });
        
        // 禁用所有視覺特效元素
        document.querySelectorAll('.shimmer-effect, .lightning-effect, .glow-effect, .pulse-effect, .scan-effect').forEach(function(el) {
            el.style.display = 'none';
            el.style.opacity = '0';
        });
        
        // 修復粒子背景
        var particlesEl = document.getElementById('particles-js');
        if (particlesEl) {
            particlesEl.style.opacity = '0.2';
        }
        
        // 強制第一頁面參數介面靜態顯示
        var inputTab = document.getElementById('input');
        if (inputTab) {
            // 移除所有可能的動畫類
            inputTab.className = 'tab-pane fade show active single-tab-content';
            
            // 遍歷其所有子元素，確保它們也是靜態的
            forceElementsStatic(inputTab);
        }
        
        console.log("已成功應用靜態模式");
    }
    
    /**
     * 遞歸設置元素及其子元素為靜態
     */
    function forceElementsStatic(element) {
        // 處理當前元素
        element.style.animation = 'none';
        element.style.transition = 'none';
        element.style.transform = 'none';
        
        // 移除所有與動畫相關的class
        for (var i = element.classList.length - 1; i >= 0; i--) {
            var className = element.classList[i];
            if (className.includes('animate') || 
                className.includes('fade') ||
                className.includes('slide') ||
                className.includes('transition') ||
                className.includes('pulse') ||
                className.includes('glow') ||
                className.includes('shimmer') ||
                className.includes('scan')) {
                
                element.classList.remove(className);
            }
        }
        
        // 處理子元素
        Array.from(element.children).forEach(forceElementsStatic);
    }
})();
