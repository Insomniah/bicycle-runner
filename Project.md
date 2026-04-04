# Project.md – состояние на 05.04.2026

## Движок и технологии
- Чистый JavaScript (ES6+) + HTML5 Canvas.
- Модульная архитектура (ES6 modules).
- Конечный автомат (State Machine) для управления игрой.
- Событийная шина (Event Bus).
- AssetManager для загрузки ресурсов.
- Чистые функции в ключевых модулях.
- Частичное внедрение зависимостей (DI) в `controls.js` и `world.js`.

## Реализованные архитектурные улучшения

### 1. Переход на модули ES6 ✅
Все файлы (кроме `config.js`) – модули. Точка входа – `main-module.js` с `type="module"`.

### 2. Чистые функции ✅
- `updatePlayerPhysics` (player.js)
- `generateWheelsFromData`, `resolveBackgroundImage` (world.js)
- `calculateCameraPosition` (camera.js)
- `processTouches` (controls.js)
- `generateDecorationsList` (decorations.js)
- `calculateBackgroundTiles` (background.js)
- `generateClouds`, `updateClouds`, `getCloudDrawParams` (sky.js)

### 3. AssetManager ✅
Загружает и кеширует все изображения, предоставляет доступ через `assetManager.get(key)`.

### 4. Event Bus ✅
Модуль `core/eventBus.js` с методами `on`, `off`, `emit`. Используется для событий `wheel.collected`, `level.complete`, `game.over`, а также для событий автомата `state.*`.

### 5. Конечный автомат ✅
Состояния: `PLAYING`, `LEVEL_COMPLETE`, `GAME_OVER`, `SWITCHING_LEVEL`. Переходы: `complete`, `fail`, `switch`, `start`, `restart`. Управляет игрой, заменив флаги `gameOver`, `nextLevelQueued`, `restarting`.

### 6. Внедрение зависимостей (частично) 🟡
- **Готово:** `controls.js` импортирует `player`, `gameState`; `world.js` импортирует `player`, `decorations`, `background`, `sky`, `gameState`, `eventBus`.
- **Осталось:** `camera.js`, `main-module.js`, `player.js` (частично), `game.js` (UI) – продолжают использовать глобальные объекты `window.game.*`.

### 7. Разделение на слои – не начиналось ❌
### 8. Хранение уровней в JSON – не начиналось ❌
### 9. Унификация анимаций – не начиналось ❌
### 10. Тестирование – не начиналось ❌

## Текущая структура проекта
bicycle-runner/
├── index.html
├── css/styles.css
├── js/
│ ├── config.js
│ ├── main-module.js
│ ├── game.js
│ ├── world.js
│ ├── player.js
│ ├── camera.js
│ ├── collision.js
│ ├── controls.js
│ ├── core/
│ │ ├── assetManager.js
│ │ ├── canvas.js
│ │ ├── layers.js
│ │ ├── eventBus.js
│ │ └── stateMachine.js
│ ├── entities/
│ │ ├── platform.js
│ │ └── wheel.js
│ ├── scenery/
│ │ ├── skybackground.js
│ │ ├── sky.js
│ │ ├── background.js
│ │ └── decorations.js
│ ├── levels/
│ │ ├── level1.js
│ │ └── level2.js
│ └── utils/math.js
└── assets/...

text

## Запуск
- `index.html` подключает `config.js` и `main-module.js` (как модуль).
- Запустить Live Server.

## Последний коммит
Внедрение конечного автомата, чистых функций, частичного DI. Проект стабилен, готов к дальнейшему рефакторингу.

---

*Следующие шаги: завершить внедрение зависимостей (п.6), затем перейти к JSON-уровням (п.8).*