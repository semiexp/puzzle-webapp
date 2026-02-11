import Worker from "./solverWorker?worker";

let worker = null;
let currentResolve = null;
let currentUrl = null;

export function solveProblem(url, numAnswers) {
  if (worker === null) {
    worker = new Worker();
  }
  if (currentResolve !== null) {
    return new Promise((resolve) => {
      resolve({
        status: "error",
        url,
        error: "solver already running",
      });
    });
  }
  currentUrl = url;
  return new Promise((resolve) => {
    const start = Date.now();
    worker.onmessage = (e) => {
      currentResolve = null;

      if (e.data["status"] == "ok") {
        resolve({
          status: "success",
          url,
          result: e.data["description"],
          elapsed: Date.now() - start,
        });
      } else if (e.data["status"] == "error") {
        const description = e.data["description"];

        if (description === "no answer") {
          resolve({
            status: "noAnswer",
            url,
          });
        } else {
          resolve({
            status: "error",
            url,
            error: description,
          });
        }
      } else if (e.data["status"] == "internal-error") {
        resolve({
          status: "internal-error",
          url,
          error: e.data["description"],
        });
      }
    };
    worker.postMessage({ url, numAnswers });
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
      url: currentUrl,
    });
  }
}
