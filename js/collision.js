function handleCollisions(player, level) {
    const allPlatforms = [...(level.platforms || []), ...(level.groundPlatforms || [])];
    let onGround = false;

    const oldY = player.prevY; // используем сохранённое значение до обновления

    if (player.vy >= 0) {
        for (const p of allPlatforms) {
            const playerBottom = player.y + player.height;
            const prevBottom = oldY + player.height;
            if (
                prevBottom <= p.y &&
                playerBottom >= p.y &&
                player.x + player.width > p.x &&
                player.x < p.x + p.width
            ) {
                player.y = p.y - player.height;
                player.vy = 0;
                onGround = true;
                break;
            }
        }
    } else {
        for (const p of allPlatforms) {
            if (p.passableFromBelow) continue;
            const playerTop = player.y;
            const prevTop = oldY;
            if (
                prevTop >= p.y + p.height &&
                playerTop <= p.y + p.height &&
                player.x + player.width > p.x &&
                player.x < p.x + p.width
            ) {
                player.y = p.y + p.height;
                player.vy = 0;
                break;
            }
        }
    }

    for (const p of allPlatforms) {
        if (player.y + player.height > p.y && player.y < p.y + p.height) {
            if (player.x + player.width > p.x && player.x < p.x) {
                player.x = p.x - player.width;
            } else if (player.x < p.x + p.width && player.x + player.width > p.x + p.width) {
                player.x = p.x + p.width;
            }
        }
    }

    return { onGround };
}