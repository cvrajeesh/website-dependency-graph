const EXTERNAL_URL_REGEX = /^(?:\w+:)?\/\/(\S+)$/;
const ANCHOR_REGEXP = /^#/;
const SCHEME_REGEXP = /^[a-z][a-z0-9\-+.]*:/i;

export const isAssetUrl = (url: string) => {
  return !(
    EXTERNAL_URL_REGEX.test(url) ||
    ANCHOR_REGEXP.test(url) ||
    SCHEME_REGEXP.test(url)
  );
};

export type Task = () => Promise<void>;

export class TaskQueue {
  private taskQueue: Task[] = [];
  private isCancelled = false;

  /**
   * TaskQueue constructor
   * @param concurrency Max number of tasks to run at a time
   * @param waitDelay Delay between checking task status
   */
  constructor(private concurrency = 1, private waitDelay = 50) {}

  private sleep(delay: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  push(task: Task) {
    this.taskQueue.push(task);
  }

  async run() {
    this.isCancelled = false;
    let runningTasks = 0;

    const runTask = (task?: Task) => {
      if (task) {
        runningTasks++;
        task().then(() => {
          runningTasks--;
        });
      }
    };

    // Start off with max concurrency
    for (
      let index = 0;
      index < this.concurrency && this.taskQueue.length > 0;
      index++
    ) {
      runTask(this.taskQueue.shift());
    }

    while (
      (this.taskQueue.length > 0 || runningTasks > 0) &&
      !this.isCancelled
    ) {
      if (runningTasks < this.concurrency && this.taskQueue.length > 0) {
        runTask(this.taskQueue.shift());
      } else {
        await this.sleep(this.waitDelay);
      }
    }
  }

  stop() {
    this.isCancelled = true;
    this.taskQueue.splice(0);
  }
}
