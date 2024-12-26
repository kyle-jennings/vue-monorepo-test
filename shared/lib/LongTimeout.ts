/**
 * Inspired by:
 * https://stackoverflow.com/a/57981688
 */
export default class {
  private intervalId: null | number | undefined = null;
  private timeoutInMs = (240 * 60 * 1000);
  private timeoutWarningInMs: number;
  private isRunning = false;
  private startTime = 0 ;
  private warningReached = false;
  private startTimerCallback;
  private timeoutCallback;
  private warningCallback;
  private intervalCallback;

  constructor({
    timeoutInMinutes = 240,
    timeoutWarningInMinutes = 0.5,
    startTimerCallback = () => {},
    timeoutCallback = () => {},
    warningCallback = () => {},
    intervalCallback = null,
  }) {
    this.startTimerCallback = startTimerCallback;
    this.timeoutCallback = timeoutCallback;
    this.warningCallback = warningCallback;
    this.intervalCallback = intervalCallback;

    this.timeoutInMs = timeoutInMinutes * 60 * 1000; // default is 4 hours
    // warning default is 30 seconds before the timeout
    this.timeoutWarningInMs = this.timeoutInMs - (timeoutWarningInMinutes * 60 * 1000);
    this.initVariables();
  }

  initVariables() {
    if (this.intervalId) clearInterval(this.intervalId);

    this.isRunning = false;
    this.startTime = 0;
    this.warningReached = false;
    this.intervalId = null;
  }

  intervalCheck() {
    if (this.intervalCallback) {
      this.intervalCallback({
        selfAdjustedTime: this.getElaspedTime(),
        timeoutTarget: this.timeoutInMs,
        lastChanceTarget: this.timeoutWarningInMs
      });
    }

    const elaspedMs = Math.round(this.getElaspedTime());
    if (elaspedMs >= this.timeoutInMs) {
      this.stop();
      this.timeoutCallback(this.timeoutInMs);
    } else if (elaspedMs >= this.timeoutWarningInMs && !this.warningReached) {
      this.warningReached = true;
      this.warningCallback(this.timeoutWarningInMs);
    }
  }

  start() {
    if (this.isRunning) {
      return console.error('Timer is already running');
    }

    this.isRunning = true;
    this.startTime = Date.now();
    this.intervalId = setInterval(this.intervalCheck.bind(this), 1000);
    this.startTimerCallback(this.startTime);

    return false;
  }

  stop() {
    if (this.isRunning) {
      this.initVariables();
    } else {
      console.error('Timer is already stopped');
    }
  }

  reset() {
    this.initVariables();
    this.start();
  }

  getAdjustedElapsedTime() {
    return !this.startTime ? 0 : Date.now() - this.startTime;
  }

  getElaspedTime() {
    if (!this.startTime) return 0;
    if (this.isRunning) return this.getAdjustedElapsedTime();
    return 0;
  }
}
