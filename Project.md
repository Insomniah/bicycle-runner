# Project.md – состояние на 07.04.2026

## Движок и технологии
- Чистый JavaScript (ES6+) + HTML5 Canvas.
- **Модульная архитектура** (ES6 modules).
- **Конечный автомат** (State Machine).
- **Событийная шина** (Event Bus).
- **AssetManager** для загрузки ресурсов.
- **Чистые функции** в ключевых модулях.
- **Внедрение зависимостей** – все глобальные флаги и состояние вынесены в `gameStore`.

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
Модуль `core/eventBus.js`. Используется для событий: `wheel.collected`, `state.*`, `game.restart`.

### 5. Конечный автомат ✅
Состояния: `PLAYING`, `LEVEL_COMPLETE`, `GAME_OVER`, `SWITCHING_LEVEL`. Переходы: `complete`, `fail`, `switch`, `start`, `restart`.

### 6. Внедрение зависимостей ✅
- Создан `core/gameStore.js` – хранилище `wheelsCollected` и `debugMode` с геттерами/сеттерами и событиями.
- Убраны глобальные `window.game.state` – все обращения заменены на `gameStore`.
- В `controls.js`, `player.js`, `main-module.js` явно импортируются нужные зависимости.
- `window.game` остался только для `restart` и `drawDebug` (для совместимости с UI).

### 7. Разделение на слои ❌ не начиналось
### 8. Хранение уровней в JSON ❌ не начиналось
### 9. Унификация анимаций ❌ не начиналось
### 10. Тестирование ❌ не начиналось

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
│ │ ├── stateMachine.js
│ │ └── gameStore.js
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

## Последние изменения
- ✅ Создан `gameStore` – единое хранилище состояния игры.
- ✅ Исправлен баг с автодвижением после завершения уровня (игрок уходит за край и не возвращается).
- ✅ Исправлен рестарт (кнопка Restart работает через EventBus).
- ✅ Устранены все глобальные флаги (`window.game.state` больше нет).

## Следующие шаги (по выбору)
- **Пункт 8:** Хранение уровней в JSON (динамическая загрузка).
- **Пункт 9:** Унификация анимаций (SpriteAnimator).
- **Пункт 7:** Разделение на слои (Core, Game, UI).
- **Пункт 10:** Написание тестов (например, для collision.js).

---

*Актуально после завершения внедрения зависимостей. Проект стабилен, готов к дальнейшему рефакторингу.*