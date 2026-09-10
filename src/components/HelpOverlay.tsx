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
          <kbd>t</kbd><span>cycle theme: night shift → day shift → warehouse → dispatch → maintenance</span>
          <kbd>b</kbd><span>toggle board mode (kiosk density)</span>
          <kbd>esc</kbd><span>collapse service detail / close this</span>
          <kbd>drag</kbd><span>the driver dot re-routes to the nearest street</span>
        </div>
        <div className="egg">
          <b>▲ dispatch command</b> · the board listens for one four-letter word every warehouse dreads on a friday evening. type it anywhere.
        </div>
      </div>
    </div>
  );
}
