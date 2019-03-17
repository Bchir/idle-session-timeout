import { defaultResetEvents } from "../consts/defaultResetEvents";
import { IIdleSessionTimeout } from "../contracts/IIdleSessionTimeout";
import { IWindowListener } from "../contracts/IWindowListener";
import { WindowListener } from "./WindowListener";

export class IdleSessionTimeout implements IIdleSessionTimeout {
  public onTimeLeftChange?: (timeLeft: number) => void;
  public onTimeOut?: () => void;

  private _isActive: boolean = false;
  private _timeSpan: number;
  private _timerId?: number;
  private _timeLeftChangeEvent?: number;
  private _restTime?: number;
  private _resetEvents: string[];
  private _windows: IWindowListener[] = [];

  constructor(timeSpan: number, ...resetEvents: string[]) {
    this._timeSpan = timeSpan;
    this._resetEvents =
      resetEvents.length === 0 ? defaultResetEvents : resetEvents;
    this._windows.push(
      new WindowListener(window, this._resetEvents, this.reset)
    );
  }

  public start = (): void => {
    this._isActive = true;
    if (this.onTimeOut === undefined) {
      // tslint:disable-next-line: no-console
      console.error("Missing onTimeOut method");
      return;
    }

    for (const _window of this._windows) {
      _window.initialise();
    }

    if (this.onTimeLeftChange !== undefined) {
      this._timeLeftChangeEvent = window.setInterval(
        this._onTimeLeftChange,
        1000
      );
    }
    this.reset();
  }

  public reset = (): void => {
    if (this._timerId !== undefined) {
      window.clearTimeout(this._timerId);
    }
    this._timerId = window.setTimeout(this._onTimeOut, this._timeSpan);
    this._restTime = Date.now();
  }

  public dispose = (): void => {
    this._isActive = false;
    for (const _window of this._windows) {
      _window.dispose();
    }

    if (this._timerId !== undefined) {
      window.clearTimeout(this._timerId);
    }

    if (this._timeLeftChangeEvent !== undefined) {
      window.clearInterval(this._timeLeftChangeEvent);
    }
  }

  public getTimeLeft = (): number => {
    return this._timeSpan - (Date.now() - this._restTime!);
  }

  public registerIFrame = (element: HTMLIFrameElement): void => {
    if (element !== null && element !== undefined) {
      setTimeout(() => {
        this._registerFrame(element);
      }, 1000);
    } else {
      // tslint:disable-next-line: no-console
      throw console.error("[idle-session-timeout] element is null or not defined");
    }
  }

  private _onTimeOut = (): void => {
    this.onTimeOut!();
    this.dispose();
  }

  private _onTimeLeftChange = (): void => {
    this.onTimeLeftChange!(this.getTimeLeft());
  }

  private _registerFrame(element: HTMLIFrameElement) {
    const frameDocument =
      element.contentDocument ||
      (element.contentWindow && element.contentWindow.document);
    const listener = new WindowListener(
      frameDocument!,
      this._resetEvents,
      this.reset
    );
    const index = this._windows.push(listener) - 1;
    if (this._isActive) {
      this._windows[index].initialise();
    }
  }
}
