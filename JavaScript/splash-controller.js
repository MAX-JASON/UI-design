/**
 * 啟動畫面控制器
 * 用於控制啟動畫面的顯示和隱藏
 * 版本: 1.0.0 (2025-04-14)
 */
document.addEventListener('DOMContentLoaded', function() {
  // 確保頁面完全加載後再設置超時
  setTimeout(function() {
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
      // 先淡出
      splashScreen.style.opacity = '0';
      // 等待淡出動畫完成後再隱藏
      setTimeout(function() {
        splashScreen.style.display = 'none';
      }, 500); // 淡出效果持續 500 毫秒
    }
  }, 1500); // 顯示啟動畫面 1.5 秒
});

/**
 * 修復 Service Worker 註冊
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('ServiceWorker 註冊成功：', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker 註冊失敗：', err);
      });
  });
}

/**
 * 設備方向檢測與處理 - 增強版
 */
// 儲存上次狀態，用於避免重複處理
let lastOrientation = {
  width: window.innerWidth,
  height: window.innerHeight,
  orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
};

function checkOrientation() {
  // 檢查尺寸是否真的變化
  const currentWidth = window.innerWidth;
  const currentHeight = window.innerHeight;
  const isLandscape = currentWidth > currentHeight;
  
  // 如果是 iOS 設備，有時需要額外處理 - 使用已定义的全局变量而不再重新宣告
  // 避免重新声明，而是使用全局isIOS变量，如果存在的话
  if (typeof window.isIOS === 'undefined') {
    window.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }
  
  // 檢查是否真的有變化
  if (lastOrientation.orientation === (isLandscape ? 'landscape' : 'portrait') && 
      !(typeof window.isIOS !== 'undefined' ? window.isIOS : false) && 
      Math.abs(lastOrientation.width - currentWidth) < 50) {
    return; // 沒有真實方向變化，避免虛假觸發
  }
  
  // 更新方向類別
  if (isLandscape) {
    document.body.classList.add('landscape');
    document.body.classList.remove('portrait');
  } else {
    document.body.classList.add('portrait');
    document.body.classList.remove('landscape');
  }
  
  // 更新上次狀態
  lastOrientation = {
    width: currentWidth,
    height: currentHeight,
    orientation: isLandscape ? 'landscape' : 'portrait'
  };
  
  console.log(` 方向已更新為 : ${isLandscape ? ' 橫向 ' : ' 直向 '}`);
  
  // 觸發自定義事件供其他組件使用
  const orientationEvent = new CustomEvent('app-orientation-change', { 
    detail: { isLandscape }
  });
  document.dispatchEvent(orientationEvent);
}

function handleOrientationChange() {
  // 先添加過渡類以顯示過渡動畫
  document.body.classList.add('orientation-change');
  
  // 用定時器延遲執行以避免中間狀態
  setTimeout(() => {
    checkOrientation();
    
    // iPad 特別處理 - 確保元素尺寸正確更新
    if (checkIsiPad()) {
      // 強制刷新布局
      document.body.style.display = 'none';
      document.body.offsetHeight; // 觸發回流
      document.body.style.display = '';
      
      // 重設圖表尺寸
      resizeAllCharts();
    }
    
    // 移除過渡類別
    setTimeout(() => {
      document.body.classList.remove('orientation-change');
    }, 500);
  }, 100);
}

// 改進的圖表尺寸更新功能
function resizeAllCharts() {
  if (window.Chart && window.Chart.instances) {
    Object.values(window.Chart.instances).forEach(chart => {
      try {
        chart.resize();
      } catch (e) {
        console.error(' 圖表調整大小失敗 :', e);
      }
    });
  }
  
  // 檢查自定義圖表實例
  const customCharts = [
    'irrChartInstance', 
    'dividendChartInstance', 
    'radarChartInstance',
    'comparisonChartInstance'
  ];
  
  customCharts.forEach(chartName => {
    if (window[chartName]) {
      try {
        window[chartName].resize();
      } catch (e) {
        console.log(`${chartName} 調整失敗 :`, e);
      }
    }
  });
}

// 初始檢查方向
checkOrientation();

// 監聽方向變化事件 - 採用防抖動處理
let orientationTimeout;
window.addEventListener('orientationchange', function() {
  clearTimeout(orientationTimeout);
  
  // iOS 裝置處理
  if (checkIsiPad()) {
    // 立即添加過渡遮罩，防止閃爍
    const mask = document.createElement('div');
    mask.style.position = 'fixed';
    mask.style.top = '0';
    mask.style.left = '0';
    mask.style.width = '100%';
    mask.style.height = '100%';
    mask.style.backgroundColor = '#040b19';
    mask.style.zIndex = '10000';
    mask.style.opacity = '0.8';
    mask.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(mask);
    
    // 處理方向變更
    orientationTimeout = setTimeout(function() {
      handleOrientationChange();
      
      // 完成後淡出遮罩
      setTimeout(() => {
        mask.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(mask);
        }, 300);
      }, 300);
    }, 300);
  } else {
    orientationTimeout = setTimeout(handleOrientationChange, 100);
  }
});

// 尺寸變更可能也表示方向變化
window.addEventListener('resize', function() {
  clearTimeout(orientationTimeout);
  orientationTimeout = setTimeout(checkOrientation, 200);
});

/**
 * iPad 特殊處理
 */
// 使用函數而不是常量，避免变量冲突
function checkIsiPad() {
  return /iPad/.test(navigator.userAgent) || 
        (/Macintosh/i.test(navigator.platform) && navigator.maxTouchPoints > 1);
}

// 如果是 iPad，應用額外優化
if (checkIsiPad()) {
  document.documentElement.classList.add('ipad-device');
  document.body.classList.add('ipad-device');
  
  // 優化觸控區域
  document.addEventListener('DOMContentLoaded', function() {
    // 增大按鈕觸控區域
    document.querySelectorAll('.btn, .form-control').forEach(btn => {
      btn.style.padding = '12px 20px';
      btn.style.minHeight = '44px';
      
      // 增加觸控反饋
      btn.addEventListener('touchstart', function() {
        this.classList.add('ipad-active');
      }, {passive: true});
      
      btn.addEventListener('touchend', function() {
        this.classList.remove('ipad-active');
      }, {passive: true});
    });
    
    // 改善表單控件觸控區域
    document.querySelectorAll('.form-check-input').forEach(input => {
      input.style.width = '24px';
      input.style.height = '24px';
    });
    
    // 防止放大問題
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'viewport';
      newMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
      document.head.appendChild(newMeta);
    }
    
    console.log('iPad 特殊優化已應用 ');
  });
}
