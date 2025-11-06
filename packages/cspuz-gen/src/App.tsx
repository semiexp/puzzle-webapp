import React from "react";
import { generateProblem, terminateWorker, Symmetry } from "./generatorBackend";
import type { GeneratorResult } from "./generatorBackend";

function App() {
  const [height, setHeight] = React.useState(10);
  const [width, setWidth] = React.useState(10);
  const [seed, setSeed] = React.useState<number | undefined>(undefined);
  const [symmetry, setSymmetry] = React.useState<Symmetry>(Symmetry.Rotate180);
  const [generating, setGenerating] = React.useState(false);
  const [result, setResult] = React.useState<GeneratorResult | undefined>(
    undefined,
  );

  const handleGenerate = async () => {
    setResult(undefined);
    setGenerating(true);

    const result = await generateProblem("slitherlink", {
      height,
      width,
      seed,
      symmetry,
    });
    setResult(result);
    setGenerating(false);
  };

  const handleStop = () => {
    terminateWorker();
    setGenerating(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Puzzle Generator</h1>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Height:{" "}
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value) || 10)}
              min="1"
              max="50"
              disabled={generating}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Width:{" "}
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value) || 10)}
              min="1"
              max="50"
              disabled={generating}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Seed (optional):{" "}
            <input
              type="number"
              value={seed ?? ""}
              onChange={(e) =>
                setSeed(e.target.value ? parseInt(e.target.value) : undefined)
              }
              placeholder="Random"
              disabled={generating}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Symmetry:{" "}
            <select
              value={symmetry}
              onChange={(e) => setSymmetry(e.target.value as Symmetry)}
              disabled={generating}
            >
              <option value={Symmetry.None}>None</option>
              <option value={Symmetry.HorizontalLine}>Horizontal Line</option>
              <option value={Symmetry.VerticalLine}>Vertical Line</option>
              <option value={Symmetry.Rotate180}>Rotate 180°</option>
              <option value={Symmetry.Rotate90}>Rotate 90°</option>
            </select>
          </label>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        {!generating ? (
          <button onClick={handleGenerate}>Generate</button>
        ) : (
          <button onClick={handleStop}>Stop</button>
        )}
      </div>

      {generating && <p>Generating...</p>}

      {result && (
        <div style={{ marginTop: "20px" }}>
          {result.status === "success" && (
            <div>
              <p style={{ color: "green" }}>Generated in {result.elapsed}ms</p>
              <p>
                URL:{" "}
                <a href={result.url} target="_blank" rel="noopener noreferrer">
                  {result.url}
                </a>
              </p>
            </div>
          )}
          {result.status === "error" && (
            <p style={{ color: "red" }}>Error: {result.error}</p>
          )}
          {result.status === "terminated" && (
            <p style={{ color: "orange" }}>Generation terminated</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
