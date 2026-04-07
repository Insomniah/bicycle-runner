# Project.md – состояние на 07.04.2026

## Движок и технологии
- Чистый JavaScript (ES6+) + HTML5 Canvas.
- **Модульная архитектура** (ES6 modules).
- **Конечный автомат** (State Machine).
- **Событийная шина** (Event Bus).
- **AssetManager** для загрузки ресурсов.
- **Чистые функции** в ключевых модулях.
- **Внедрение зависимостей** – `gameStore` для глобального состояния.
- **Уровни в JSON** – динамическая загрузка.

## Реализованные архитектурные улучшения

### 1. Переход на модули ES6 ✅
### 2. Чистые функции ✅
### 3. AssetManager ✅
### 4. Event Bus ✅
### 5. Конечный автомат ✅
### 6. Внедрение зависимостей ✅
### 7. Разделение на слои ❌
### 8. Хранение уровней в JSON ✅
### 9. Унификация анимаций ❌
### 10. Тестирование ❌

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
│ │ ├── level1.json
│ │ └── level2.json
│ └── utils/math.js
└── assets/...

text

## Запуск
- `index.html` подключает `config.js` и `main-module.js` (как модуль).
- Уровни загружаются динамически из JSON.
- Запустить Live Server.

## Последние изменения
- ✅ Уровни вынесены в JSON-файлы, удалены `level1.js` и `level2.js`.
- ✅ Динамическая загрузка уровней через `fetch`.
- ✅ Кеширование второго уровня для быстрого переключения.
- ✅ Исправлены вычисления `y` для колёс (теперь готовые числа в JSON).

## Следующие шаги
- **Пункт 9:** Унификация анимаций (SpriteAnimator).
- **Пункт 7:** Разделение на слои (Core, Game, UI).
- **Пункт 10:** Тестирование.

---

*Актуально после перехода на JSON-уровни. Проект стабилен.*