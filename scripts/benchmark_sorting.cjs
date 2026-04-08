const { performance } = require('perf_hooks');

const comments = Array.from({ length: 100 }, (_, i) => ({
  id: i.toString(),
  upvotes: Math.floor(Math.random() * 100),
}));

const iterations = 10000;
const start = performance.now();
for (let i = 0; i < iterations; i++) {
  const sorted = [...comments].sort((a, b) => b.upvotes - a.upvotes);
}
const end = performance.now();
console.log(`Time taken for ${iterations} sorts of 100 comments: ${(end - start).toFixed(4)}ms`);
console.log(`Average time per sort: ${((end - start) / iterations).toFixed(4)}ms`);
