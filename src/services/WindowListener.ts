import { IWindowListener } from "../contracts/IWindowListener";

export class WindowListener implements IWindowListener {
  private _resetMethod: () => void;
  private _window: Window | Document;
  private _resetEvents: string[];

  constructor(
    window: Window | Document,
    events: string[],
    resetMethod: () => void
  ) {
    this._window = window;
    this._resetEvents = events;
    this._resetMethod = resetMethod;
  }

  public initialise = (): void => {
    for (const event of this._resetEvents) {
      try {
        this._window.addEventListener(event, this._resetMethod);
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.error("[idle-session-TimeOut] could not watch window : ");
        // tslint:disable-next-line: no-console
        console.error(error);
      }
    }
  }

  public dispose = (): void => {
    for (const event of this._resetEvents) {
      try {
        this._window.removeEventListener(event, this._resetMethod);
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.error("[idle-session-TimeOut] could not dispose : " + event);
        // tslint:disable-next-line: no-console
        console.error(error);
      }
    }
  }
}
