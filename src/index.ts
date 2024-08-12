import { runA } from './subgraph-a';
import { runB } from './subgraph-b';

(async () => {
  const serverA = await runA();
  const serverB = await runB();

  const gracefulShutdown = async () => {
    await serverA.stop();
    await serverB.stop();
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
})();
