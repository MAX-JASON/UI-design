/**
 * 恢复背景3D动态效果
 * 版本: 1.0.0 (2025-04-14)
 */

// 立即执行函数
(function() {
    console.log("恢复背景3D动态效果脚本启动...");
    
    // 当DOM加载完成后初始化粒子效果
    document.addEventListener("DOMContentLoaded", function() {
        // 延迟一点初始化，确保DOM完全加载
        setTimeout(initParticles, 100);
    });
    
    // 页面完全加载后再次检查
    window.addEventListener("load", function() {
        // 确保粒子效果可见
        const particlesElement = document.getElementById("particles-js");
        if (particlesElement) {
            particlesElement.style.display = "block";
            particlesElement.style.visibility = "visible";
            particlesElement.style.opacity = "1";
            particlesElement.style.zIndex = "-1";
        }
        
        // 如果粒子库已加载但未初始化，尝试初始化
        if (typeof particlesJS === "function" && (!window.pJSDom || window.pJSDom.length === 0)) {
            initParticles();
        }
    });
    
    /**
     * 初始化粒子效果
     */
    function initParticles() {
        console.log("初始化粒子背景...");
        
        try {
            if (typeof particlesJS === "function") {
                // 设置粒子背景
                particlesJS("particles-js", {
                    "particles": {
                        "number": {
                            "value": 100,
                            "density": {
                                "enable": true,
                                "value_area": 700
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
                            "value": 0.7,
                            "random": false,
                            "anim": {
                                "enable": true,
                                "speed": 1,
                                "opacity_min": 0.3,
                                "sync": false
                            }
                        },
                        "size": {
                            "value": 4,
                            "random": true,
                            "anim": {
                                "enable": true,
                                "speed": 40,
                                "size_min": 0.1,
                                "sync": false
                            }
                        },
                        "line_linked": {
                            "enable": true,
                            "distance": 150,
                            "color": "#00e5ff",
                            "opacity": 0.7,
                            "width": 1.5
                        },
                        "move": {
                            "enable": true,
                            "speed": 3,
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
                
                console.log("粒子背景初始化成功");
            } else {
                console.warn("粒子库未加载，无法初始化粒子背景");
            }
        } catch (error) {
            console.error("初始化粒子背景时出错:", error);
        }
    }
    
    // 移除所有可能阻止粒子效果的样式
    function removeParticlesRestrictions() {
        const style = document.createElement('style');
        style.innerHTML = `
            #particles-js {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                z-index: -1 !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                pointer-events: auto !important;
            }
            
            .particles-js-canvas-el {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 立即移除限制
    removeParticlesRestrictions();
})();
