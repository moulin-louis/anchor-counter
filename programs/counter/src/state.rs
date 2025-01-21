use anchor_lang::prelude::*;
#[account]
pub struct Counter {
    pub count: u64,
}

#[error_code]
pub enum IncrementError {
    #[msg("Runtime Increment Overflow")]
    Overflow,
}
