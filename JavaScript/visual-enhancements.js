/**
 * 台灣儲蓄險分析系統視覺增強腳本
 * 實現 : 
 * 1. 市場對比分析資料庫
 * 2. 多彩螢光效果
 * 3. 各種圖表資料展示
 * 4. 動態 3D 背景
 * 5. 綜合評分分析圖表
 */

document.addEventListener('DOMContentLoaded', function() {
    // 檢查當前日期
    updateCurrentDate();
    
    // 設置不同頁籤的螢光顏色
    setupGlowColors();
    
    // 初始化 3D 動態背景
    setup3DBackground();
    
    // 市場資料庫連結
    setupMarketDatabase();
    
    // 設置比較表內容
    setupComparisonTables();
    
    // 綁定按鈕事件
    bindButtonEvents();
});

// 更新當前日期
function updateCurrentDate() {
    const datetimeElement = document.getElementById('current-datetime');
    if (datetimeElement) {
        const now = new Date();
        const weekdays = [' 日 ', ' 一 ', ' 二 ', ' 三 ', ' 四 ', ' 五 ', ' 六 '];
        const formattedDate = `${now.getFullYear()} 年 ${String(now.getMonth() + 1).padStart(2, '0')} 月 ${String(now.getDate()).padStart(2, '0')} 日 週 ${weekdays[now.getDay()]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        datetimeElement.textContent = formattedDate;

        // 設置報告日期
        const reportDateElement = document.getElementById('reportDate');
        if (reportDateElement) {
            reportDateElement.textContent = `${now.getFullYear()} 年 ${String(now.getMonth() + 1).padStart(2, '0')} 月 ${String(now.getDate()).padStart(2, '0')} 日 `;
        }
    }
}

// 設置螢光顏色
function setupGlowColors() {
    // 報酬分析頁面 - 藍色螢光
    const irrTab = document.getElementById('irrAnalysis');
    if (irrTab) {
        irrTab.querySelectorAll('.panel').forEach(panel => {
            panel.classList.add('glow-border-blue');
        });
    }
    
    // 配息分析頁面 - 綠色螢光
    const dividendTab = document.getElementById('dividendAnalysis');
    if (dividendTab) {
        dividendTab.querySelectorAll('.panel').forEach(panel => {
            if (!panel.classList.contains('glow-border-green')) {
                panel.classList.add('glow-border-green');
            }
        });
    }
    
    // 醫療保障分析頁面 - 粉色螢光
    const medicalTab = document.getElementById('medicalAnalysis');
    if (medicalTab) {
        medicalTab.querySelectorAll('.panel, .tech-card').forEach(panel => {
            if (!panel.classList.contains('glow-border-pink')) {
                panel.classList.add('glow-border-pink');
            }
        });
    }
    
    // 綜合評分頁面 - 黃色與紫色螢光混合
    const comprehensiveTab = document.getElementById('comprehensiveAnalysis');
    if (comprehensiveTab) {
        const panels = comprehensiveTab.querySelectorAll('.panel');
        panels.forEach((panel, index) => {
            if (index % 2 === 0) {
                panel.classList.add('glow-border-yellow');
            } else {
                panel.classList.add('glow-border-purple');
            }
        });
    }
}

// 設置 3D 動態背景
function setup3DBackground() {
    // 檢查是否已經存在粒子背景
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) return;
    
    // 嘗試載入粒子效果
    if (window.particlesJS) {
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
                    "value": ["#00e5ff", "#00ff9d", "#ff52ab", "#9b59ff"]
                },
                "shape": {
                    "type": ["circle", "triangle", "polygon"],
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.6,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.3,
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
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
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
    } else {
        // 如果沒有 particlesJS，則動態載入它
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
        script.onload = () => {
            setup3DBackground(); // 重新調用此函數
        };
        document.head.appendChild(script);
    }
    
    // 添加 3D 效果
    document.body.classList.add('has-3d-background');
    
    // 滑鼠移動效果
    document.addEventListener('mousemove', function(e) {
        const depth = 10; // 深度效果
        const moveX = (e.clientX - window.innerWidth / 2) / depth;
        const moveY = (e.clientY - window.innerHeight / 2) / depth;
        
        document.querySelectorAll('.panel, .tech-card').forEach(panel => {
            panel.style.transform = `translate3d(${moveX * 0.5}px, ${moveY * 0.5}px, 0) rotateX(${moveY * 0.05}deg) rotateY(${-moveX * 0.05}deg)`;
        });
    });
}

// 市場資料庫連結
function setupMarketDatabase() {
    // 尋找市場比較選項
    const showMarketComparison = document.getElementById('showMarketComparison');
    const marketDataOptions = document.getElementById('marketDataOptions');
    
    // 如果沒有找到這些元素，先創建它們
    if (showMarketComparison && !marketDataOptions) {
        // 創建市場數據選項面板
        const marketOptionsHTML = `
            <div class="mt-3" id="marketDataOptions" style="display: none;">
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-database"></i></span>
                    <select class="form-select tech-select" id="marketDataSource">
                        <option value="latest"> 最新市場數據 (2025/03 更新 )</option>
                        <option value="2024">2024 年市場平均 </option>
                        <option value="2023">2023 年市場平均 </option>
                        <option value="premium"> 頂級保單數據庫 </option>
                        <option value="custom"> 自定義市場基準 </option>
                    </select>
                    <button class="btn btn-tech" id="loadMarketData"> 載入 </button>
                </div>
                <div class="market-data-info mt-2">
                    <small class="text-info">* 市場資料庫含 300+ 保單資料，提供更全面的市場比較 </small>
                </div>
            </div>
        `;
        
        // 找到父元素並插入
        const comparisonPanel = showMarketComparison.closest('.card-body');
        if (comparisonPanel) {
            comparisonPanel.insertAdjacentHTML('beforeend', marketOptionsHTML);
        }
        
        // 添加更新市場數據按鈕
        const header = showMarketComparison.closest('.tech-card').querySelector('.card-header');
        if (header) {
            const refreshButton = document.createElement('button');
            refreshButton.className = 'btn btn-sm btn-tech-sm float-end';
            refreshButton.id = 'refreshMarketData';
            refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> 更新市場數據 ';
            header.appendChild(refreshButton);
        }
        
        // 重新綁定事件
        bindButtonEvents();
    }
}

// 設置比較表內容
function setupComparisonTables() {
    // 報酬分析表
    populateIRRTable();
    
    // 配息分析表
    populateDividendTable();
    
    // 醫療保障表
    populateMedicalTable();
    
    // 綜合評分表
    populateComprehensiveTable();
    
    // 填充 20 年配息累積效益表
    populateCumulativeDividendTable();
    
    // 設置圖表數據
    setupCharts();
}

// 填充 IRR 表格
function populateIRRTable() {
    const irrTable = document.querySelector('#irrTable');
    if (!irrTable) return;
    
    // 清空表格
    irrTable.innerHTML = '';
    
    // 模擬數據
    const irrData = [
        { name: ' 自家保單 ', irr: '3.2%', rank: 1 },
        { name: ' 競品 A', irr: '2.8%', rank: 3 },
        { name: ' 競品 B', irr: '3.0%', rank: 2 },
        { name: ' 競品 C', irr: '2.5%', rank: 4 },
        { name: ' 市場平均 ', irr: '2.6%', rank: '-' }
    ];
    
    // 填充表格
    irrData.forEach(item => {
        const row = document.createElement('tr');
        if (item.name === ' 自家保單 ') {
            row.classList.add('best-performance');
        }
        if (item.name === ' 市場平均 ') {
            row.classList.add('market-average');
        }
        
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.irr}</td>
            <td>${item.rank}</td>
        `;
        
        irrTable.appendChild(row);
    });
    
    // 填充解約金差異比較表
    const surrenderTable = document.querySelector('#surrenderTable tbody');
    if (surrenderTable) {
        surrenderTable.innerHTML = '';
        
        const surrenderData = [
            { name: ' 自家保單 ', surrender: '315 萬 ', diff: '-', totalPremium: '240 萬 ', returnRate: '31.2%' },
            { name: ' 競品 A', surrender: '295 萬 ', diff: '-20 萬 ', totalPremium: '240 萬 ', returnRate: '22.9%' },
            { name: ' 競品 B', surrender: '305 萬 ', diff: '-10 萬 ', totalPremium: '240 萬 ', returnRate: '27.1%' },
            { name: ' 競品 C', surrender: '285 萬 ', diff: '-30 萬 ', totalPremium: '240 萬 ', returnRate: '18.7%' },
            { name: ' 市場平均 ', surrender: '290 萬 ', diff: '-25 萬 ', totalPremium: '240 萬 ', returnRate: '20.8%' }
        ];
        
        surrenderData.forEach(item => {
            const row = document.createElement('tr');
            if (item.name === ' 自家保單 ') {
                row.classList.add('best-performance');
            }
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.surrender}</td>
                <td>${item.diff}</td>
                <td>${item.totalPremium}</td>
                <td>${item.returnRate}</td>
            `;
            
            surrenderTable.appendChild(row);
        });
    }
    
    // 填充利率敏感度分析表
    const sensitivityTable = document.querySelector('#sensitivityTable tbody');
    if (sensitivityTable) {
        sensitivityTable.innerHTML = '';
        
        const sensitivityData = [
            { name: ' 自家保單 ', low: '2.9%', current: '3.2%', high: '3.5%', range: '0.6%' },
            { name: ' 競品 A', low: '2.3%', current: '2.8%', high: '3.3%', range: '1.0%' },
            { name: ' 競品 B', low: '2.7%', current: '3.0%', high: '3.3%', range: '0.6%' },
            { name: ' 競品 C', low: '2.1%', current: '2.5%', high: '2.9%', range: '0.8%' }
        ];
        
        sensitivityData.forEach(item => {
            const row = document.createElement('tr');
            if (item.name === ' 自家保單 ' || item.name === ' 競品 B') {
                row.classList.add('stable-performance');
            }
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.low}</td>
                <td>${item.current}</td>
                <td>${item.high}</td>
                <td>${item.range}</td>
            `;
            
            sensitivityTable.appendChild(row);
        });
    }
}

// 填充配息表格
function populateDividendTable() {
    const dividendTable = document.querySelector('#dividendTable');
    if (!dividendTable) return;
    
    // 清空表格
    dividendTable.innerHTML = '';
    
    // 模擬數據
    const dividendData = [
        { name: ' 自家保單 ', rate: '3.0%', amount: '1.5 萬 ', rank: 1 },
        { name: ' 競品 A', rate: '2.6%', amount: '1.3 萬 ', rank: 3 },
        { name: ' 競品 B', rate: '2.8%', amount: '1.4 萬 ', rank: 2 },
        { name: ' 競品 C', rate: '2.4%', amount: '1.2 萬 ', rank: 4 },
        { name: ' 市場平均 ', rate: '2.5%', amount: '1.25 萬 ', rank: '-' }
    ];
    
    // 填充表格
    dividendData.forEach(item => {
        const row = document.createElement('tr');
        if (item.name === ' 自家保單 ') {
            row.classList.add('best-performance');
        }
        if (item.name === ' 市場平均 ') {
            row.classList.add('market-average');
        }
        
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.rate}</td>
            <td>${item.amount}</td>
            <td>${item.rank}</td>
        `;
        
        dividendTable.appendChild(row);
    });
}

// 填充醫療保障表格
function populateMedicalTable() {
    const medicalTable = document.querySelector('#medicalTable tbody');
    if (!medicalTable) return;
    
    // 清空表格
    medicalTable.innerHTML = '';
    
    // 模擬數據
    const medicalData = [
        { name: ' 自家保單 ', hasMedical: ' 是 ', coverage: ' 重大疾病、住院、手術 ', score: '9.3' },
        { name: ' 競品 A', hasMedical: ' 是 ', coverage: ' 住院、手術 ', score: '7.5' },
        { name: ' 競品 B', hasMedical: ' 是 ', coverage: ' 重大疾病、住院 ', score: '8.2' },
        { name: ' 競品 C', hasMedical: ' 否 ', coverage: ' 無 ', score: '0.0' }
    ];
    
    // 填充表格
    medicalData.forEach(item => {
        const row = document.createElement('tr');
        if (item.name === ' 自家保單 ') {
            row.classList.add('best-performance');
        }
        if (item.hasMedical === ' 否 ') {
            row.classList.add('no-feature');
        }
        
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.hasMedical}</td>
            <td>${item.coverage}</td>
            <td>${item.score}</td>
        `;
        
        medicalTable.appendChild(row);
    });
    
    // 醫療詳細評估
    const medicalDetailContent = document.getElementById('medicalDetailContent');
    if (medicalDetailContent) {
        medicalDetailContent.innerHTML = `
            <div class="medical-comparison-summary">
                <p><i class="fas fa-check-circle text-success me-2"></i> <strong> 自家保單 </strong> 提供最全面的醫療保障，包括重大疾病、住院和手術三項主要保障。</p>
                <p><i class="fas fa-info-circle text-info me-2"></i> <strong> 競品 B</strong> 缺少手術醫療保障，整體評分較低。</p>
                <p><i class="fas fa-exclamation-triangle text-warning me-2"></i> <strong> 競品 A</strong> 缺少重大疾病保障，風險承擔較高。</p>
                <p><i class="fas fa-times-circle text-danger me-2"></i> <strong> 競品 C</strong> 不包含醫療險功能。</p>
            </div>
        `;
        
        // 顯示醫療圖表容器
        document.getElementById('medicalChartContainer').style.display = 'block';
    }
    
    // 填充醫療詳細表格
    const medicalDetailTable = document.querySelector('#medicalDetailTable tbody');
    if (medicalDetailTable) {
        medicalDetailTable.innerHTML = '';
        
        const medicalDetailData = [
            { name: ' 自家保單 ', criticalIllness: '100 萬 ', hospitalization: '5,000/ 日 ', surgery: '15 萬 ', premium: '3 萬 ', coverage: '100 萬 ' },
            { name: ' 競品 A', criticalIllness: ' 無 ', hospitalization: '3,000/ 日 ', surgery: '10 萬 ', premium: '2 萬 ', coverage: '50 萬 ' },
            { name: ' 競品 B', criticalIllness: '80 萬 ', hospitalization: '4,000/ 日 ', surgery: ' 無 ', premium: '2.5 萬 ', coverage: '80 萬 ' },
            { name: ' 競品 C', criticalIllness: ' 無 ', hospitalization: ' 無 ', surgery: ' 無 ', premium: '0', coverage: ' 無 ' }
        ];
        
        medicalDetailData.forEach(item => {
            const row = document.createElement('tr');
            if (item.name === ' 自家保單 ') {
                row.classList.add('best-performance');
            }
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.criticalIllness}</td>
                <td>${item.hospitalization}</td>
                <td>${item.surgery}</td>
                <td>${item.premium}</td>
                <td>${item.coverage}</td>
            `;
            
            medicalDetailTable.appendChild(row);
        });
    }
    
    // 醫療效益分析
    const medicalEfficiencyAlert = document.getElementById('medicalEfficiencyAlert');
    if (medicalEfficiencyAlert) {
        medicalEfficiencyAlert.innerHTML = `
            <h5><i class="fas fa-heartbeat me-2"></i> 醫療保障效益分析 </h5>
            <p> 根據比較，<strong> 自家保單 </strong> 醫療保障最為全面，保障額度最高，適合需要完整醫療保障的客戶。雖然年保費較高，但保障 / 保費比值 (33.3) 仍優於競品 A (25.0) 和競品 B (32.0)。</p>
        `;
    }
}

// 填充綜合評分表格
function populateComprehensiveTable() {
    // 詳細比較數據
    const reportDetailTable = document.querySelector('#reportDetailTable tbody');
    if (reportDetailTable) {
        reportDetailTable.innerHTML = '';
        
        const reportData = [
            { name: ' 自家保單 ', premium: '12 萬 ', rate: '2.1%', dividend: '1.5 萬 ', surrender: '315 萬 ', irr: '3.2%', medicalScore: '9.3', totalScore: '9.5' },
            { name: ' 競品 A', premium: '12 萬 ', rate: '1.8%', dividend: '1.3 萬 ', surrender: '295 萬 ', irr: '2.8%', medicalScore: '7.5', totalScore: '8.2' },
            { name: ' 競品 B', premium: '12 萬 ', rate: '2.0%', dividend: '1.4 萬 ', surrender: '305 萬 ', irr: '3.0%', medicalScore: '8.2', totalScore: '8.8' },
            { name: ' 競品 C', premium: '12 萬 ', rate: '1.6%', dividend: '1.2 萬 ', surrender: '285 萬 ', irr: '2.5%', medicalScore: '0.0', totalScore: '6.5' }
        ];
        
        reportData.forEach(item => {
            const row = document.createElement('tr');
            if (item.name === ' 自家保單 ') {
                row.classList.add('best-performance');
            }
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.premium}</td>
                <td>${item.rate}</td>
                <td>${item.dividend}</td>
                <td>${item.surrender}</td>
                <td>${item.irr}</td>
                <td>${item.medicalScore}</td>
                <td>${item.totalScore}</td>
            `;
            
            reportDetailTable.appendChild(row);
        });
    }
}

// 填充 20 年配息累積效益表
function populateCumulativeDividendTable() {
    const cumulativeDividendTable = document.querySelector('#cumulativeDividendTable tbody');
    if (!cumulativeDividendTable) return;
    
    // 清空表格
    cumulativeDividendTable.innerHTML = '';
    
    // 模擬數據
    const cumulativeData = [
        { name: ' 自家保單 ', total: '30 萬 ', interest: '6.8 萬 ', totalReturn: '36.8 萬 ', growthRate: '22.7%' },
        { name: ' 競品 A', total: '26 萬 ', interest: '5.4 萬 ', totalReturn: '31.4 萬 ', growthRate: '20.8%' },
        { name: ' 競品 B', total: '28 萬 ', interest: '6.2 萬 ', totalReturn: '34.2 萬 ', growthRate: '22.1%' },
        { name: ' 競品 C', total: '24 萬 ', interest: '4.8 萬 ', totalReturn: '28.8 萬 ', growthRate: '20.0%' }
    ];
    
    // 填充表格
    cumulativeData.forEach(item => {
        const row = document.createElement('tr');
        if (item.name === ' 自家保單 ') {
            row.classList.add('best-performance');
        }
        
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.total}</td>
            <td>${item.interest}</td>
            <td>${item.totalReturn}</td>
            <td>${item.growthRate}</td>
        `;
        
        cumulativeDividendTable.appendChild(row);
    });
}

// 設置圖表數據
function setupCharts() {
    // 載入 Chart.js
    if (!window.Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = initCharts;
        document.head.appendChild(script);
    } else {
        initCharts();
    }
}

// 初始化所有圖表
function initCharts() {
    // IRR 圖表
    setupIRRChart();
    
    // 配息圖表
    setupDividendChart();
    
    // 累積配息圖表
    setupCumulativeDividendChart();
    
    // 醫療評分圖表
    setupMedicalChart();
    
    // 綜合評分圖表
    setupComprehensiveChart();
}

// 設置 IRR 圖表
function setupIRRChart() {
    const irrChartCanvas = document.getElementById('irrChart');
    if (!irrChartCanvas) return;
    
    // 銷毀現有圖表
    if (window.irrChartInstance) {
        window.irrChartInstance.destroy();
    }
    
    const labels = [' 自家保單 ', ' 競品 A', ' 競品 B', ' 競品 C', ' 市場平均 '];
    const data = [3.2, 2.8, 3.0, 2.5, 2.6];
    const backgroundColors = [
        'rgba(0, 229, 255, 0.7)', // 自家保單
        'rgba(255, 82, 171, 0.7)', // 競品 A
        'rgba(155, 89, 255, 0.7)', // 競品 B
        'rgba(255, 214, 0, 0.7)', // 競品 C
        'rgba(100, 100, 100, 0.5)' // 市場平均
    ];
    
    window.irrChartInstance = new Chart(irrChartCanvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: ' 年化報酬率 (%)',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                borderWidth: 2,
                borderRadius: 5,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 16
                    },
                    bodyFont: {
                        size: 14
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 2.0,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(224, 247, 255, 0.8)',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(224, 247, 255, 0.8)',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// 設置配息圖表
function setupDividendChart() {
    const dividendChartCanvas = document.getElementById('dividendChart');
    if (!dividendChartCanvas) return;
    
    // 銷毀現有圖表
    if (window.dividendChartInstance) {
        window.dividendChartInstance.destroy();
    }
    
    const labels = [' 自家保單 ', ' 競品 A', ' 競品 B', ' 競品 C', ' 市場平均 '];
    const rateData = [3.0, 2.6, 2.8, 2.4, 2.5];
    const amountData = [1.5, 1.3, 1.4, 1.2, 1.25];
    
    window.dividendChartInstance = new Chart(dividendChartCanvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: ' 配息率 (%)',
                    data: rateData,
                    backgroundColor: 'rgba(0, 255, 157, 0.7)',
                    borderColor: 'rgba(0, 255, 157, 1)',
                    borderWidth: 2,
                    borderRadius: 5,
                    borderSkipped: false,
                    yAxisID: 'y'
                },
                {
                    label: ' 年配息金額 ( 萬 )',
                    data: amountData,
                    backgroundColor: 'rgba(0, 229, 255, 0.7)',
                    borderColor: 'rgba(0, 229, 255, 1)',
                    borderWidth: 2,
                    borderRadius: 5,
                    borderSkipped: false,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'rgba(224, 247, 255, 0.8)',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 16
                    },
                    bodyFont: {
                        size: 14
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    beginAtZero: false,
                    min: 2.0,
                    grid: {
                        color: 'rgba(0, 255, 157, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(0, 255, 157, 0.8)',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: ' 配息率 ',
                        color: 'rgba(0, 255, 157, 0.8)',
                        font: {
                            size: 14
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    beginAtZero: false,
                    min: 1.0,
                    max: 2.0,
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        color: 'rgba(0, 229, 255, 0.8)',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value + ' 萬 ';
                        }
                    },
                    title: {
                        display: true,
                        text: ' 年配息金額 ',
                        color: 'rgba(0, 229, 255, 0.8)',
                        font: {
                            size: 14
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(224, 247, 255, 0.8)',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// 設置累積配息圖表
function setupCumulativeDividendChart() {
    const cumulativeChartCanvas = document.getElementById('cumulativeDividendChart');
    if (!cumulativeChartCanvas) return;
    
    // 銷毀現有圖表
    if (window.cumulativeDividendChartInstance) {
        window.cumulativeDividendChartInstance.destroy();
    }
    
    const labels = Array.from({length: 21}, (_, i) => i); // 0-20 年
    
    // 各保單累積數據
    const ownPolicyData = Array.from({length: 21}, (_, i) => i === 0 ? 0 : i * 1.5 + (i * (i-1) / 2) * 0.025);
    const compAPolicyData = Array.from({length: 21}, (_, i) => i === 0 ? 0 : i * 1.3 + (i * (i-1) / 2) * 0.023);
    const compBPolicyData = Array.from({length: 21}, (_, i) => i === 0 ? 0 : i * 1.4 + (i * (i-1) / 2) * 0.024);
    const compCPolicyData = Array.from({length: 21}, (_, i) => i === 0 ? 0 : i * 1.2 + (i * (i-1) / 2) * 0.022);
    
    window.cumulativeDividendChartInstance = new Chart(cumulativeChartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: ' 自家保單 ',
                    data: ownPolicyData,
                    borderColor: 'rgba(0, 255, 157, 1)',
                    backgroundColor: 'rgba(0, 255, 157, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: ' 競品 A',
                    data: compAPolicyData,
                    borderColor: 'rgba(255, 82, 171, 1)',
                    backgroundColor: 'rgba(255, 82, 171, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: ' 競品 B',
                    data: compBPolicyData,
                    borderColor: 'rgba(155, 89, 255, 1)',
                    backgroundColor: 'rgba(155, 89, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: ' 競品 C',
                    data: compCPolicyData,
                    borderColor: 'rgba(255, 214, 0, 1)',
                    backgroundColor: 'rgba(255, 214, 0, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'rgba(224, 247, 255, 0.8)',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 16
                    },
                    bodyFont: {
                        size: 14
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + ' 萬 ';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(224, 247, 255, 0.8)',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value + ' 萬 ';
                        }
                    },
                    title: {
                        display: true,
                        text: ' 累積金額 ( 萬 )',
                        color: 'rgba(224, 247, 255, 0.8)',
                        font: {
                            size: 14
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(224, 247, 255, 0.8)',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value + ' 年 ';
                        }
                    },
                    title: {
                        display: true,
                        text: ' 年數 ',
                        color: 'rgba(224, 247, 255, 0.8)',
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}

// 設置醫療評分圖表
function setupMedicalChart() {
    const medicalChartCanvas = document.getElementById('medicalChart');
    if (!medicalChartCanvas) return;
    
    // 銷毀現有圖表
    if (window.medicalChartInstance) {
        window.medicalChartInstance.destroy();
    }
    
    const labels = [' 自家保單 ', ' 競品 A', ' 競品 B', ' 競品 C'];
    const data = [9.3, 7.5, 8.2, 0.0];
    const backgroundColors = [
        'rgba(255, 82, 171, 0.7)', // 自家保單
        'rgba(0, 229, 255, 0.7)', // 競品 A
        'rgba(155, 89, 255, 0.7)', // 競品 B
        'rgba(255, 214, 0, 0.7)' // 競品 C
    ];
    
    window.medicalChartInstance = new Chart(medicalChartCanvas, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                label: ' 醫療保障評分 ',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: 'rgba(224, 247, 255, 0.8)',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    bodyFont: {
                        size: 14
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.r + ' / 10';
                        }
                    }
                }
            }
        }
    });
}

// 設置綜合評分圖表
function setupComprehensiveChart() {
    const comprehensiveChartCanvas = document.getElementById('reportComparisonChart');
    if (!comprehensiveChartCanvas) return;
    
    // 銷毀現有圖表
    if (window.comprehensiveChartInstance) {
        window.comprehensiveChartInstance.destroy();
    }
    
    window.comprehensiveChartInstance = new Chart(comprehensiveChartCanvas, {
        type: 'radar',
        data: {
            labels: [' 報酬率 ', ' 配息表現 ', ' 醫療保障 ', ' 壽險保障 ', ' 綜合靈活性 '],
            datasets: [
                {
                    label: ' 自家保單 ',
                    data: [9.5, 9.2, 9.3, 8.8, 9.0],
                    backgroundColor: 'rgba(0, 229, 255, 0.2)',
                    borderColor: 'rgba(0, 229, 255, 1)',
                    borderWidth: 3,
                    pointBackgroundColor: 'rgba(0, 229, 255, 1)',
                    pointHoverRadius: 6
                },
                {
                    label: ' 競品 A',
                    data: [8.2, 7.8, 7.5, 8.0, 7.5],
                    backgroundColor: 'rgba(255, 82, 171, 0.2)',
                    borderColor: 'rgba(255, 82, 171, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 82, 171, 1)',
                    pointHoverRadius: 6
                },
                {
                    label: ' 競品 B',
                    data: [8.8, 8.5, 8.2, 8.5, 8.2],
                    backgroundColor: 'rgba(155, 89, 255, 0.2)',
                    borderColor: 'rgba(155, 89, 255, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(155, 89, 255, 1)',
                    pointHoverRadius: 6
                },
                {
                    label: ' 競品 C',
                    data: [7.0, 6.5, 0.0, 7.0, 6.0],
                    backgroundColor: 'rgba(255, 214, 0, 0.2)',
                    borderColor: 'rgba(255, 214, 0, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 214, 0, 1)',
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'rgba(224, 247, 255, 0.8)',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    bodyFont: {
                        size: 14
                    }
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 10,
                    beginAtZero: true,
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    pointLabels: {
                        color: 'rgba(224, 247, 255, 0.8)',
                        font: {
                            size: 12
                        }
                    },
                    ticks: {
                        color: 'rgba(224, 247, 255, 0.8)',
                        backdropColor: 'transparent',
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

// 綁定各種按鈕事件
function bindButtonEvents() {
    // 市場資料選項切換
    const showMarketComparison = document.getElementById('showMarketComparison');
    const marketDataOptions = document.getElementById('marketDataOptions');
    
    if (showMarketComparison && marketDataOptions) {
        showMarketComparison.addEventListener('change', function() {
            marketDataOptions.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    // 更新市場數據按鈕
    const refreshMarketData = document.getElementById('refreshMarketData');
    if (refreshMarketData) {
        refreshMarketData.addEventListener('click', function() {
            // 模擬數據加載
            refreshMarketData.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> 更新中 ...';
            
            setTimeout(() => {
                refreshMarketData.innerHTML = '<i class="fas fa-sync-alt"></i> 更新市場數據 ';
                
                // 顯示提示
                alert(' 市場數據已更新至 2025 年 4 月最新資料 !');
                
                // 更新表格數據
                setupComparisonTables();
            }, 1500);
        });
    }
    
    // 載入市場數據按鈕
    const loadMarketData = document.getElementById('loadMarketData');
    if (loadMarketData) {
        loadMarketData.addEventListener('click', function() {
            // 模擬數據加載
            loadMarketData.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            loadMarketData.disabled = true;
            
            setTimeout(() => {
                loadMarketData.innerHTML = ' 載入 ';
                loadMarketData.disabled = false;
                
                // 顯示提示
                const marketDataSource = document.getElementById('marketDataSource');
                const sourceText = marketDataSource ? marketDataSource.options[marketDataSource.selectedIndex].text : ' 市場數據 ';
                
                alert(`${sourceText} 已成功載入 !`);
                
                // 更新表格數據
                setupComparisonTables();
            }, 1500);
        });
    }
    
    // 計算分析按鈕
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            // 啟用下一個頁籤
            const comparisonTab = document.getElementById('comparison-tab');
            if (comparisonTab) {
                comparisonTab.removeAttribute('disabled');
                
                // 切換到比較表頁籤
                setTimeout(() => {
                    comparisonTab.click();
                    
                    // 初始化所有圖表
                    setTimeout(() => {
                        setupCharts();
                        
                        // 啟用報告頁籤
                        const reportTab = document.getElementById('report-tab');
                        if (reportTab) {
                            reportTab.removeAttribute('disabled');
                        }
                    }, 500);
                }, 200);
            }
        });
    }
    
    // 回到比較表的按鈕
    const backToComparison = document.getElementById('backToComparison');
    if (backToComparison) {
        backToComparison.addEventListener('click', function() {
            const comparisonTab = document.getElementById('comparison-tab');
            if (comparisonTab) {
                comparisonTab.click();
            }
        });
    }
    
    // 列印報告按鈕
    const printReportBtn = document.getElementById('printReportBtn');
    if (printReportBtn) {
        printReportBtn.addEventListener('click', function() {
            window.print();
        });
    }
}

// 為 CSS 添加 3D 背景樣式
function addStylesheet() {
    const style = document.createElement('style');
    style.textContent = `
        /* 3D 背景和效果 */
        .has-3d-background {
            perspective: 1000px;
        }
        
        /* 面板 3D 效果 */
        .panel {
            transition: transform 0.3s ease;
            transform-style: preserve-3d;
        }
        
        /* 不同螢光顏色框架 */
        .glow-border-blue {
            box-shadow: 0 0 15px var(--glow-blue), inset 0 0 5px var(--glow-blue-bg-light);
            border: 1px solid var(--glow-blue);
        }
        
        .glow-border-green {
            box-shadow: 0 0 15px var(--glow-green), inset 0 0 5px var(--glow-green-bg-light);
            border: 1px solid var(--glow-green);
        }
        
        .glow-border-yellow {
            box-shadow: 0 0 15px var(--glow-yellow), inset 0 0 5px var(--glow-yellow-bg-light);
            border: 1px solid var(--glow-yellow);
        }
        
        .glow-border-pink {
            box-shadow: 0 0 15px var(--glow-pink), inset 0 0 5px var(--glow-pink-bg-light);
            border: 1px solid var(--glow-pink);
        }
        
        .glow-border-purple {
            box-shadow: 0 0 15px var(--glow-purple), inset 0 0 5px var(--glow-purple-bg-light);
            border: 1px solid var(--glow-purple);
        }
        
        /* 表格最佳表現行樣式增強 */
        .tech-table tr.best-performance td {
            background: linear-gradient(to right, rgba(0, 229, 255, 0.15), rgba(0, 255, 157, 0.15));
            box-shadow: inset 0 0 10px rgba(0, 229, 255, 0.15);
            position: relative;
            z-index: 1;
        }
        
        .tech-table tr.best-performance::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 2px;
            background: linear-gradient(to right, var(--accent-blue), var(--accent-green));
        }
        
        /* 表格穩定表現行樣式 */
        .tech-table tr.stable-performance td {
            background: linear-gradient(to right, rgba(155, 89, 255, 0.1), rgba(0, 229, 255, 0.1));
        }
        
        /* 市場平均行樣式 */
        .tech-table tr.market-average td {
            background-color: rgba(100, 100, 100, 0.2);
            font-style: italic;
        }
        
        /* 圖表數據點效果 */
        .data-point {
            position: absolute;
            width: 12px;
            height: 12px;
            background-color: var(--accent-blue);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--accent-blue-glow);
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
}

// 初始化
addStylesheet();
