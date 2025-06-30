module carbon_marketplace::carbon_credit {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::transfer;
    use sui::event;
    use std::string;

    // Carbon credit object representing verified impact
    public struct CarbonCredit has key, store {
        id: UID,
        project_id: string::String,
        co2_kg: u64,
        verification_hash: string::String,
        retired: bool,
        metadata: string::String
    }

    // Verification event for dMRV systems
    public struct VerificationEvent has copy, drop {
        project_id: string::String,
        verifier: address,
        timestamp: u64,
        data_hash: string::String
    }

    // Credit retirement event
    public struct RetirementEvent has copy, drop {
        credit_id: object::ID,
        retirer: address,
        timestamp: u64
    }

    // Initialize new carbon credit (minted by project developer)
    public entry fun create_credit(
        project_id: string::String,
        co2_kg: u64,
        metadata: string::String,
        ctx: &mut TxContext
    ) {
        let credit = CarbonCredit {
            id: object::new(ctx),
            project_id,
            co2_kg,
            verification_hash: string::utf8(b""),
            retired: false,
            metadata
        };
        transfer::public_transfer(credit, tx_context::sender(ctx));
    }

    // Verify credit through dMRV system (called by oracle/verifier)
    public entry fun verify_credit(
        credit: &mut CarbonCredit,
        verification_hash: string::String,
        verifier: address,
        timestamp: u64,
    ) {
        assert!(!credit.retired, ECREDIT_RETIRED);
        credit.verification_hash = verification_hash;
        event::emit(VerificationEvent {
            project_id: credit.project_id,
            verifier,
            timestamp,
            data_hash: verification_hash
        });
    }

    // Transfer credit to new owner
    public entry fun transfer_credit(
        credit: CarbonCredit, 
        recipient: address
    ) {
        assert!(!credit.retired, ECREDIT_RETIRED);
        assert!(credit.verification_hash != string::utf8(b""), ENOT_VERIFIED);
        transfer::public_transfer(credit, recipient);
    }

    // Permanently retire credit (prevent double-spending)
    public entry fun retire_credit(
        credit: &mut CarbonCredit,
        ctx: &mut TxContext
    ) {
        assert!(!credit.retired, ECREDIT_RETIRED);
        credit.retired = true;
        event::emit(RetirementEvent {
            credit_id: object::uid_to_inner(&credit.id),
            retirer: tx_context::sender(ctx),
            timestamp: tx_context::epoch(ctx)
        });
    }

    // Error codes
    const ECREDIT_RETIRED: u64 = 0;
    const ENOT_VERIFIED: u64 = 1;
}
