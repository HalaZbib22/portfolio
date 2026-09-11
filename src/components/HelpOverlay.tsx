"use client";

export function HelpOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="dialog" role="dialog" aria-modal aria-label="Dispatch help" onClick={(e) => e.stopPropagation()}>
        <div className="tab">?? · DISPATCH HELP</div>
        <button className="close" onClick={onClose}>ESC CLOSE</button>
        <div className="keys">
          <kbd>1 – 5</kbd><span>jump to section 01 OPERATOR … 05 CERTIFICATIONS</span>
          <kbd>j / k</kbd><span>scroll the board down / up</span>
          <kbd>t</kbd><span>cycle theme: night shift → day shift → warehouse → dispatch → maintenance → cold storage</span>
          <kbd>b</kbd><span>toggle board mode (kiosk density)</span>
          <kbd>esc</kbd><span>collapse service detail / close this</span>
          <kbd>feed</kbd><span>· play · nap · clean: Mochi is a tamagotchi. her stats decay in real time, even while you are away, and persist in this browser. play alternates the wind-up mouse and the yarn ball</span>
          <kbd>click</kbd><span>the cat on the bottom rail. she watches the cursor and naps when you stop moving</span>
        </div>
        <div className="egg">
          <b>▲ station command</b> · the console listens for one five-letter name. type it anywhere for zoomies.
        </div>
      </div>
    </div>
  );
}
