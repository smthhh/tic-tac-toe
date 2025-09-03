import './styles/main.scss';

import { Application, Graphics } from 'pixi.js';
import { initDevtools } from '@pixi/devtools';
import { updateNextStep } from './js/main';

(async () => {
    const app = new Application();
    await app.init({
        background: 0x5b5b5b,
        width: 300,
        height: 300,
    });
    document.body.appendChild(app.canvas);
    initDevtools({ app });


    // Линии
    const lines = new Graphics();

    lines.moveTo(0, 100).lineTo(300, 100);
    lines.moveTo(0, 200).lineTo(300, 200);

    lines.moveTo(100, 0).lineTo(100, 300);
    lines.moveTo(200, 0).lineTo(200, 300);

    lines.stroke({ width: 3, color: 0xffffff });

    app.stage.addChild(lines);

    //массив для проверки пустого квадрата

    const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]

    let currentPlayer = 'tic';
    updateNextStep(currentPlayer);

    // проверка на победу 

    function checkWinner(board) {
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== null) {
                return board[i][0];
            }
        }

        for (let j = 0; j < 3; j++) {
            if (board[0][j] === board[1][j] && board[1][j] === board[2][j] && board[0][j] !== null) {
                return board[0][j];
            }
        }

        if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== null) {
            return board[0][0];
        }
        if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== null) {
            return board[0][2];
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === null) {
                    return null;
                }
            }
        }

        return 'draw';
    }

    // Координаты
    app.canvas.addEventListener('click', (e) => {
        const rect = app.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // квадрат и цетровка
        const row = Math.floor(y / 100);
        const col = Math.floor(x / 100);

        const centerX = col * 100 + 50;
        const centerY = row * 100 + 50;

        // проверка квадрата

        if (board[row][col] !== null) {
            return;
        }

        board[row][col] = currentPlayer;

        // Отрисовка рестика и нолика

        if (currentPlayer === 'tic') {
            const tic = new Graphics();
            tic.moveTo(centerX - 40, centerY - 40).lineTo(centerX + 40, centerY + 40)
                .moveTo(centerX + 40, centerY - 40).lineTo(centerX - 40, centerY + 40)
                .stroke({ width: 2, color: 0xff0000 });

            app.stage.addChild(tic);
        } else {
            const tac = new Graphics();
            tac.circle(centerX, centerY, 45)
                .stroke({ width: 2, color: 0x00ff00 });

            app.stage.addChild(tac);
        }

        const winner = checkWinner(board);
        if (winner) {
            if (winner === 'draw') {
                alert('Ничья!');
            } else {
                alert(`Победил ${winner === 'tic' ? 'крестик' : 'нолик'}!`);
            }
            return;
        }

        currentPlayer = currentPlayer === 'tic' ? 'tac' : 'tic';
        updateNextStep(currentPlayer);
    });


    // очистка поля
    const newGameBtn = document.getElementById('newGameBtn');

    newGameBtn.addEventListener('click', () => {
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                board[r][c] = null;
            }
        }

        app.stage.removeChildren();
        app.stage.addChild(lines);

        currentPlayer = 'tic';
        updateNextStep(currentPlayer);
    });

})();