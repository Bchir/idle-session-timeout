export interface IIdleSessionTimeout {
  start: () => void;
  onTimeLeftChange?: (timeLeft: number) => void;
  onTimeOut?: () => void;
  dispose: () => void;
  reset: () => void;
  getTimeLeft: () => number;
  registerIFrame: (element: HTMLIFrameElement) => void;
}
