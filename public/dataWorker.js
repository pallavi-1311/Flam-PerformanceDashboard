// public/dataWorker.js
self.totalCount = 0;
self.currentData = [];

function generateDataPoint(lastTimestamp) {
  const timestamp = lastTimestamp + 100;
  const value = Math.sin(timestamp / 10000) * 50 + Math.random() * 20 + 50;
  const categories = ['A', 'B', 'C', 'D', 'E'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  return { timestamp, value, category };
}

function generateInitialDataset(count) {
  const data = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    data.push({
      timestamp: now - (count - i) * 100,
      value: Math.sin(i / 100) * 50 + Math.random() * 20 + 50,
      category: ['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)]
    });
  }
  return data;
}
console.log('[Worker] Ready and waiting for messages...');

self.onmessage = (e) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'GENERATE_INITIAL': {
    const { count } = payload;
    const data = generateInitialDataset(count);
    self.currentData = data;
    self.totalCount = data.length;
    console.log('[Worker] Sending INITIAL_DATA', self.totalCount);
    self.postMessage({ type: 'INITIAL_DATA', data, totalCount: self.totalCount });
    break;
  }

  case 'GENERATE_POINT': {
    const { lastTimestamp } = payload;
    const point = generateDataPoint(lastTimestamp);
    self.currentData.push(point);
    self.totalCount++;
    console.log('[Worker] Sending NEW_POINT total =', self.totalCount);
    self.postMessage({ type: 'NEW_POINT', point, totalCount: self.totalCount });
    break;
  }


    // 📊 Aggregate
    case 'AGGREGATE': {
      const { data, periodMs } = payload;
      const buckets = new Map();

      data.forEach((p) => {
        const bucket = Math.floor(p.timestamp / periodMs) * periodMs;
        const existing = buckets.get(bucket);
        if (existing) {
          existing.sum += p.value;
          existing.count++;
        } else {
          buckets.set(bucket, { sum: p.value, count: 1, category: p.category });
        }
      });

      const aggregated = Array.from(buckets.entries()).map(([timestamp, { sum, count, category }]) => ({
        timestamp,
        value: sum / count,
        category
      }));

      self.postMessage({ type: 'AGGREGATED', data: aggregated });
      break;
    }

    default:
      console.warn('[Worker] Unknown type:', type);
  }
};
