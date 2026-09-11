"use client";

export function HelpOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="dialog" role="dialog" aria-modal aria-label="Controls" onClick={(e) => e.stopPropagation()}>
        <div className="tab">?? · CONTROLS</div>
        <button className="close" onClick={onClose}>ESC CLOSE</button>
        <div className="keys">
          <kbd>1 – 5</kbd><span>jump to 01 PLAYER … 05 ACHIEVEMENTS</span>
          <kbd>j / k</kbd><span>scroll the board down / up</span>
          <kbd>t</kbd><span>cycle theme: midnight → daylight → game boy → arcade → bubblegum → glacier</span>
          <kbd>b</kbd><span>toggle board mode (kiosk density)</span>
          <kbd>esc</kbd><span>collapse service detail / close this</span>
          <kbd>A B C</kbd><span>Mochi is a tamagotchi. click the device once, then press A to select an icon, B to confirm, C to cancel (← → ↵ ⌫ work too). she gets hungry, bored and messy in real time, even while you are away, and remembers you in this browser</span>
          <kbd>click</kbd><span>the cat on the bottom rail. she watches the cursor and naps when you stop moving</span>
        </div>
        <div className="egg">
          <b>▲ cheat code</b> · the console listens for one five-letter name. type it anywhere for zoomies.
        </div>
      </div>
    </div>
  );
}
