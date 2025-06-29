module carbon_marketplace::sui_payments {
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, UID};
    use std::string::{Self, String};

    // ===== Error Codes =====
    const E_INSUFFICIENT_BALANCE: u64 = 0;
    const E_INVALID_AMOUNT: u64 = 1;
    const E_UNAUTHORIZED: u64 = 2;

    // ===== Structs =====

    /// Treasury for collecting marketplace fees
    struct Treasury has key {
        id: UID,
        balance: Balance<SUI>,
        total_collected: u64,
    }

    /// Capability for treasury management
    struct TreasuryCap has key {
        id: UID,
    }

    // ===== Functions =====

    /// Initialize treasury
    fun init(ctx: &mut TxContext) {
        let treasury = Treasury {
            id: object::new(ctx),
            balance: balance::zero(),
            total_collected: 0,
        };

        let treasury_cap = TreasuryCap {
            id: object::new(ctx),
        };

        transfer::share_object(treasury);
        transfer::transfer(treasury_cap, tx_context::sender(ctx));
    }

    /// Transfer SUI to treasury
    public fun transfer_to_treasury(
        treasury: &mut Treasury,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&payment);
        balance::join(&mut treasury.balance, payment);
        treasury.total_collected = treasury.total_collected + amount;
    }

    /// Withdraw from treasury (admin only)
    public fun withdraw_from_treasury(
        _treasury_cap: &TreasuryCap,
        treasury: &mut Treasury,
        amount: u64,
        ctx: &mut TxContext
    ): Coin<SUI> {
        assert!(balance::value(&treasury.balance) >= amount, E_INSUFFICIENT_BALANCE);
        balance::split(&mut treasury.balance, amount, ctx)
    }

    /// Get treasury balance
    public fun get_treasury_balance(treasury: &Treasury): u64 {
        balance::value(&treasury.balance)
    }

    /// Get total collected fees
    public fun get_total_collected(treasury: &Treasury): u64 {
        treasury.total_collected
    }

    /// Split SUI coin
    public fun split(coin: &mut Coin<SUI>, amount: u64, ctx: &mut TxContext): Coin<SUI> {
        coin::split(coin, amount, ctx)
    }

    /// Join SUI coins
    public fun join(coin: &mut Coin<SUI>, other: Coin<SUI>) {
        coin::join(coin, other);
    }

    /// Get coin value
    public fun value(coin: &Coin<SUI>): u64 {
        coin::value(coin)
    }
} 