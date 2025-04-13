/**
 * 标签页内容修复脚本 - 确保第二、三页内容正常显示
 * 版本: 1.0.0 (2025-04-14)
 */

// 立即执行函数
(function() {
    console.log("标签页内容修复脚本启动...");
    
    // DOM加载完成后执行
    document.addEventListener('DOMContentLoaded', function() {
        fixTabContents();
    });
    
    // 页面完全加载后再次检查
    window.addEventListener('load', function() {
        setTimeout(fixTabContents, 200);
    });
    
    /**
     * 修复标签页内容显示问题
     */
    function fixTabContents() {
        console.log("正在修复标签页内容...");
        
        // 1. 确保标签按钮可用
        document.querySelectorAll('.nav-tabs .nav-link').forEach(function(tab) {
            tab.disabled = false;
            tab.style.pointerEvents = 'auto';
            tab.style.opacity = '1';
        });
        
        // 2. 确保第二页(比较表)有内容
        let comparisonTab = document.getElementById('comparison');
        if (comparisonTab && comparisonTab.childElementCount < 5) {
            createComparisonTabContent(comparisonTab);
        }
        
        // 3. 确保第三页(综合报告)有内容
        let reportTab = document.getElementById('report');
        if (reportTab && reportTab.childElementCount < 5) {
            createReportTabContent(reportTab);
        }
        
        // 4. 确保所有标签页可以通过点击切换
        setupTabClickHandler();
        
        console.log("标签页内容修复完成");
    }
    
    /**
     * 创建比较表页内容
     */
    function createComparisonTabContent(tabPane) {
        // 添加页面框架元素
        addFrameElements(tabPane);
        
        // 添加内容
        tabPane.innerHTML += `
            <div class="row mb-4">
                <div class="col-12">
                    <div class="tech-card tech-card-advanced">
                        <div class="card-header tech-card-header">
                            <i class="fas fa-table-columns me-2"></i> 保单比较表
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table tech-table">
                                    <thead>
                                        <tr>
                                            <th>保单名称</th>
                                            <th>年缴保费</th>
                                            <th>预定利率</th>
                                            <th>年配息金额</th>
                                            <th>期末解约金</th>
                                            <th>寿险额度</th>
                                            <th>医疗保障</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="own-policy-row">
                                            <td><i class="fas fa-star text-warning me-1"></i> 自家保单</td>
                                            <td>100,000</td>
                                            <td>2.5%</td>
                                            <td>3,500</td>
                                            <td>120,000</td>
                                            <td>2,000,000</td>
                                            <td><i class="fas fa-check text-success"></i></td>
                                        </tr>
                                        <tr>
                                            <td>竞品 A</td>
                                            <td>105,000</td>
                                            <td>2.3%</td>
                                            <td>3,200</td>
                                            <td>115,000</td>
                                            <td>1,800,000</td>
                                            <td><i class="fas fa-check text-success"></i></td>
                                        </tr>
                                        <tr>
                                            <td>竞品 B</td>
                                            <td>98,000</td>
                                            <td>2.2%</td>
                                            <td>3,000</td>
                                            <td>112,000</td>
                                            <td>1,900,000</td>
                                            <td><i class="fas fa-times text-danger"></i></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-12">
                    <div class="tech-card tech-card-advanced">
                        <div class="card-header tech-card-header">
                            <i class="fas fa-chart-line me-2"></i> 收益比较图表
                        </div>
                        <div class="card-body">
                            <div class="chart-container">
                                <canvas id="returnComparisonChart" width="800" height="400"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-12">
                    <div class="tech-card tech-card-advanced">
                        <div class="card-header tech-card-header">
                            <i class="fas fa-sliders-h me-2"></i> 比较选项
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <div class="form-check tech-check">
                                        <input class="form-check-input" type="checkbox" id="showIRR" checked>
                                        <label class="form-check-label" for="showIRR">
                                            显示内部收益率(IRR)
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-check tech-check">
                                        <input class="form-check-input" type="checkbox" id="showCashValue" checked>
                                        <label class="form-check-label" for="showCashValue">
                                            显示现金价值
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-check tech-check">
                                        <input class="form-check-input" type="checkbox" id="showDividend" checked>
                                        <label class="form-check-label" for="showDividend">
                                            显示配息
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * 创建综合报告页内容
     */
    function createReportTabContent(tabPane) {
        // 添加页面框架元素
        addFrameElements(tabPane);
        
        // 添加内容
        tabPane.innerHTML += `
            <div class="row mb-4">
                <div class="col-12">
                    <div class="tech-card tech-card-advanced">
                        <div class="card-header tech-card-header">
                            <i class="fas fa-file-contract me-2"></i> 综合报告设置
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">报告类型</label>
                                    <select class="form-select tech-select">
                                        <option selected>基本报告</option>
                                        <option>详细分析报告</option>
                                        <option>客户建议报告</option>
                                        <option>风险评估报告</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">输出格式</label>
                                    <select class="form-select tech-select">
                                        <option selected>PDF</option>
                                        <option>Word文档</option>
                                        <option>Excel表格</option>
                                        <option>纯文本</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="mt-4">
                                <label class="form-label">报告内容设置</label>
                                <div class="form-check tech-check mt-2">
                                    <input class="form-check-input" type="checkbox" id="includeCharts" checked>
                                    <label class="form-check-label" for="includeCharts">
                                        包含图表分析
                                    </label>
                                </div>
                                <div class="form-check tech-check">
                                    <input class="form-check-input" type="checkbox" id="includeComparison" checked>
                                    <label class="form-check-label" for="includeComparison">
                                        包含竞品比较
                                    </label>
                                </div>
                                <div class="form-check tech-check">
                                    <input class="form-check-input" type="checkbox" id="includeRecommendations" checked>
                                    <label class="form-check-label" for="includeRecommendations">
                                        包含建议方案
                                    </label>
                                </div>
                                <div class="form-check tech-check">
                                    <input class="form-check-input" type="checkbox" id="includeSummary" checked>
                                    <label class="form-check-label" for="includeSummary">
                                        包含执行摘要
                                    </label>
                                </div>
                            </div>
                            
                            <div class="mt-4 text-center">
                                <button class="btn btn-tech-primary btn-lg">
                                    <i class="fas fa-file-export me-2"></i> 生成综合报告
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-12">
                    <div class="tech-card tech-card-advanced">
                        <div class="card-header tech-card-header">
                            <i class="fas fa-chart-pie me-2"></i> 数据可视化
                        </div>
                        <div class="card-body">
                            <div class="chart-container">
                                <canvas id="summaryChart" width="800" height="400"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * 添加框架装饰元素
     */
    function addFrameElements(tabPane) {
        // 清除现有内容
        if (!tabPane.querySelector('.tech-frame.top-left')) {
            // 添加四个角落框架
            const frames = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
            
            frames.forEach(position => {
                const frame = document.createElement('div');
                frame.className = `tech-frame ${position}`;
                tabPane.appendChild(frame);
            });
            
            // 添加闪烁效果
            const shimmerEffect = document.createElement('div');
            shimmerEffect.className = 'shimmer-effect';
            tabPane.appendChild(shimmerEffect);
            
            // 添加雷电效果
            const lightningEffect = document.createElement('div');
            lightningEffect.className = 'lightning-effect';
            tabPane.appendChild(lightningEffect);
        }
    }
    
    /**
     * 设置标签点击处理
     */
    function setupTabClickHandler() {
        document.querySelectorAll('.nav-tabs .nav-link').forEach(function(tab) {
            tab.addEventListener('click', function(e) {
                const targetId = this.getAttribute('data-bs-target') || 
                                this.getAttribute('href');
                
                if (targetId) {
                    const targetPane = document.querySelector(targetId);
                    if (targetPane) {
                        // 重新触发一次内容创建
                        if (targetId === '#comparison' && targetPane.childElementCount < 5) {
                            createComparisonTabContent(targetPane);
                        } else if (targetId === '#report' && targetPane.childElementCount < 5) {
                            createReportTabContent(targetPane);
                        }
                    }
                }
            });
        });
    }
})();
