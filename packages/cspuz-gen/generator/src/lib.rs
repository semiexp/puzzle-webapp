use cspuz_rs::generator;
use serde::{Deserialize, Serialize};

mod puzzles;
use puzzles::*;

#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq)]
pub enum Symmetry {
    None,
    HorizontalLine,
    VerticalLine,
    Rotate180,
    Rotate90,
}

impl From<Symmetry> for generator::Symmetry {
    fn from(s: Symmetry) -> Self {
        match s {
            Symmetry::None => generator::Symmetry::None,
            Symmetry::HorizontalLine => generator::Symmetry::HorizontalLine,
            Symmetry::VerticalLine => generator::Symmetry::VerticalLine,
            Symmetry::Rotate180 => generator::Symmetry::Rotate180,
            Symmetry::Rotate90 => generator::Symmetry::Rotate90,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "type")]
pub enum GenerateRequest {
    #[serde(rename = "slitherlink")]
    Slitherlink(slitherlink::SlitherlinkGenerateRequest),
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GenerateResponse {
    pub url: String,
}

static mut SHARED_ARRAY: Vec<u8> = Vec::new();

#[no_mangle]
pub fn generate_problem(request_json: *const u8, len: usize) -> *const u8 {
    let config = cspuz_core::config::Config {
        optimize_polarity: true,
        ..cspuz_core::config::Config::default()
    };
    cspuz_core::config::Config::set_default(config);

    let request_json = unsafe { std::slice::from_raw_parts(request_json, len) };
    let request: GenerateRequest = serde_json::from_slice(request_json).unwrap(); // TODO: handle error

    let response = match request {
        GenerateRequest::Slitherlink(req) => slitherlink::generate_slitherlink(&req),
    };
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
