import Worker from "./generatorWorker?worker";

export const Symmetry = {
  None: "None",
  HorizontalLine: "HorizontalLine",
  VerticalLine: "VerticalLine",
  Rotate180: "Rotate180",
  Rotate90: "Rotate90",
};

let worker = null;
let currentResolve = null;
let currentRequest = null;

export function generateSlitherlink(height, width, seed, symmetry) {
  if (worker === null) {
    worker = new Worker();
  }
  if (currentResolve !== null) {
    return new Promise((resolve) => {
      resolve({
        status: "error",
        error: "generator already running",
      });
    });
  }
  const request = { height, width, seed, symmetry };
  currentRequest = request;
  return new Promise((resolve) => {
    const start = Date.now();
    worker.onmessage = (e) => {
      currentResolve = null;

      if (typeof e.data === "string" && e.data.startsWith("error")) {
        resolve({
          status: "error",
          error: e.data,
        });
      } else if (e.data && e.data.url) {
        resolve({
          status: "success",
          url: e.data.url,
          elapsed: Date.now() - start,
        });
      } else {
        resolve({
          status: "error",
          error: "unexpected response format",
        });
      }
    };
    worker.postMessage(request);
    currentResolve = resolve;
  });
}

export function terminateWorker() {
  if (worker === null) return;
  worker.terminate();
  worker = null;

  if (currentResolve !== null) {
    const resolve = currentResolve;
    currentResolve = null;
    resolve({
      status: "terminated",
    });
  }
}
