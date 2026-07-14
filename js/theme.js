/**
 * Управление темой для Telegram Mini App
 * Поддерживает Telegram WebApp и системную тему
 */

// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;

// Сообщаем Telegram, что приложение готово
tg.ready();

// Растягиваем приложение на весь экран
tg.expand();

/**
 * Применяет тему из Telegram или системную тему
 */
function applyTheme() {
    // Пытаемся получить параметры темы из Telegram
    if (tg.themeParams && tg.themeParams.bg_color) {
        const params = tg.themeParams;
        
        // Применяем цвета через CSS-переменные
        const root = document.documentElement;
        root.style.setProperty('--bg-color', params.bg_color);
        root.style.setProperty('--text-color', params.text_color);
        root.style.setProperty('--hint-color', params.hint_color || '#707579');
        root.style.setProperty('--link-color', params.link_color || '#2678b6');
        root.style.setProperty('--button-color', params.button_color || '#2678b6');
        root.style.setProperty('--button-text-color', params.button_text_color || '#ffffff');
        root.style.setProperty('--secondary-bg-color', params.secondary_bg_color || '#f4f4f5');
        root.style.setProperty('--header-bg-color', params.header_bg_color || '#ffffff');
        
        // Принудительно применяем фон ко всем элементам (для надежности)
        document.body.style.backgroundColor = params.bg_color;
        document.querySelectorAll('table, td').forEach(el => {
            el.style.backgroundColor = params.bg_color;
        });
        
        console.log('✅ Telegram theme applied');
    } else {
        // Если Telegram не передал цвета, используем системную тему
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const bgColor = isDark ? '#0a0a0a' : '#ffffff';
        const textColor = isDark ? '#ffffff' : '#000000';
        const borderColor = isDark ? '#2a2a2c' : '#e3e3e3';
        
        const root = document.documentElement;
        root.style.setProperty('--bg-color', bgColor);
        root.style.setProperty('--text-color', textColor);
        root.style.setProperty('--border-color', borderColor);
        
        document.body.style.backgroundColor = bgColor;
        document.querySelectorAll('table, td').forEach(el => {
            el.style.backgroundColor = bgColor;
        });
        
        console.log('✅ System theme applied (dark:', isDark, ')');
    }
}

/**
 * Обновляет цвет шапки Telegram
 */
function updateHeaderColor() {
    try {
        tg.setHeaderColor('bg_color');
    } catch (e) {
        console.log('Header color update skipped');
    }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========

// Применяем тему сразу
applyTheme();

// Обновляем шапку
updateHeaderColor();

// Следим за сменой темы в Telegram
tg.onEvent('themeChanged', function() {
    console.log('🔄 Theme changed event received');
    applyTheme();
});

// Следим за сменой системной темы (запасной вариант)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    // Применяем только если Telegram не управляет темой
    if (!tg.themeParams || !tg.themeParams.bg_color) {
        console.log('🔄 System theme changed');
        applyTheme();
    }
});

console.log('✅ Theme manager initialized');
