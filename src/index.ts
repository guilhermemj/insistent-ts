type RetriableFunction<R> = (() => Promise<R>) | (() => R);
type ErrorEvaluator = (error: any) => boolean;
type IncrementResolver = (lastValue: number) => number;

export type InsistentOptions<R> = {
  task: RetriableFunction<R>;

  retryWhen?: ErrorEvaluator;
  maxRetries?: number;
  retryInterval?: number;

  incrementIntervalWith?: IncrementResolver;
}

const sleep = (duration: number): Promise<void> => new Promise(r => setTimeout(r, duration));

export async function insistOn<R = void>(options: InsistentOptions<R>): Promise<R> {
  const targetFn = options.task;
  const shouldRetry = options.retryWhen ?? (() => true);
  const retryCount = options.maxRetries ?? 3;
  const retryInterval = options.retryInterval ?? 0;
  const getNextInterval = options.incrementIntervalWith ?? (last => last);

  try {
    // TODO: Call targetFn with some running metadata
    return await targetFn();
  } catch (error) {
    if (retryCount <= 0 || !shouldRetry(error)) {
      throw error;
    }

    await sleep(retryInterval);

    return await insistOn({
      ...options,
      maxRetries: retryCount - 1,
      retryInterval: getNextInterval(retryInterval),
    });
  }
}
