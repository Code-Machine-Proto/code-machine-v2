// simulator/src/lib.rs
use serde::Serialize;
use wasm_bindgen::prelude::*;

pub mod compiler;
pub mod engine;
pub mod types;

fn to_js<T: Serialize>(value: &T) -> Result<JsValue, JsValue> {
    let serializer = serde_wasm_bindgen::Serializer::new().serialize_maps_as_objects(true);
    value
        .serialize(&serializer)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub fn compile(source: &str, processor_id: u8) -> Result<JsValue, JsValue> {
    let pid = types::ProcessorId::from_u8(processor_id)
        .ok_or_else(|| JsValue::from_str("Invalid processor ID"))?;
    let result = compiler::compile(source, pid);
    to_js(&result)
}

#[wasm_bindgen]
pub fn simulate(program: &[u32], processor_id: u8) -> Result<JsValue, JsValue> {
    let pid = types::ProcessorId::from_u8(processor_id)
        .ok_or_else(|| JsValue::from_str("Invalid processor ID"))?;
    let result = engine::simulate(program, pid, None);
    to_js(&result)
}
