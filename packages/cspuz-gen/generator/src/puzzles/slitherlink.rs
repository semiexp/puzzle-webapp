use rand::SeedableRng;
use serde::{Deserialize, Serialize};

use cspuz_rs::generator;
use cspuz_rs_puzzles::puzzles::slitherlink::{serialize_problem, solve_slitherlink};

use crate::{GenerateResponse, Symmetry};

#[derive(Serialize, Deserialize, Debug)]
pub struct SlitherlinkGenerateRequest {
    pub height: usize,
    pub width: usize,
    pub seed: u64,
    pub symmetry: Option<Symmetry>,
}

pub fn generate_slitherlink(request: &SlitherlinkGenerateRequest) -> GenerateResponse {
    let seed = request.seed;
    let mut rng = rand::rngs::StdRng::seed_from_u64(seed);

    let symmetry = request.symmetry.unwrap_or(Symmetry::Rotate180).into();

    let pattern = generator::Grid::new(
        request.height,
        request.width,
        &[None, Some(0), Some(1), Some(2), Some(3)],
        None,
        symmetry,
    );

    let generated = generator::Generator::new(
        |problem: &Vec<Vec<Option<i32>>>| {
            for y in 1..problem.len() {
                for x in 1..problem[0].len() {
                    let mut cnt = 0;
                    if problem[y - 1][x - 1] == Some(0) {
                        cnt += 1;
                    }
                    if problem[y - 1][x] == Some(0) {
                        cnt += 1;
                    }
                    if problem[y][x - 1] == Some(0) {
                        cnt += 1;
                    }
                    if problem[y][x] == Some(0) {
                        cnt += 1;
                    }
                    if cnt >= 2 {
                        return None;
                    }
                }
            }
            solve_slitherlink(problem)
        },
        pattern,
        generator::default_uniqueness_checker(),
        generator::default_scorer(None, 5.0),
    )
    .generate(&mut rng);

    if let Some(generated) = generated {
        let problem_str = serialize_problem(&generated);
        // Here we would normally upload the problem to a server and get a URL.
        // For this example, we'll just return a placeholder URL.
        GenerateResponse { url: problem_str }
    } else {
        GenerateResponse { url: None }
    }
}
