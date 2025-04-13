/**
 * 標籤頁修復腳本 - 統一所有頁面框架和滾動效果
 * 版本: 1.0.0 (2025-04-14)
 */

// 當文檔載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    console.log("標籤頁修復程序啟動...");
    
    // 修復所有標籤頁結構
    fixAllTabPanes();
    
    // 啟用粒子背景
    enableParticlesBackground();
    
    // 解除頁面2-3-4的滾輪限制
    removeScrollRestrictions();
    
    // 確保綜合報告選項框可見
    enableReportOption();
});

/**
 * 為所有標籤頁添加統一框架
 */
function fixAllTabPanes() {
    // 尋找所有標籤頁
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    console.log(`找到 ${tabPanes.length} 個標籤頁需要修復`);
    
    // 為每個標籤頁添加統一的框架元素
    tabPanes.forEach((pane, index) => {
        // 檢查是否已有框架元素
        if (!pane.querySelector('.tech-frame.top-left')) {
            // 添加四個角落框架
            const frames = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
            
            frames.forEach(position => {
                const frame = document.createElement('div');
                frame.className = `tech-frame ${position}`;
                pane.appendChild(frame);
            });
            
            // 添加閃爍效果
            const shimmerEffect = document.createElement('div');
            shimmerEffect.className = 'shimmer-effect';
            pane.appendChild(shimmerEffect);
            
            // 添加雷電效果
            const lightningEffect = document.createElement('div');
            lightningEffect.className = 'lightning-effect';
            pane.appendChild(lightningEffect);
            
            console.log(`已為標籤頁 #${pane.id} 添加框架元素`);
        }
    });
    
    // 確保第一頁的設計風格應用到所有頁面
    const firstPane = document.querySelector('.tab-pane');
    if (firstPane) {
        const computedStyle = window.getComputedStyle(firstPane);
        const backgroundColor = computedStyle.backgroundColor;
        const borderColor = computedStyle.borderColor;
        const boxShadow = computedStyle.boxShadow;
        
        // 應用相同樣式到所有標籤頁
        tabPanes.forEach((pane, index) => {
            if (index > 0) { // 跳過第一個頁面
                pane.style.backgroundColor = backgroundColor;
                pane.style.borderColor = borderColor;
                pane.style.boxShadow = boxShadow;
            }
        });
    }
}

/**
 * 啟用粒子背景效果
 */
function enableParticlesBackground() {
    // 確保粒子容器存在
    let particlesContainer = document.getElementById('particles-js');
    
    // 如果不存在，創建一個
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.id = 'particles-js';
        particlesContainer.style.position = 'fixed';
        particlesContainer.style.top = '0';
        particlesContainer.style.left = '0';
        particlesContainer.style.width = '100%';
        particlesContainer.style.height = '100%';
        particlesContainer.style.zIndex = '-1';
        document.body.prepend(particlesContainer);
        
        console.log("已創建粒子背景容器");
    }
    
    // 確保粒子容器可見
    particlesContainer.style.display = 'block';
    particlesContainer.style.visibility = 'visible';
    particlesContainer.style.opacity = '1';
    
    // 如果 particlesJS 函數存在，初始化粒子效果
    if (typeof particlesJS === 'function') {
        try {
            particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#00e5ff"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        }
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#00e5ff",
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 2,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 140,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "bubble": {
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            });
            console.log("已成功初始化粒子效果");
        } catch (error) {
            console.error("初始化粒子效果時出錯:", error);
        }
    } else {
        console.warn("粒子效果庫未載入，請確保已引入 particles.js");
    }
}

/**
 * 移除所有頁面的內部滾輪限制
 */
function removeScrollRestrictions() {
    // 找到所有可能有滾動限制的元素
    const scrollableElements = document.querySelectorAll(
        '.table-responsive, .overflow-auto, .overflow-y-auto, [style*="overflow-y: auto"], [style*="overflow: auto"]'
    );
    
    scrollableElements.forEach(el => {
        // 移除滾動限制
        el.style.overflow = 'visible';
        el.style.overflowY = 'visible';
        el.style.maxHeight = 'none';
        
        // 移除任何可能的滾動事件監聽器
        el.onscroll = null;
    });
    
    console.log(`已移除 ${scrollableElements.length} 個元素的滾動限制`);
}

/**
 * 確保綜合報告選項可見
 */
function enableReportOption() {
    // 找到綜合報告標籤
    const reportTab = document.getElementById('report-tab');
    
    if (reportTab) {
        // 確保可見且可用
        reportTab.disabled = false;
        reportTab.style.opacity = '1';
        reportTab.style.pointerEvents = 'auto';
        
        console.log("已啟用綜合報告選項");
    }
}
