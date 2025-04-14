/**
 * 應用圖標修復腳本
 * 確保PWA添加到主屏幕時顯示正確的圖標和名稱
 */
document.addEventListener('DOMContentLoaded', function() {
    // 檢測是否為iOS設備
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (/Macintosh/i.test(navigator.platform) && navigator.maxTouchPoints > 1);
    
    // 添加動態圖標支持
    if (isIOS) {
        // 確保蘋果特定的圖標已添加
        const checkAndAddAppleIcon = function(size) {
            const selector = `link[rel="apple-touch-icon"][sizes="${size}x${size}"]`;
            if (!document.querySelector(selector)) {
                const link = document.createElement('link');
                link.rel = 'apple-touch-icon';
                link.sizes = `${size}x${size}`;
                link.href = `/UI-design/icons/icon-${size}.png`;
                document.head.appendChild(link);
            }
        };

        // 添加所有必需的圖標尺寸
        [57, 60, 72, 76, 114, 120, 144, 152, 167, 180].forEach(size => {
            checkAndAddAppleIcon(size);
        });

        // 添加啟動畫面圖標
        const addStartupImage = function(width, height, orientation) {
            const selector = `link[rel="apple-touch-startup-image"][media*="(device-width: ${width}px) and (device-height: ${height}px)"]`;
            if (!document.querySelector(selector)) {
                const link = document.createElement('link');
                link.rel = 'apple-touch-startup-image';
                link.href = `/UI-design/icons/splash-${orientation === 'portrait' ? width + 'x' + height : height + 'x' + width}.png`;
                link.media = `(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: 2) and (orientation: ${orientation})`;
                document.head.appendChild(link);
            }
        };

        // iPad Pro 12.9"
        addStartupImage(1024, 1366, 'portrait');
        addStartupImage(1024, 1366, 'landscape');
        
        // iPad Pro 11"
        addStartupImage(834, 1194, 'portrait');
        addStartupImage(834, 1194, 'landscape');
        
        // iPad, iPad Air, iPad Mini
        addStartupImage(768, 1024, 'portrait');
        addStartupImage(768, 1024, 'landscape');
    }

    // 防止Safari添加到主屏幕時要求用戶輸入名稱
    const metaAppleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (!metaAppleTitle) {
        const meta = document.createElement('meta');
        meta.name = 'apple-mobile-web-app-title';
        meta.content = '儲蓄險分析';
        document.head.appendChild(meta);
    }
});
