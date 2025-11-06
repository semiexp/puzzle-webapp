import Module from "./generator/cspuz_gen.js";

let Generator = null;

function generateProblem(request) {
  if (!("seed" in request) || request.seed === undefined) {
    const seed = Math.floor(Math.random() * (2 ** 53));
    request = { ...request, seed };
  }
  const requestJson = JSON.stringify(request);
  const requestEncoded = new TextEncoder().encode(requestJson);
  const buf = Generator._malloc(requestEncoded.length);
  Generator.HEAPU8.set(requestEncoded, buf);

  let res = Generator._generate_problem(
    buf,
    requestEncoded.length,
  );
  Generator._free(buf);

  const length =
    Generator.HEAPU8[res] |
    (Generator.HEAPU8[res + 1] << 8) |
    (Generator.HEAPU8[res + 2] << 16) |
    (Generator.HEAPU8[res + 3] << 24);
  const resultStr = new TextDecoder().decode(
    Generator.HEAPU8.slice(res + 4, res + 4 + length),
  );
  const result = JSON.parse(resultStr.substring(0, resultStr.length));

  self.postMessage(result);
}

self.onmessage = function (e) {
  const data = e.data;
  if (Generator) {
    generateProblem(data);
  } else {
    Module().then((mod) => {
      Generator = mod;
      generateProblem(data);
    });
  }
};

Module().then((mod) => {
  Generator = mod;
});
