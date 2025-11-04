use serde::{Deserialize, Serialize};
use cspuz_rs_puzzles::puzzles::slitherlink::{serialize_problem, solve_slitherlink};

use rand::SeedableRng;

#[derive(Serialize, Deserialize, Debug)]
pub struct GenerateRequest {
    pub height: usize,
    pub width: usize,
    pub seed: Option<u64>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GenerateResponse {
    pub url: String,
}

pub fn generate_slitherlink(request: &GenerateRequest) -> GenerateResponse {
    let seed = request.seed.unwrap_or(0);
    let mut rng = rand::rngs::StdRng::seed_from_u64(seed);

    let pattern = vec![
        vec![cspuz_rs::generator::Choice::new(vec![None, Some(0), Some(1), Some(2), Some(3)], None);
            request.width];
        request.height
    ];
    let generated = cspuz_rs::generator::Generator::new(
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
        cspuz_rs::generator::default_uniqueness_checker(),
        cspuz_rs::generator::default_scorer(None, 5.0),
    ).generate(&mut rng);

    if let Some(generated) = generated {
        let problem_str = serialize_problem(&generated);
        // Here we would normally upload the problem to a server and get a URL.
        // For this example, we'll just return a placeholder URL.
        GenerateResponse {
            url: problem_str.unwrap(),
        }
    } else {
        GenerateResponse {
            url: "failed".to_string(),
        }
    }
}

static mut SHARED_ARRAY: Vec<u8> = Vec::new();

#[no_mangle]
pub fn generate_slitherlink_problem(request_json: *const u8, len: usize) -> *const u8 {
    let config = cspuz_core::config::Config {
        optimize_polarity: true,
        ..cspuz_core::config::Config::default()
    };
    cspuz_core::config::Config::set_default(config);

    let request_json = unsafe { std::slice::from_raw_parts(request_json, len) };
    let request: GenerateRequest = serde_json::from_slice(request_json).unwrap(); // TODO: handle error

    let response = generate_slitherlink(&request);
    let response_str = serde_json::to_string(&response).unwrap(); // TODO: handle error

    unsafe {
        let response_len = response_str.len();

        SHARED_ARRAY.clear();
        SHARED_ARRAY.push((response_len & 0xFF) as u8);
        SHARED_ARRAY.push(((response_len >> 8) & 0xFF) as u8);
        SHARED_ARRAY.push(((response_len >> 16) & 0xFF) as u8);
        SHARED_ARRAY.push(((response_len >> 24) & 0xFF) as u8);
        SHARED_ARRAY.extend(response_str.as_bytes());
        SHARED_ARRAY.as_ptr()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic(expected = "not yet implemented")]
    fn test_generate_slitherlink() {
        let request = GenerateRequest {
            height: 10,
            width: 10,
            seed: Some(42),
        };
        let _response = generate_slitherlink(&request);
    }
}
