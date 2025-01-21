use anchor_lang::prelude::*;

mod state;

use state::Counter;

declare_id!("6vYWimHFSh94cihmFpZ5MAT2aY1DpTCFzqnT9r7fgVDD");

#[program]
pub mod counter {
    use state::IncrementError;

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter
            .count
            .checked_add(1)
            .ok_or(IncrementError::Overflow)?;
        msg!("Counter incremented to {}", counter.count);
        Ok(())
    }

    pub fn assign(ctx: Context<Assign>, value: u64) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = value;
        msg!("Counter assigned to {}", counter.count);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}

#[derive(Accounts)]
pub struct Assign<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}
