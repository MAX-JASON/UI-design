/**
 * 增強粒子效果腳本
 * 讓粒子更加明顯，增強螢光效果
 */
document.addEventListener('DOMContentLoaded', function() {
    // 檢查是否存在particles.js
    if (typeof particlesJS !== 'undefined') {
        // 備份原始配置（如果有）
        let originalParticlesConfig = window.particlesConfig || null;
        
        // 增強的粒子配置
        const enhancedParticlesConfig = {
            "particles": {
                "number": {
                    "value": 80,            // 增加粒子數量
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#56ccf2"      // 明亮的藍色
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    }
                },
                "opacity": {
                    "value": 0.8,          // 提高不透明度
                    "random": false,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.4,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,             // 增大粒子尺寸
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.5,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#56ccf2",     // 明亮的藍色連線
                    "opacity": 0.6,         // 提高線條透明度
                    "width": 1.5            // 加粗線條
                },
                "move": {
                    "enable": true,
                    "speed": 3,             // 加快移動速度
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "bounce",  // 改為反彈模式，更加生動
                    "bounce": true,
                    "attract": {
                        "enable": true,
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
                        "mode": "grab"      // 懸停時連接粒子
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"      // 點擊時添加粒子
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 180,    // 增加吸引距離
                        "line_linked": {
                            "opacity": 0.8  // 增加懸停時的連線不透明度
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
        };
        
        // 應用增強的粒子配置
        const applyEnhancedParticles = function() {
            // 檢查是否存在粒子容器
            const particlesContainer = document.getElementById('particles-js');
            if (particlesContainer) {
                console.log("正在應用增強粒子效果...");
                
                // 清除可能的現有粒子
                if (window.pJSDom && window.pJSDom.length > 0) {
                    // 嘗試使用官方API清除粒子
                    try {
                        window.pJSDom.forEach(function(particle) {
                            particle.pJS.fn.vendors.destroypJS();
                        });
                        window.pJSDom = [];
                    } catch (e) {
                        console.error("清除現有粒子時出錯:", e);
                        
                        // 備選方案：直接刪除並重新創建容器
                        const newParticlesContainer = document.createElement('div');
                        newParticlesContainer.id = 'particles-js';
                        Object.assign(newParticlesContainer.style, particlesContainer.style);
                        particlesContainer.parentNode.replaceChild(newParticlesContainer, particlesContainer);
                    }
                }
                
                // 初始化新的粒子效果
                particlesJS('particles-js', enhancedParticlesConfig);
                
                // 保存增強的配置，以便將來參考
                window.particlesConfig = enhancedParticlesConfig;
                
                // 添加自定義CSS來增強發光效果
                if (!document.getElementById('enhanced-particles-style')) {
                    const style = document.createElement('style');
                    style.id = 'enhanced-particles-style';
                    style.textContent = `
                        #particles-js canvas {
                            filter: drop-shadow(0 0 8px rgba(86, 204, 242, 0.8));
                        }
                        .particle {
                            box-shadow: 0 0 15px 5px rgba(86, 204, 242, 0.8) !important;
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        };
        
        // 立即應用
        applyEnhancedParticles();
        
        // 在頁面加載完成後再次應用，以確保效果
        window.addEventListener('load', applyEnhancedParticles);
        
        // 每隔一段時間重新應用，確保效果不被其他腳本覆蓋
        setInterval(applyEnhancedParticles, 5000);
        
        // 添加到全局，以便可以手動調用
        window.applyEnhancedParticles = applyEnhancedParticles;
        
        // 監聽窗口大小變化，重新應用粒子效果
        window.addEventListener('resize', function() {
            setTimeout(applyEnhancedParticles, 500);
        });
    } else {
        console.warn("找不到particles.js，無法應用增強效果");
    }
});
