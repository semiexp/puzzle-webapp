import CspuzSolverModule from "./solver/cspuz/cspuz_solver_backend.js";

let CspuzSolver = null;

function solveProblem(data) {
  const url = data.url;
  const numAnswers = data.numAnswers || 0;
  const urlEncoded = new TextEncoder().encode(url);

  const solver = CspuzSolver;

  const buf = solver._malloc(urlEncoded.length);
  solver.HEAPU8.set(urlEncoded, buf);

  let ans;
  let error = undefined;

  try {
    if (numAnswers <= 0) {
      ans = solver._solve_problem(buf, urlEncoded.length);
    } else {
      ans = solver._enumerate_answers_problem(
        buf,
        urlEncoded.length,
        numAnswers,
      );
    }
  } catch (e) {
    error = e.toString();
  }
  solver._free(buf);

  if (error !== undefined) {
    self.postMessage({
      status: "internal-error",
      description: error,
    });

    // In case of error, reset the Solver to null so that it can be reloaded on the next attempt.
    CspuzSolver = null;
    return;
  }

  const length =
    solver.HEAPU8[ans] |
    (solver.HEAPU8[ans + 1] << 8) |
    (solver.HEAPU8[ans + 2] << 16) |
    (solver.HEAPU8[ans + 3] << 24);
  const resultStr = new TextDecoder().decode(
    solver.HEAPU8.slice(ans + 4, ans + 4 + length),
  );
  const result = JSON.parse(resultStr.substring(0, resultStr.length));

  self.postMessage(result);
}

self.onmessage = function (e) {
  const data = e.data;

  if (data.solver === "cspuz") {
    if (CspuzSolver) {
      solveProblem(data);
    } else {
      CspuzSolverModule().then((mod) => {
        CspuzSolver = mod;
        solveProblem(data);
      });
    }
  }
};
