import { renderBoard } from "./grid.js";

/**
 * @param {string | null} activeRune
 */
export function updateRuneUI(activeRune) {
  document.querySelectorAll(".rune-slot[data-rune]").forEach((button) => {
    const isActive = button.dataset.rune === activeRune;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));

    const status = button.querySelector(".rune-status");
    if (status) {
      status.textContent = isActive ? "Active" : "Inactive";
    }
  });
}

/**
 * @param {import("./main.js").GameState} gameState
 * @param {HTMLElement} boardElement
 */
export function setupRuneControls(gameState, boardElement) {
  document.querySelectorAll(".rune-slot[data-rune]").forEach((button) => {
    button.addEventListener("click", () => {
      const rune = button.dataset.rune;
      if (!rune) {
        return;
      }

      gameState.activeRune = gameState.activeRune === rune ? null : rune;
      updateRuneUI(gameState.activeRune);
      renderBoard(
        boardElement,
        gameState.level,
        gameState.player,
        gameState.activeRune
      );
    });
  });

  updateRuneUI(gameState.activeRune);
}
