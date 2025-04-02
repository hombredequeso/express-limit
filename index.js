const express = require('express');
// const v8 = require('node:v8');

const app = express ();

app.use(express.json());
const port = process.env.PORT || 3000;

// get memory usage

const memUsage = process.memoryUsage();
let heapTotal = memUsage.heapTotal;
let heapUsed = memUsage.heapUsed;


setInterval(() => {
  const memUsage = process.memoryUsage();
  heapUsed = memUsage.heapUsed;

}, 500);

const maxMemoryUsage = 0.8;

const shouldThrottle = () => {
  const usage = heapUsed/heapTotal;
  console.log({usage});
  return usage > maxMemoryUsage;
}

const a = new Array(0);

const increaseMemory = () => {
  const b = new Array(10000);
  b.fill(0, 0, 10000);
  a.push(b);
}


app.use((req, res, next) => {
  console.log('Time:', Date.now());
  if (shouldThrottle()) {
    res.status(429).send({'status': 'throttled'})
  } else {
    next()
  }
})

app.get("/status", (request, response) => {
  increaseMemory();
  console.log(process.memoryUsage())
   const status = {
      "Status": "Running"
   };
   
   response.send(status);
});


app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});



//node running in docker container --memory='512m'
//root@bb8a4e7ba236:/# cat /sys/fs/cgroup/memory.max    
//536,870,912
//
//
//{
//  rss: 57,458,688,
//  heapTotal: 6,840,320,
//  heapUsed: 4,995,512,
//  external: 2,286,297,
//  arrayBuffers: 10488
//}
//
//
//{
//  rss: 67,026,944,
//  heapTotal: 15,110,144,
//  heapUsed: 13,155,712,
//  external: 2,286,345,
//  arrayBuffers: 10,496
//}
//
//
//{
//  rss: 147,587,072,
//  heapTotal: 96,428,032,
//  heapUsed: 93,123,328,
//  external: 2,286,336,
//  arrayBuffers: 10,487
//}
//
//
//{
//  rss: 296,136,704,
//  heapTotal: 247377920,
//  heapUsed: 245800240,
//  external: 2286420,
//  arrayBuffers: 10572
//}
//
//
//{
//  total_heap_size: 247,640,064,
//  total_heap_size_executable: 524288,
//  total_physical_size: 246861824,
//  total_available_size: 26,688,872,
//  used_heap_size: 245,768,560,
//  heap_size_limit: 271,581,184,
//  malloced_memory: 409720,
//  peak_malloced_memory: 924112,
//  does_zap_garbage: 0,
//  number_of_native_contexts: 2,
//  number_of_detached_contexts: 0,
//  total_global_handles_size: 8192,
//  used_global_handles_size: 4992,
//  external_memory: 2302285
//}
