extern crate lalrpop;

fn main() {
  println!("cargo:rerun-if-changed=src/api.lalrpop");
  lalrpop::process_root().unwrap();
}
