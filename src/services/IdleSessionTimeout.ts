import { IIdleSessionTimeout } from "../contracts/IIdleSessionTimeout";
const defaultResetEvents = [
  "load",
  "mousemove",
  "mousedown",
  "mouseup",
  "keypress",
  "DOMMouseScroll",
  "mousewheel",
  "MSPointerMove",
  "click",
  "scroll",
  "touchstart",
  "touchmove",
  "touchend"
];

export class IdleSessionTimeout implements IIdleSessionTimeout {
  constructor(timeSpan: number, ...resetEvents: string[]) {
    this._timeSpan = timeSpan;
    this._resetEvents =
      resetEvents.length == 0 ? defaultResetEvents : resetEvents;
  }

  private _timeSpan: number;
  private _resetEvents: string[];
  private _timerId?: number;
  private _timeLeftChangeEvent?: number;
  private _restTime?: number;

  public start = (): void => {
    if (this.onTimeOut === undefined) {
      console.error("Missing onTimeOut method");
      return;
    }
    for (const event of this._resetEvents) {
      window.addEventListener(event, this.reset);
    }

    if (this.onTimeLeftChange !== undefined) {
      this._timeLeftChangeEvent = window.setInterval(
        this._onTimeLeftChange,
        1000
      );
    }
    this.reset();
  };

  public onTimeLeftChange?: (timeLeft: number) => void;

  public onTimeOut?: () => void;

  public reset = (): void => {
    if (this._timerId !== undefined) {
      window.clearTimeout(this._timerId);
    }
    this._timerId = window.setTimeout(this._onTimeOut, this._timeSpan);
    this._restTime = Date.now();
  };

  public dispose = (): void => {
    for (const event of this._resetEvents) {
      window.removeEventListener(event, this.reset);
    }

    if (this._timerId !== undefined) {
      window.clearTimeout(this._timerId);
    }

    if (this._timeLeftChangeEvent !== undefined) {
      window.clearInterval(this._timeLeftChangeEvent);
    }
  };

  public getTimeLeft = (): number => {
    return this._timeSpan - (Date.now() - this._restTime!) ;
  };

  private _onTimeOut = (): void => {
    this.onTimeOut!();
    this.dispose();
  };

  private _onTimeLeftChange = (): void => {
    this.onTimeLeftChange!(this.getTimeLeft());
  };
}
