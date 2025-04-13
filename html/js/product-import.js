/**
 * 产品导入模块 - 产品数据导入与管理功能
 * 版本: 1.0.0 (2025-04-14)
 */

// 全局產品數據儲存
if (typeof window.productDatabase === 'undefined') {
    window.productDatabase = {
        products: [],
        selectedProducts: []
    };
}

// 当文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('產品導入模組初始化...');
    
    // 確保產品導入標籤頁可以被點擊
    setupTabClickHandlers();
    
    // 初始化導入方式切換
    initImportMethodToggle();
    
    // 初始化文件上傳功能
    initFileUpload();
    
    // 初始化API獲取功能
    initApiImport();
    
    // 初始化產品篩選功能
    initProductFilters();
    
    // 初始化範本下載連結
    initTemplateLink();
    
    // 初始化比較功能
    initCompareFeature();
    
    // 創建示例產品數據（測試用）
    createSampleProducts();
    
    // 在頁面加載後立即顯示通知以提示用戶功能已經可用
    setTimeout(function() {
        showNotification('產品導入功能已啟用，您可以點擊「產品導入」標籤使用此功能', 'info', 5000);
    }, 1000);
});

/**
 * 设置标签页点击处理程序，确保产品导入标签可以正常响应
 */
function setupTabClickHandlers() {
    // 获取产品导入标签
    const productsTab = document.getElementById('products-tab');
    const comparisonTab = document.getElementById('comparison-tab');
    const reportTab = document.getElementById('report-tab');
    
    if (productsTab) {
        // 添加额外的点击处理程序，确保即使 Bootstrap 标签切换失效也可以工作
        productsTab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 手动切换标签
            const tabPanes = document.querySelectorAll('.tab-pane');
            tabPanes.forEach(pane => {
                pane.classList.remove('show');
                pane.classList.remove('active');
            });
            
            const productsPane = document.getElementById('products');
            if (productsPane) {
                productsPane.classList.add('show');
                productsPane.classList.add('active');
            }
            
            // 切换标签样式
            document.querySelectorAll('.nav-tabs .nav-link').forEach(link => {
                link.classList.remove('active');
            });
            productsTab.classList.add('active');
            
            // 刷新产品数据显示
            if (window.productDatabase && window.productDatabase.products) {
                updateProductTable();
                updateSelectedProductsDisplay();
            }
        });
    }
    
    // 启用对比表和报告标签
    if (comparisonTab) {
        comparisonTab.removeAttribute('disabled');
    }
    
    if (reportTab) {
        reportTab.removeAttribute('disabled');
    }
}

/**
 * 初始化導入方式切換
 */
function initImportMethodToggle() {
    const fileImport = document.getElementById('fileImport');
    const apiImport = document.getElementById('apiImport');
    const fileImportSection = document.getElementById('fileImportSection');
    const apiImportSection = document.getElementById('apiImportSection');
    
    if (fileImport && apiImport) {
        fileImport.addEventListener('change', function() {
            if (this.checked) {
                fileImportSection.style.display = 'block';
                apiImportSection.style.display = 'none';
            }
        });
        
        apiImport.addEventListener('change', function() {
            if (this.checked) {
                fileImportSection.style.display = 'none';
                apiImportSection.style.display = 'block';
            }
        });
    }
}

/**
 * 初始化文件上傳功能
 */
function initFileUpload() {
    const uploadButton = document.getElementById('uploadButton');
    const productFile = document.getElementById('productFile');
    const fileType = document.getElementById('fileType');
    
    if (uploadButton && productFile) {
        uploadButton.addEventListener('click', function() {
            if (!productFile.files || productFile.files.length === 0) {
                showNotification('請選擇要上傳的文件', 'warning');
                return;
            }
            
            const file = productFile.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const fileContent = e.target.result;
                try {
                    let products = [];
                    const selectedType = fileType.value;
                    
                    if (selectedType === 'json') {
                        products = JSON.parse(fileContent);
                    } else if (selectedType === 'csv') {
                        products = parseCSV(fileContent);
                    } else if (selectedType === 'excel') {
                        showNotification('Excel 解析需要額外庫支持，請使用 CSV 或 JSON 格式', 'info');
                        return;
                    }
                    
                    // 添加到產品數據庫
                    addProductsToDatabase(products);
                    
                    // 更新預覽
                    updateDataPreview(products);
                    
                    // 顯示成功通知
                    showNotification(`成功導入 ${products.length} 個產品`, 'success');
                } catch (error) {
                    console.error('解析文件時出錯:', error);
                    showNotification('文件格式不正確或解析失敗', 'error');
                }
            };
            
            if (fileType.value === 'json' || fileType.value === 'csv') {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    }
}

/**
 * 解析 CSV 文件内容
 */
function parseCSV(csvContent) {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const products = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',');
        const product = {};
        
        headers.forEach((header, index) => {
            let value = values[index] ? values[index].trim() : '';
            
            // 將數字字符串轉換為數字
            if (!isNaN(value) && value !== '') {
                value = parseFloat(value);
            }
            
            product[header] = value;
        });
        
        products.push(product);
    }
    
    return products;
}

/**
 * 初始化API獲取功能
 */
function initApiImport() {
    const fetchApiButton = document.getElementById('fetchApiButton');
    const apiEndpoint = document.getElementById('apiEndpoint');
    const apiKey = document.getElementById('apiKey');
    
    if (fetchApiButton && apiEndpoint) {
        fetchApiButton.addEventListener('click', function() {
            const endpoint = apiEndpoint.value.trim();
            if (!endpoint) {
                showNotification('請輸入有效的 API 端點', 'warning');
                return;
            }
            
            // 模擬API請求
            showNotification('正在獲取數據...', 'info');
            
            // 這裡實際應用中應該使用fetch或axios進行API請求
            // 為了演示，我們使用setTimeout模擬API請求
            setTimeout(() => {
                const sampleProducts = [
                    {
                        productName: 'API示例儲蓄險A',
                        productType: 'savings',
                        currency: 'TWD',
                        interestRate: 2.5,
                        annualDividend: 15000,
                        surrenderValue: 500000,
                        insuranceAmount: 1000000,
                        medicalCoverage: 0
                    },
                    {
                        productName: 'API示例投資型B',
                        productType: 'investment',
                        currency: 'USD',
                        interestRate: 3.8,
                        annualDividend: 1200,
                        surrenderValue: 40000,
                        insuranceAmount: 100000,
                        medicalCoverage: 5000
                    }
                ];
                
                // 添加到產品數據庫
                addProductsToDatabase(sampleProducts);
                
                // 更新預覽
                updateDataPreview(sampleProducts);
                
                showNotification('成功從API獲取數據', 'success');
            }, 1500);
        });
    }
}

/**
 * 添加產品到數據庫
 */
function addProductsToDatabase(products) {
    // 如果數據庫為空，直接賦值
    if (!window.productDatabase) {
        window.productDatabase = {
            products: products,
            selectedProducts: []
        };
    } else {
        // 合併產品數據，避免重複（以產品名稱作為唯一標識）
        const existingProductNames = window.productDatabase.products.map(p => p.productName);
        const newProducts = products.filter(p => !existingProductNames.includes(p.productName));
        
        window.productDatabase.products = [
            ...window.productDatabase.products,
            ...newProducts
        ];
    }
    
    // 更新產品表格
    updateProductTable();
}

/**
 * 更新數據預覽
 */
function updateDataPreview(products) {
    const dataPreview = document.getElementById('dataPreview');
    if (!dataPreview || products.length === 0) return;
    
    // 取前2個產品作為預覽
    const previewProducts = products.slice(0, 2);
    
    let tableHTML = '<table class="table table-sm table-dark table-striped">';
    
    // 表頭
    tableHTML += '<thead><tr>';
    const headers = Object.keys(previewProducts[0]);
    headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr></thead>';
    
    // 表格內容
    tableHTML += '<tbody>';
    previewProducts.forEach(product => {
        tableHTML += '<tr>';
        headers.forEach(header => {
            tableHTML += `<td>${product[header]}</td>`;
        });
        tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';
    
    if (products.length > 2) {
        tableHTML += `<div class="text-end text-secondary mt-2">顯示 2/${products.length} 條數據</div>`;
    }
    
    dataPreview.innerHTML = tableHTML;
}

/**
 * 更新產品表格
 */
function updateProductTable() {
    const productTableBody = document.getElementById('productTableBody');
    if (!productTableBody || !window.productDatabase || !window.productDatabase.products) return;
    
    const products = window.productDatabase.products;
    
    if (products.length === 0) {
        productTableBody.innerHTML = '<tr class="text-center"><td colspan="7">尚無產品數據，請通過上方功能導入產品資料</td></tr>';
        return;
    }
    
    // 應用過濾器
    const filteredProducts = applyProductFilters(products);
    
    if (filteredProducts.length === 0) {
        productTableBody.innerHTML = '<tr class="text-center"><td colspan="7">沒有符合篩選條件的產品</td></tr>';
        return;
    }
    
    let tableHTML = '';
    
    filteredProducts.forEach((product, index) => {
        // 檢查產品是否已被選中
        const isSelected = window.productDatabase.selectedProducts.some(p => p.productName === product.productName);
        
        tableHTML += `<tr>
            <td>
                <div class="form-check">
                    <input class="form-check-input product-select" type="checkbox" value="${product.productName}" 
                        ${isSelected ? 'checked' : ''} data-index="${index}">
                </div>
            </td>
            <td>${product.productName || '-'}</td>
            <td>${translateProductType(product.productType) || '-'}</td>
            <td>${product.currency || '-'}</td>
            <td>${formatPercentage(product.interestRate) || '-'}</td>
            <td>${formatCurrency(product.annualDividend, product.currency) || '-'}</td>
            <td>
                <button class="btn btn-sm btn-tech-sm view-product" data-index="${index}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-tech-sm edit-product ms-1" data-index="${index}">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>`;
    });
    
    productTableBody.innerHTML = tableHTML;
    
    // 添加選擇產品事件
    document.querySelectorAll('.product-select').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const productIndex = parseInt(this.getAttribute('data-index'));
            const product = filteredProducts[productIndex];
            
            if (this.checked) {
                addToSelectedProducts(product);
            } else {
                removeFromSelectedProducts(product.productName);
            }
        });
    });
    
    // 添加產品查看事件
    document.querySelectorAll('.view-product').forEach(button => {
        button.addEventListener('click', function() {
            const productIndex = parseInt(this.getAttribute('data-index'));
            const product = filteredProducts[productIndex];
            showProductDetails(product);
        });
    });
    
    // 添加產品編輯事件
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', function() {
            const productIndex = parseInt(this.getAttribute('data-index'));
            const product = filteredProducts[productIndex];
            showProductEditForm(product);
        });
    });
}

/**
 * 初始化產品篩選功能
 */
function initProductFilters() {
    const productTypeFilter = document.getElementById('productTypeFilter');
    const currencyFilter = document.getElementById('currencyFilter');
    const productSearch = document.getElementById('productSearch');
    const resetFilters = document.getElementById('resetFilters');
    
    if (productTypeFilter && currencyFilter && productSearch && resetFilters) {
        // 添加篩選事件
        productTypeFilter.addEventListener('change', updateProductTable);
        currencyFilter.addEventListener('change', updateProductTable);
        
        // 添加搜索事件（延遲搜索以提高性能）
        let searchTimeout;
        productSearch.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(updateProductTable, 300);
        });
        
        // 重置篩選器
        resetFilters.addEventListener('click', function() {
            productTypeFilter.value = 'all';
            currencyFilter.value = 'all';
            productSearch.value = '';
            updateProductTable();
        });
    }
}

/**
 * 應用產品篩選器
 */
function applyProductFilters(products) {
    const productTypeFilter = document.getElementById('productTypeFilter');
    const currencyFilter = document.getElementById('currencyFilter');
    const productSearch = document.getElementById('productSearch');
    
    if (!productTypeFilter || !currencyFilter || !productSearch) return products;
    
    return products.filter(product => {
        // 產品類型篩選
        if (productTypeFilter.value !== 'all' && product.productType !== productTypeFilter.value) {
            return false;
        }
        
        // 貨幣篩選
        if (currencyFilter.value !== 'all' && product.currency !== currencyFilter.value) {
            return false;
        }
        
        // 搜索篩選
        const searchTerm = productSearch.value.toLowerCase().trim();
        if (searchTerm && !product.productName.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        return true;
    });
}

/**
 * 添加產品到已選產品
 */
function addToSelectedProducts(product) {
    if (!window.productDatabase.selectedProducts) {
        window.productDatabase.selectedProducts = [];
    }
    
    // 檢查產品是否已存在
    const exists = window.productDatabase.selectedProducts.some(p => p.productName === product.productName);
    
    if (!exists) {
        window.productDatabase.selectedProducts.push(product);
        updateSelectedProductsDisplay();
        
        // 更新比較按鈕狀態
        const compareButton = document.getElementById('compareSelectedProducts');
        if (compareButton) {
            compareButton.disabled = window.productDatabase.selectedProducts.length < 2;
        }
    }
}

/**
 * 從已選產品中移除
 */
function removeFromSelectedProducts(productName) {
    if (!window.productDatabase.selectedProducts) return;
    
    window.productDatabase.selectedProducts = window.productDatabase.selectedProducts.filter(
        p => p.productName !== productName
    );
    
    updateSelectedProductsDisplay();
    
    // 更新比較按鈕狀態
    const compareButton = document.getElementById('compareSelectedProducts');
    if (compareButton) {
        compareButton.disabled = window.productDatabase.selectedProducts.length < 2;
    }
    
    // 更新產品表格中的複選框狀態
    document.querySelectorAll('.product-select').forEach(checkbox => {
        if (checkbox.value === productName) {
            checkbox.checked = false;
        }
    });
}

/**
 * 更新已選產品顯示
 */
function updateSelectedProductsDisplay() {
    const selectedProductsContainer = document.getElementById('selectedProductsContainer');
    if (!selectedProductsContainer || !window.productDatabase.selectedProducts) return;
    
    const selectedProducts = window.productDatabase.selectedProducts;
    
    if (selectedProducts.length === 0) {
        selectedProductsContainer.innerHTML = `
            <div class="col-12 text-center py-3 text-secondary">
                <i class="fas fa-info-circle me-1"></i> 請從產品列表中選擇產品加入比較
            </div>
        `;
        return;
    }
    
    let cardsHTML = '';
    
    selectedProducts.forEach(product => {
        cardsHTML += `
            <div class="col-md-4">
                <div class="tech-card tech-card-inner">
                    <div class="card-header tech-card-header d-flex justify-content-between align-items-center">
                        <span><i class="fas fa-box me-1"></i> ${product.productName}</span>
                        <button class="btn btn-sm btn-tech-sm remove-selected" data-product="${product.productName}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="product-info">
                            <p><i class="fas fa-tag me-1"></i> <strong>類型:</strong> ${translateProductType(product.productType)}</p>
                            <p><i class="fas fa-money-bill me-1"></i> <strong>貨幣:</strong> ${product.currency}</p>
                            <p><i class="fas fa-percentage me-1"></i> <strong>預定利率:</strong> ${formatPercentage(product.interestRate)}</p>
                            <p><i class="fas fa-coins me-1"></i> <strong>年配息:</strong> ${formatCurrency(product.annualDividend, product.currency)}</p>
                            <p><i class="fas fa-hand-holding-usd me-1"></i> <strong>期末解約金:</strong> ${formatCurrency(product.surrenderValue, product.currency)}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    selectedProductsContainer.innerHTML = cardsHTML;
    
    // 添加移除已選產品事件
    document.querySelectorAll('.remove-selected').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            removeFromSelectedProducts(productName);
        });
    });
}

/**
 * 顯示產品詳情
 */
function showProductDetails(product) {
    // 在實際應用中，這裡可以實現一個模態窗口來顯示詳細信息
    // 為了簡單起見，我們使用通知形式顯示基本信息
    const details = `
        產品名稱: ${product.productName}
        類型: ${translateProductType(product.productType)}
        貨幣: ${product.currency}
        預定利率: ${formatPercentage(product.interestRate)}
        年配息: ${formatCurrency(product.annualDividend, product.currency)}
    `;
    
    showNotification(details, 'info', 5000);
}

/**
 * 顯示產品編輯表單
 */
function showProductEditForm(product) {
    // 此功能可以在實際應用中實現
    // 為了演示，僅顯示一個通知
    showNotification('產品編輯功能正在開發中', 'info');
}

/**
 * 初始化範本下載連結
 */
function initTemplateLink() {
    const templateLink = document.getElementById('templateLink');
    
    if (templateLink) {
        templateLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 創建示例CSV內容
            const csvContent = `productName,productType,currency,interestRate,annualDividend,surrenderValue,insuranceAmount,medicalCoverage
自家儲蓄險A,savings,TWD,2.3,12000,450000,1000000,0
競品儲蓄險B,savings,TWD,2.1,10500,420000,1000000,0
美元投資型C,investment,USD,3.5,1200,35000,100000,5000`;
            
            // 創建下載
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '產品範本.csv');
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
}

/**
 * 初始化比較功能
 */
function initCompareFeature() {
    const compareButton = document.getElementById('compareSelectedProducts');
    
    if (compareButton) {
        compareButton.addEventListener('click', function() {
            if (!window.productDatabase.selectedProducts || 
                window.productDatabase.selectedProducts.length < 2) {
                showNotification('請至少選擇兩個產品進行比較', 'warning');
                return;
            }
            
            // 將選中的產品數據存到本地Storage以便在比較頁面使用
            localStorage.setItem('compareProducts', JSON.stringify(window.productDatabase.selectedProducts));
            
            // 轉到比較頁面
            const comparisonTab = document.getElementById('comparison-tab');
            if (comparisonTab) {
                comparisonTab.click();
                showNotification('產品數據已載入比較表', 'success');
            }
        });
    }
}

/**
 * 创建示例產品數據（測試用）
 */
function createSampleProducts() {
    const sampleProducts = [
        {
            productName: '台幣儲蓄險X1',
            productType: 'savings',
            currency: 'TWD',
            interestRate: 2.5,
            annualDividend: 15000,
            surrenderValue: 500000,
            insuranceAmount: 1000000,
            medicalCoverage: 0
        },
        {
            productName: '台幣儲蓄險X2',
            productType: 'savings',
            currency: 'TWD',
            interestRate: 2.3,
            annualDividend: 13800,
            surrenderValue: 460000,
            insuranceAmount: 1000000,
            medicalCoverage: 0
        },
        {
            productName: '美元投資型Y1',
            productType: 'investment',
            currency: 'USD',
            interestRate: 3.8,
            annualDividend: 1200,
            surrenderValue: 40000,
            insuranceAmount: 100000,
            medicalCoverage: 10000
        },
        {
            productName: '台幣醫療儲蓄險M1',
            productType: 'savings',
            currency: 'TWD',
            interestRate: 2.1,
            annualDividend: 12000,
            surrenderValue: 420000,
            insuranceAmount: 1200000,
            medicalCoverage: 50000
        },
        {
            productName: '美元高利儲蓄險H1',
            productType: 'savings',
            currency: 'USD',
            interestRate: 3.2,
            annualDividend: 960,
            surrenderValue: 32000,
            insuranceAmount: 80000,
            medicalCoverage: 0
        }
    ];
    
    // 添加到產品數據庫
    addProductsToDatabase(sampleProducts);
    
    // 預先選擇兩個產品用於比較示範
    addToSelectedProducts(sampleProducts[0]);
    addToSelectedProducts(sampleProducts[3]);
    
    // 立即更新產品顯示，確保頁面載入時可見
    setTimeout(() => {
        updateSelectedProductsDisplay();
        showNotification('示例產品數據已載入，您可以開始使用產品導入功能', 'info', 5000);
    }, 500);
}

/**
 * 通知顯示函數
 */
function showNotification(message, type = 'info', duration = 3000) {
    // 檢查是否已有通知容器
    let notificationContainer = document.getElementById('notificationContainer');
    
    if (!notificationContainer) {
        // 創建通知容器
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} tech-notification animate__animated animate__fadeIn`;
    notification.innerHTML = message;
    
    // 添加關閉按鈕
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.style.position = 'absolute';
    closeButton.style.right = '10px';
    closeButton.style.top = '10px';
    closeButton.addEventListener('click', function() {
        notification.remove();
    });
    
    notification.appendChild(closeButton);
    notificationContainer.appendChild(notification);
    
    // 自動關閉
    setTimeout(() => {
        notification.classList.remove('animate__fadeIn');
        notification.classList.add('animate__fadeOut');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, duration);
}

/**
 * 格式化百分比
 */
function formatPercentage(value) {
    if (value === undefined || value === null) return '-';
    return value.toFixed(2) + '%';
}

/**
 * 格式化貨幣
 */
function formatCurrency(value, currency = 'TWD') {
    if (value === undefined || value === null) return '-';
    
    const formatter = new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    return formatter.format(value);
}

/**
 * 翻譯產品類型
 */
function translateProductType(type) {
    const typeMap = {
        'savings': '儲蓄險',
        'investment': '投資型'
    };
    
    return typeMap[type] || type;
}
