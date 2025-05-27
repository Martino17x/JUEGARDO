let playerName = "";
let score = 0;
let pacMan = { x: 40, y: 40, radius: 10, speed: 2, dx: 0, dy: 0 };
let ghosts = [
    { x: 200, y: 200, speed: 2, dx: 2, dy: 0 },
    { x: 300, y: 100, speed: 2, dx: -2, dy: 0 }
];
let points = [];

const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function startGame() {
    playerName = document.getElementById("playerName").value;
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    initGame();
}

function initGame() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = maze[0].length * 40;
    canvas.height = maze.length * 40;

    function generatePoints() {
        points = [];
        for (let row = 0; row < maze.length; row++) {
            for (let col = 0; col < maze[row].length; col++) {
                if (maze[row][col] === 0) {
                    points.push({ x: col * 40 + 20, y: row * 40 + 20 });
                }
            }
        }
    }

    function drawMaze() {
        for (let row = 0; row < maze.length; row++) {
            for (let col = 0; col < maze[row].length; col++) {
                if (maze[row][col] === 1) {
                    ctx.fillStyle = "blue";
                    ctx.fillRect(col * 40, row * 40, 40, 40);
                }
            }
        }
    }

    function drawPacMan() {
        ctx.beginPath();
        ctx.arc(pacMan.x, pacMan.y, pacMan.radius, 0.2 * Math.PI, 1.8 * Math.PI);
        ctx.lineTo(pacMan.x, pacMan.y);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
    }

    function drawPoints() {
        ctx.fillStyle = "white";
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawGhosts() {
        ghosts.forEach(ghost => {
            ctx.fillStyle = "red";
            ctx.fillRect(ghost.x, ghost.y, 20, 20);
        });
    }

    function canMove(x, y) {
        let col = Math.floor(x / 40);
        let row = Math.floor(y / 40);
        return maze[row][col] === 0;
    }

    function moveGhosts() {
        ghosts.forEach(ghost => {
            let newX = ghost.x + ghost.dx;
            let newY = ghost.y + ghost.dy;

            if (!canMove(newX, ghost.y)) ghost.dx *= -1;
            if (!canMove(ghost.x, newY)) ghost.dy *= -1;

            ghost.x += ghost.dx;
            ghost.y += ghost.dy;
        });
    }

    function checkCollision() {
        ghosts.forEach(ghost => {
            let dist = Math.hypot(pacMan.x - ghost.x, pacMan.y - ghost.y);
            if (dist < pacMan.radius + 10) {
                alert(`¡Perdiste, ${playerName}! Score: ${score}`);
                document.location.reload();
            }
        });
    }

    function checkPointCollision() {
        for (let i = points.length - 1; i >= 0; i--) {
            let point = points[i];
            let dist = Math.hypot(pacMan.x - point.x, pacMan.y - point.y);

            if (dist < pacMan.radius) {
                points.splice(i, 1);
                score++;
                document.getElementById("score").innerText = `Puntuación: ${score}`;
            }
        }
    }

    function update() {
        let newX = pacMan.x + pacMan.dx;
        let newY = pacMan.y + pacMan.dy;

        if (canMove(newX, pacMan.y)) pacMan.x = newX;
        if (canMove(pacMan.x, newY)) pacMan.y = newY;

        moveGhosts();
        checkCollision();
        checkPointCollision();
    }

    function handleKeyDown(event) {
        if (event.key === "ArrowUp" || event.key === "w") { pacMan.dy = -pacMan.speed; pacMan.dx = 0; }
        if (event.key === "ArrowDown" || event.key === "s") { pacMan.dy = pacMan.speed; pacMan.dx = 0; }
        if (event.key === "ArrowLeft" || event.key === "a") { pacMan.dx = -pacMan.speed; pacMan.dy = 0; }
        if (event.key === "ArrowRight" || event.key === "d") { pacMan.dx = pacMan.speed; pacMan.dy = 0; }
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMaze();
        drawPoints();
        drawPacMan();
        drawGhosts();
        update();
        requestAnimationFrame(gameLoop);
    }

    document.addEventListener("keydown", handleKeyDown);
    generatePoints();
    gameLoop();
}
