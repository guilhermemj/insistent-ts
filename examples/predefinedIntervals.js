const { createInsistent } = require('../dist');

const INTERVALS = [
  1000,
  2000,
  5000,
  10000,
];

(async () => {
  try {
    const insistWithIntervals = createInsistent({
      maxRetries: Infinity,
      retryInterval: INTERVALS[0],
      incrementIntervalWith: (lastInterval) => {
        const nextIndex = INTERVALS.indexOf(lastInterval) + 1;
        return INTERVALS[nextIndex % INTERVALS.length];
      },
    });

    const result = await insistWithIntervals(() => {
      console.log(`Running function... ${new Date()}`);

      if (Math.random() < 0.8) throw new Error('Not this time.');

      return 'It works!';
    });

    console.log(`Success: ${result}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
})();
