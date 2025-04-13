/**
 * 外围框架修复脚本
 * 版本: 1.0.0 (2025-04-14)
 */

// 当文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log("外围框架修复程序启动...");
    
    // 添加主框架
    addMainFrame();
    
    // 修复第三页
    fixThirdPage();
});

/**
 * 添加页面外围主框架
 */
function addMainFrame() {
    // 检查是否已经存在主框架
    if (document.querySelector('.main-frame')) {
        return;
    }
    
    // 创建主框架
    const mainFrame = document.createElement('div');
    mainFrame.className = 'main-frame';
    document.body.appendChild(mainFrame);
    
    // 添加四个角落
    const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    corners.forEach(corner => {
        const frameCorner = document.createElement('div');
        frameCorner.className = `main-frame-corner ${corner}`;
        document.body.appendChild(frameCorner);
    });
    
    // 添加装饰线
    const lines = [
        {class: 'horizontal top', top: '10px', bottom: '', left: '0', right: ''},
        {class: 'horizontal bottom', top: '', bottom: '10px', left: '0', right: ''},
        {class: 'vertical left', top: '0', bottom: '', left: '10px', right: ''},
        {class: 'vertical right', top: '0', bottom: '', left: '', right: '10px'}
    ];
    
    lines.forEach(line => {
        const frameLine = document.createElement('div');
        frameLine.className = `main-frame-line ${line.class}`;
        if (line.top) frameLine.style.top = line.top;
        if (line.bottom) frameLine.style.bottom = line.bottom;
        if (line.left) frameLine.style.left = line.left;
        if (line.right) frameLine.style.right = line.right;
        document.body.appendChild(frameLine);
    });
    
    console.log("已添加外围主框架");
}

/**
 * 修复第三页问题
 */
function fixThirdPage() {
    // 查找第三页(report)标签页
    const reportTab = document.getElementById('report-tab');
    const reportPane = document.getElementById('report');
    
    if (reportTab && !reportPane) {
        // 如果有标签按钮但没有对应的内容区域，创建一个
        createReportPage();
    } else if (reportPane) {
        // 如果已存在，确保其可见并有正确的框架
        enhanceReportPage(reportPane);
    }
    
    // 确保第三页标签可点击
    if (reportTab) {
        reportTab.disabled = false;
        reportTab.style.opacity = '1';
        reportTab.style.pointerEvents = 'auto';
        
        // 添加点击事件
        reportTab.onclick = function() {
            // 如果不存在第三页内容，再次尝试创建
            if (!document.getElementById('report')) {
                createReportPage();
            }
        };
    }
}

/**
 * 创建第三页内容
 */
function createReportPage() {
    // 查找标签内容容器
    const tabContent = document.getElementById('analysisTabContent');
    if (!tabContent) {
        console.error("找不到标签内容容器");
        return;
    }
    
    // 创建第三页内容
    const reportPane = document.createElement('div');
    reportPane.id = 'report';
    reportPane.className = 'tab-pane fade animate__animated animate__fadeIn single-tab-content';
    reportPane.setAttribute('role', 'tabpanel');
    reportPane.setAttribute('aria-labelledby', 'report-tab');
    
    // 添加框架装饰
    const frames = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    frames.forEach(position => {
        const frame = document.createElement('div');
        frame.className = `tech-frame ${position}`;
        reportPane.appendChild(frame);
    });
    
    // 添加闪烁和雷电效果
    const shimmerEffect = document.createElement('div');
    shimmerEffect.className = 'shimmer-effect';
    reportPane.appendChild(shimmerEffect);
    
    const lightningEffect = document.createElement('div');
    lightningEffect.className = 'lightning-effect';
    reportPane.appendChild(lightningEffect);
    
    // 添加内容
    reportPane.innerHTML += `
        <div class="row mb-4 animate__animated animate__fadeInUp" style="animation-delay: 0.05s">
            <div class="col-12">
                <div class="tech-card tech-card-advanced">
                    <div class="card-header tech-card-header">
                        <i class="fas fa-file-contract me-2"></i> 綜合報告設置
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label tech-bright-text">報告類型</label>
                                <select class="form-select tech-select">
                                    <option selected>基本報告</option>
                                    <option>詳細分析報告</option>
                                    <option>客戶建議報告</option>
                                    <option>風險評估報告</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label tech-bright-text">輸出格式</label>
                                <select class="form-select tech-select">
                                    <option selected>PDF</option>
                                    <option>Word文檔</option>
                                    <option>Excel表格</option>
                                    <option>純文本</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <label class="form-label tech-bright-text">報告內容設置</label>
                            <div class="form-check tech-check mt-2">
                                <input class="form-check-input" type="checkbox" id="includeCharts" checked>
                                <label class="form-check-label" for="includeCharts">
                                    包含圖表分析
                                </label>
                            </div>
                            <div class="form-check tech-check">
                                <input class="form-check-input" type="checkbox" id="includeComparison" checked>
                                <label class="form-check-label" for="includeComparison">
                                    包含競品比較
                                </label>
                            </div>
                            <div class="form-check tech-check">
                                <input class="form-check-input" type="checkbox" id="includeRecommendations" checked>
                                <label class="form-check-label" for="includeRecommendations">
                                    包含建議方案
                                </label>
                            </div>
                            <div class="form-check tech-check">
                                <input class="form-check-input" type="checkbox" id="includeSummary" checked>
                                <label class="form-check-label" for="includeSummary">
                                    包含執行摘要
                                </label>
                            </div>
                        </div>
                        
                        <div class="mt-4 text-center">
                            <button class="btn btn-tech-primary btn-lg">
                                <i class="fas fa-file-export me-2"></i> 生成綜合報告
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 添加到标签内容容器
    tabContent.appendChild(reportPane);
    console.log("已创建第三页内容");
}

/**
 * 增强第三页显示
 */
function enhanceReportPage(reportPane) {
    // 确保第三页有正确的框架
    if (!reportPane.querySelector('.tech-frame.top-left')) {
        const frames = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        frames.forEach(position => {
            const frame = document.createElement('div');
            frame.className = `tech-frame ${position}`;
            reportPane.appendChild(frame);
        });
    }
    
    // 确保有闪烁和雷电效果
    if (!reportPane.querySelector('.shimmer-effect')) {
        const shimmerEffect = document.createElement('div');
        shimmerEffect.className = 'shimmer-effect';
        reportPane.appendChild(shimmerEffect);
    }
    
    if (!reportPane.querySelector('.lightning-effect')) {
        const lightningEffect = document.createElement('div');
        lightningEffect.className = 'lightning-effect';
        reportPane.appendChild(lightningEffect);
    }
    
    console.log("已增强第三页显示");
}
