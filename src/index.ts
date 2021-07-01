// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ErrorEvaluator = (error: any) => boolean;
export type IncrementResolver = (lastValue: number) => number;
export type RetriableFunction<R = void> = (() => Promise<R>) | (() => R);

export type InsistentOptions = {
  retryWhen?: ErrorEvaluator;
  maxRetries?: number;
  retryInterval?: number;

  incrementIntervalWith?: IncrementResolver;
}

function sleep(duration: number): Promise<void> {
  return new Promise(r => setTimeout(r, duration));
}

export async function insistOn<R = void>(targetFn: RetriableFunction<R>, options: InsistentOptions = {}): Promise<R> {
  const shouldRetry = options.retryWhen ?? (() => true);
  const retryCount = options.maxRetries ?? 3;
  const retryInterval = options.retryInterval ?? 0;
  const getNextInterval = options.incrementIntervalWith ?? (last => last);

  if (retryInterval < 0) {
    throw new RangeError("retryInterval must be greater than or equal 0");
  }

  try {
    // TODO: Call targetFn with some running metadata
    return await targetFn();
  } catch (error) {
    if (retryCount <= 0 || !shouldRetry(error)) {
      throw error;
    }

    if (retryInterval > 0) {
      await sleep(retryInterval);
    }

    return await insistOn(targetFn, {
      ...options,
      maxRetries: retryCount - 1,
      retryInterval: getNextInterval(retryInterval),
    });
  }
}

export function createInsistent(defaultOptions: InsistentOptions): (typeof insistOn) {
  return (fn, options = {}) => insistOn(fn, { ...defaultOptions, ...options });
}
