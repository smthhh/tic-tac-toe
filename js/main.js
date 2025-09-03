

const nextStep = document.getElementById('step');

export function updateNextStep(currentPlayer) {
    nextStep.textContent = `Очередь игрока ${currentPlayer}`
}
