import { LEVEL_1, renderBoard } from "./grid.js";

/** @type {{ level: number[][], player: { row: number, col: number }, runes: { matter: boolean, behavior: boolean } }} */
export const gameState = {
  level: LEVEL_1,
  player: { row: 1, col: 1 },
  runes: {
    matter: false,
    behavior: false,
  },
};

function initGame() {
  const board = document.getElementById("board");
  if (!board) {
    return;
  }

  renderBoard(board, gameState.level, gameState.player);
}

document.addEventListener("DOMContentLoaded", initGame);
