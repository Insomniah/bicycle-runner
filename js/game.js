const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startButton = document.getElementById("startButton");

// Размер под экран телефона
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameRunning = false;

// Игрок
let player = {
    x: 100,
    y: canvas.height - 150,
    width: 40,
    height: 40,
    velocityY: 0,
    jumping: false
};

// Колёса
let wheels = [];
let score = 0;
let startTime;

// Кнопка старта
startButton.addEventListener("click", () => {
    menu.style.display = "none";
    canvas.style.display = "block";
    gameRunning = true;
    startTime = Date.now();
    spawnWheels();
    gameLoop();
});





function spawnWheels() {
    for (let i = 0; i < 20; i++) {
        wheels.push({
            x: 400 + i * 300,
            y: canvas.height - 100,
            radius: 15,
            collected: false
        });
    }
}





canvas.addEventListener("touchstart", () => {
    if (!player.jumping) {
        player.velocityY = -15;
        player.jumping = true;
    }
});





function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    update();
    draw();

    requestAnimationFrame(gameLoop);
}





function update() {
    // Гравитация
    player.velocityY += 0.8;
    player.y += player.velocityY;

    // Земля
    if (player.y > canvas.height - 150) {
        player.y = canvas.height - 150;
        player.jumping = false;
    }

    // Движение уровня
    wheels.forEach(wheel => {
        wheel.x -= 4;

        if (!wheel.collected &&
            player.x < wheel.x + wheel.radius &&
            player.x + player.width > wheel.x - wheel.radius &&
            player.y < wheel.y + wheel.radius &&
            player.y + player.height > wheel.y - wheel.radius) {

            wheel.collected = true;
            score++;
        }
    });

    // Конец через 60 секунд
    if (Date.now() - startTime > 60000) {
        gameRunning = false;
        alert("Level complete! Wheels collected: " + score);
        location.reload();
    }
}





function draw() {
    // Игрок
    ctx.fillStyle = "pink";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Колёса
    wheels.forEach(wheel => {
        if (!wheel.collected) {
            ctx.beginPath();
            ctx.arc(wheel.x, wheel.y, wheel.radius, 0, Math.PI * 2);
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    });

    // Счёт
    ctx.fillStyle = "black";
    ctx.font = "20px monospace";
    ctx.fillText("Wheels: " + score, 20, 40);
}