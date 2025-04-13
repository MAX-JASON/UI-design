/**
 * 儲蓄險分析系統 Service Worker
 * 版本: 1.0.0 (2025-04-14)
 */

// 快取名稱與版本
const CACHE_NAME = 'savings-analysis-cache-v3.0.2';

// 需要快取的資源列表
const CACHE_RESOURCES = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './particles.json',
  './js/emergency-fix.js',
  './js/fix-all-errors.js',
  './js/fix-critical-errors.js',
  './js/ios-optimizations.js',
  './js/ios-touch-fixes.js',
  './js/splash-controller.js',
  './js/tab-navigation-fix.js',
  './js/visual-enhancements.js',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js'
];

// 安裝 Service Worker 並快取核心資源
self.addEventListener('install', event => {
  console.log('[Service Worker] 安裝中');
  
  // 跳過等待階段，直接激活
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] 快取資源中');
        return cache.addAll(CACHE_RESOURCES);
      })
      .catch(error => {
        console.error('[Service Worker] 快取資源失敗:', error);
      })
  );
});

// 激活時清理舊快取
self.addEventListener('activate', event => {
  console.log('[Service Worker] 已激活');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] 移除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // 確保 Service Worker 可立即控制所有頁面
  return self.clients.claim();
});

// 處理資源請求
self.addEventListener('fetch', event => {
  // 不處理非 GET 請求
  if (event.request.method !== 'GET') return;
  
  // 不處理瀏覽器擴充功能請求
  if (event.request.url.includes('/extensions/') || 
      event.request.url.includes('chrome-extension://')) return;
  
  // 對於網絡分析請求不進行快取
  if (event.request.url.includes('analytics') || 
      event.request.url.includes('googletagmanager')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // 如果在快取中找到響應，則返回快取
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // 嘗試從網絡獲取資源
        return fetch(event.request)
          .then(response => {
            // 檢查響應是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 將新資源添加到快取
            // 注意：需要克隆響應因為響應流只能使用一次
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                // 只快取本地資源和主要 CDN 資源
                if (event.request.url.includes(self.location.origin) || 
                    event.request.url.includes('cdn.jsdelivr.net') ||
                    event.request.url.includes('cdnjs.cloudflare.com')) {
                  cache.put(event.request, responseToCache);
                }
              });
            
            return response;
          })
          .catch(error => {
            console.log('[Service Worker] 獲取資源失敗:', error);
            
            // 如果是導航請求（HTML 頁面），在離線時顯示離線頁面
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            
            // 其他失敗情況將顯示默認離線響應
            return new Response('離線狀態，無法載入資源', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// 接收消息
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// 定期更新快取
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-cache') {
    event.waitUntil(updateCache());
  }
});

// 更新快取的輔助函數
async function updateCache() {
  try {
    const cache = await caches.open(CACHE_NAME);
    console.log('[Service Worker] 執行定期快取更新');
    
    // 重新快取核心資源
    await cache.addAll(CACHE_RESOURCES);
    console.log('[Service Worker] 快取更新完成');
  } catch (error) {
    console.error('[Service Worker] 快取更新失敗:', error);
  }
}
