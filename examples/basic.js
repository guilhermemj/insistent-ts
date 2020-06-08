const { insistOn } = require('../dist');

(async () => {
  try {
    const result = await insistOn({
      task: () => {
        const factor = Math.random();
        console.log(`Running task with factor ${factor}`);

        if (factor < 0.2) throw new Error('Epic Failure.');
        if (factor < 0.8) throw new Error('We may try again...');

        return 'It works!';
      },

      retryWhen: (error) => error.message === 'We may try again...',
      retryInterval: 1000,
      maxRetries: 10,
    });

    console.log(`Success: ${result}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
})();
