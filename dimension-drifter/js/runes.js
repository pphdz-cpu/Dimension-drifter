export const RUNES = {
  MELT: "melt",
  TINY: "tiny",
};

/** Maps tile type IDs to default and rune-transformed CSS classes. */
export const TILE_VISUAL_CLASS = {
  0: { default: "tile-floor" },
  1: { default: "tile-wall" },
  2: { default: "tile-river", [RUNES.MELT]: "tile-bridge" },
  3: { default: "tile-guard", [RUNES.TINY]: "tile-guard-tiny" },
  4: { default: "tile-exit" },
};

/**
 * Returns the CSS class for a cell, swapping visuals when a rune is active.
 * e.g. tile-river → tile-bridge when Melt Rune is active.
 * @param {number} tile
 * @param {string | null} activeRune
 */
export function getTileClass(tile, activeRune) {
  const visual = TILE_VISUAL_CLASS[tile];
  if (!visual) {
    return "tile-floor";
  }

  if (activeRune && visual[activeRune]) {
    return visual[activeRune];
  }

  return visual.default;
}

/**
 * Whether the player can walk onto this tile given the active rune.
 * @param {number} tile
 * @param {string | null} activeRune
 */
export function isTilePassable(tile, activeRune = null) {
  if (tile === TILE.FLOOR || tile === TILE.EXIT) {
    return true;
  }
  if (tile === TILE.RIVER && activeRune === RUNES.MELT) {
    return true;
  }
  if (tile === TILE.GUARD && activeRune === RUNES.TINY) {
    return true;
  }
  return false;
}

/**
 * @param {number} tile
 * @param {string | null} activeRune
 * @returns {{ className: string, text?: string, label?: string, hidden?: boolean } | null}
 */
export function getTileEntity(tile, activeRune) {
  if (tile === TILE.RIVER && activeRune === RUNES.MELT) {
    return { className: "entity bridge", label: "Candy bridge" };
  }

  if (tile === TILE.GUARD) {
    if (activeRune === RUNES.TINY) {
      return { className: "entity guard-tiny", text: "🍬", hidden: true };
    }
    return { className: "entity guard", label: "Lollipop guard" };
  }

  if (tile === TILE.EXIT) {
    return { className: "entity exit", text: "⭐", label: "Star candy exit" };
  }

  return null;
}

/**
 * Highlights the active rune button with glow/outline styling.
 * @param {string | null} activeRune
 */
export function updateRuneUI(activeRune) {
  const panel = document.querySelector(".runes-panel");
  if (panel) {
    panel.dataset.activeRune = activeRune ?? "none";
  }

  document.querySelectorAll(".rune-slot[data-rune]").forEach((button) => {
    const isActive = button.dataset.rune === activeRune;
    button.classList.toggle("active", isActive);
    button.classList.toggle("rune-glow", isActive);
    button.setAttribute("aria-pressed", String(isActive));

    const status = button.querySelector(".rune-status");
    if (status) {
      status.textContent = isActive ? "Active" : "Inactive";
    }
  });
}

/**
 * @param {import("./main.js").GameState} gameState
 * @param {string} rune
 * @returns {string | null}
 */
export function setActiveRune(gameState, rune) {
  gameState.activeRune = gameState.activeRune === rune ? null : rune;
  return gameState.activeRune;
}

/**
 * @param {import("./main.js").GameState} gameState
 * @param {() => void} onRuneChange
 */
export function setupRuneControls(gameState, onRuneChange) {
  document.querySelectorAll(".rune-slot[data-rune]").forEach((button) => {
    button.addEventListener("click", () => {
      const rune = button.dataset.rune;
      if (!rune) {
        return;
      }

      setActiveRune(gameState, rune);
      onRuneChange();
    });
  });

  updateRuneUI(gameState.activeRune);
}
