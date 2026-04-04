// collision.js – обработка столкновений игрока с платформами
function handleCollisions(player, level) {
    const allPlatforms = [...(level.platforms || []), ...(level.groundPlatforms || [])];
    let onGround = false;
    const oldY = player.prevY;

    // Вспомогательная функция: проверка горизонтального пересечения
    function overlapsX(p) {
        return player.x + player.width > p.x && player.x < p.x + p.width;
    }

    // Вертикальные коллизии
    if (player.vy >= 0) {
        // Падение: приземление на платформу
        for (const p of allPlatforms) {
            const playerBottom = player.y + player.height;
            const prevBottom = oldY + player.height;
            if (prevBottom <= p.y && playerBottom >= p.y && overlapsX(p)) {
                player.y = p.y - player.height;
                player.vy = 0;
                onGround = true;
                break;
            }
        }
    } else {
        // Прыжок вверх: удар головой (только непроходимые снизу)
        for (const p of allPlatforms) {
            if (p.passableFromBelow) continue;
            const playerTop = player.y;
            const prevTop = oldY;
            if (prevTop >= p.y + p.height && playerTop <= p.y + p.height && overlapsX(p)) {
                player.y = p.y + p.height;
                player.vy = 0;
                break;
            }
        }
    }

    // Горизонтальные коллизии (после вертикальных)
    for (const p of allPlatforms) {
        if (player.y + player.height > p.y && player.y < p.y + p.height) {
            // Столкновение с правой стороны платформы (игрок слева)
            if (player.x + player.width > p.x && player.x < p.x) {
                player.x = p.x - player.width;
            }
            // Столкновение с левой стороны платформы (игрок справа)
            else if (player.x < p.x + p.width && player.x + player.width > p.x + p.width) {
                player.x = p.x + p.width;
            }
        }
    }

    return { onGround };
}