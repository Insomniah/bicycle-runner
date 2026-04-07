// // tests/runTests.js – простые юнит-тесты для ключевых функций
// (async function runTests() {
//   console.log('%c🧪 Запуск тестов...', 'font-size:16px; font-weight:bold; color:blue');

//   let passed = 0;
//   let failed = 0;

//   function assert(condition, message) {
//     if (condition) {
//       console.log(`✅ ${message}`);
//       passed++;
//     } else {
//       console.error(`❌ ${message}`);
//       failed++;
//     }
//   }

//   // ========== 1. Тестируем генерацию колёс ==========
//   // Импортируем функцию generateWheelsFromData (если она экспортирована из world.js)
//   // Для этого нужно, чтобы world.js экспортировал эту функцию. Сделаем динамический импорт.
//   try {
//     const { Wheel } = await import('../js/entities/wheel.js');
//     const { generateWheelsFromData } = await import('../js/world.js');
//     const testWheelsData = [
//       { x: 100, y: 200 },
//       { x: 150, y: 250 }
//     ];
//     const wheels = generateWheelsFromData(testWheelsData);
//     assert(wheels.length === 2, 'generateWheelsFromData: создано 2 колеса');
//     assert(wheels[0].x === 100 && wheels[0].y === 200, 'generateWheelsFromData: координаты первого колеса');
//     assert(wheels[1] instanceof Wheel, 'generateWheelsFromData: объекты являются экземплярами Wheel');
//   } catch (err) {
//     console.error('Не удалось импортировать generateWheelsFromData', err);
//     failed++;
//   }

//   // ========== 2. Тестируем коллизии ==========
//   try {
//     const { handleCollisions } = await import('../js/collision.js');
//     // Создаём тестового игрока и платформу
//     const player = {
//       x: 100, y: 100, vy: 5, prevY: 80,
//       width: 24, height: 64
//     };
//     const platform = {
//       x: 80, y: 150, width: 80, height: 20,
//       passableFromBelow: true
//     };
//     const level = { platforms: [platform], groundPlatforms: [] };
//     const { onGround } = handleCollisions(player, level);
//     assert(onGround === true, 'handleCollisions: игрок приземлился на платформу');
//     assert(player.y === 150 - 64 && player.vy === 0, 'handleCollisions: позиция и скорость после приземления');

//     // Тест прохода снизу
//     const player2 = { x: 100, y: 140, vy: -5, prevY: 145, width: 24, height: 64 };
//     const platform2 = { x: 80, y: 150, width: 80, height: 20, passableFromBelow: true };
//     const level2 = { platforms: [platform2], groundPlatforms: [] };
//     const oldY = player2.y;
//     handleCollisions(player2, level2);
//     assert(player2.y === oldY, 'handleCollisions: проход сквозь платформу снизу (passable)');

//     // Тест удара головой о твёрдую платформу
//     const player3 = { x: 100, y: 170, vy: -5, prevY: 175, width: 24, height: 64 };
//     const platform3 = { x: 80, y: 150, width: 80, height: 20, passableFromBelow: false };
//     const level3 = { platforms: [platform3], groundPlatforms: [] };
//     handleCollisions(player3, level3);
//     assert(player3.y === 170 && player3.vy === 0, 'handleCollisions: удар головой о твёрдую платформу');

//     // Тест горизонтального отталкивания влево
//     const player4 = { x: 99, y: 100, vy: 0, prevY: 100, width: 24, height: 64 };
//     const platform4 = { x: 100, y: 80, width: 50, height: 100 };
//     const level4 = { platforms: [platform4], groundPlatforms: [] };
//     handleCollisions(player4, level4);
//     assert(player4.x === 100 - 24, 'handleCollisions: отталкивание влево');

//     // Тест горизонтального отталкивания вправо
//     const player5 = { x: 127, y: 100, vy: 0, prevY: 100, width: 24, height: 64 };
//     const platform5 = { x: 100, y: 80, width: 50, height: 100 };
//     const level5 = { platforms: [platform5], groundPlatforms: [] };
//     handleCollisions(player5, level5);
//     assert(player5.x === 150, 'handleCollisions: отталкивание вправо');
//   } catch (err) {
//     console.error('Не удалось импортировать handleCollisions', err);
//     failed++;
//   }

//   // ========== 3. Тестируем SpriteAnimator ==========
//   try {
//     const { SpriteAnimator } = await import('../js/core/spriteAnimator.js');
//     const anim = new SpriteAnimator(5, 0.1);
//     assert(anim.getFrame() === 0, 'SpriteAnimator: начальный кадр 0');
//     anim.update(0.1);
//     assert(anim.getFrame() === 1, 'SpriteAnimator: переключение кадра через интервал');
//     anim.update(0.09);
//     assert(anim.getFrame() === 1, 'SpriteAnimator: не переключается до накопления времени');
//     anim.reset();
//     assert(anim.getFrame() === 0 && anim.timer === 0, 'SpriteAnimator: сброс');
//   } catch (err) {
//     console.error('Не удалось импортировать SpriteAnimator', err);
//     failed++;
//   }

//   // ========== Итог ==========
//   console.log(`%c\nТесты завершены: ${passed} пройдено, ${failed} не пройдено`, `font-size:14px; color:${failed ? 'red' : 'green'}`);
// })();