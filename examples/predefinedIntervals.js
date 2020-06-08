const { insistOn } = require('../dist');

const INTERVALS = [
  1000,
  2000,
  5000,
  10000,
];

(async () => {
  try {
    const result = await insistOn({
      task: () => {
        console.log(`Running function... ${new Date()}`);

        if (Math.random() < 0.8) throw new Error('Not this time.');

        return 'It works!';
      },

      maxRetries: Infinity,
      retryInterval: INTERVALS[0],
      incrementIntervalWith: (lastInterval) => {
        const nextIndex = INTERVALS.indexOf(lastInterval) + 1;
        return INTERVALS[nextIndex % INTERVALS.length];
      },
    });

    console.log(`Success: ${result}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
})();
