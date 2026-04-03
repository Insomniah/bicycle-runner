Движок и язык
Чистый JavaScript (ES6) + HTML5 Canvas. Без фреймворков. Адаптация под мобильные устройства, предзагрузка всех ресурсов, ограничение dt ≤ 0.033 сек. Централизованная конфигурация в js/config.js.

Игровой процесс
2D платформер-раннер. Игрок управляет велосипедистом, собирает колёса и достигает правого края уровня. При касании правой границы уровень завершается, игрок автоматически движется вправо, и через 2 секунды загружается следующий уровень (level1 → level2). Падение вниз → Game Over с возможностью рестарта.

Структура проекта (сокращённо)
text
js/
├── config.js
├── main.js                 # игровой цикл, предзагрузка, рестарт, debug
├── game.js                 # canvas, gameOverUI
├── world.js                # управление уровнем, фоном, колёсами
├── player.js               # игрок: движение, анимация, сбор колёс
├── collision.js            # столкновения с платформами
├── camera.js               # камера
├── controls.js             # клавиатура и тач
├── core/canvas.js, layers.js
├── entities/platform.js, wheel.js
├── background/
│   ├── skybackground.js    # заливка неба
│   ├── sky.js              # облака
│   ├── background.js       # горы/заводы (динамическая смена)
│   └── rocks.js            # камни
├── utils/math.js
levels/level1.js, level2.js
assets/ (player/, mountains/, industrial/, objects/, rocks/)
Глобальные объекты
window.game – состояние (gameOver, debugMode, wheelsCollected), методы restart(), drawDebug().

window.game.player – физика, прыжок, анимация, сбор колёс.

window.game.world – текущий уровень, фон, платформы, генерация колёс.

window.game.camera – следование за игроком с отступами.

window.game.gameOverUI – оверлей окончания игры.

background (глобальный объект) – универсальный фон с поддержкой смены текстуры и масштаба.

Фон (динамическая смена)
background.js предоставляет методы load(src) и setImage(img, src), а также учитывает масштаб из CONFIG.BACKGROUND_SCALE.

Уровни содержат поле backgroundImage (например, CONFIG.BACKGROUND_FACTORIES для level2).

В world.setLevel() вызывается background.setImage() с предзагруженным изображением, что позволяет переключать фон (горы → заводы) без дополнительной загрузки.

Данные уровней
Каждый уровень (level1.js, level2.js) содержит:

number, width, height, groundY

platformData[] для платформ (x, offset, w, h)

wheelsData[] для позиций колёс

backgroundImage – путь к фону

метод generate(), создающий platforms и groundPlatforms

Предзагрузка и инициализация
loadAllImages() загружает спрайты игрока, оба фона (BACKGROUND_MOUNTAINS, BACKGROUND_FACTORIES), камни и колёса. Результаты сохраняются в window.preloadedBackgrounds. После загрузки стартует игровой цикл.

Игровой цикл (main.js)
Обновление: camera.update(), player.update(dt), world.update(dt).

Отрисовка: слои (drawLayers), игрок, колёса, счётчик, отладка.

При gameOver === "complete" через задержку переключается уровень (вызов world.setLevel(level2)).

Управление
Клавиатура: стрелки / A/D – движение, пробел – прыжок.

Клавиша ё/~ – включение отладки (хитбокс, координаты, Coyote Time).

Тач-зоны (левая – движение, правая – прыжок).

Кнопка рестарта в оверлее.

Конфигурация (config.js)
Содержит все настройки: параметры игрока, камеры, физики, фона (пути к изображениям + BACKGROUND_SCALE), колёс, управления, отладки, задержку переключения уровней.

Последние изменения (рефакторинг фона)
Файл mountains.js переименован в background.js, объект mountains переименован в background.

Добавлена динамическая смена фона по уровням через поле backgroundImage в данных уровня.

Реализована предзагрузка обоих фонов (горы и заводы) в loadAllImages() с кешированием в window.preloadedBackgrounds.

В background.js добавлены методы load() и setImage(), а также поддержка масштабирования через CONFIG.BACKGROUND_SCALE (решает проблему разных размеров изображений).

В world.setLevel() автоматически переключается фон при смене уровня.

Обновлены level1.js (явно указан фон гор) и level2.js (фон заводов).

