module carbon_marketplace::carbon_credit {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::transfer;
    use sui::event;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use std::string;
    use std::vector;

    // Project object representing a micro-project
    public struct Project has key, store {
        id: UID,
        name: string::String,
        location: string::String,
        project_type: string::String,
        description: string::String,
        developer: address,
        total_credits: u64,
        credits_issued: u64,
        price_per_credit: u64, // in SUI (can be converted to USDC)
        co_benefits: vector<string::String>,
        sdg_goals: vector<u8>,
        verification_status: u8, // 0: pending, 1: verified, 2: rejected
        funding_goal: u64,
        funding_raised: u64,
        created_at: u64,
        metadata: string::String
    }

    // Carbon credit object representing verified impact
    public struct CarbonCredit has key, store {
        id: UID,
        project_id: object::ID,
        project_name: string::String,
        co2_kg: u64,
        verification_hash: string::String,
        dMRV_data: string::String, // JSON string with sensor/satellite data
        retired: bool,
        retirement_certificate: string::String,
        created_at: u64,
        metadata: string::String
    }

    // Marketplace listing for buying/selling credits
    public struct CreditListing has key, store {
        id: UID,
        credit_id: object::ID,
        seller: address,
        price: u64, // in SUI
        quantity: u64,
        active: bool,
        created_at: u64
    }

    // dMRV verification data
    public struct VerificationData has store {
        project_id: object::ID,
        sensor_data: string::String,
        satellite_data: string::String,
        community_reports: string::String,
        verification_score: u64, // 0-100
        verified_by: address,
        verified_at: u64
    }

    // Events
    public struct ProjectCreatedEvent has copy, drop {
        project_id: object::ID,
        name: string::String,
        developer: address,
        location: string::String
    }

    public struct CreditMintedEvent has copy, drop {
        credit_id: object::ID,
        project_id: object::ID,
        co2_kg: u64,
        minted_by: address
    }

    public struct CreditVerifiedEvent has copy, drop {
        credit_id: object::ID,
        project_id: object::ID,
        verifier: address,
        verification_score: u64,
        timestamp: u64
    }

    public struct CreditRetiredEvent has copy, drop {
        credit_id: object::ID,
        retirer: address,
        retirement_certificate: string::String,
        timestamp: u64
    }

    public struct CreditTradedEvent has copy, drop {
        credit_id: object::ID,
        seller: address,
        buyer: address,
        price: u64,
        timestamp: u64
    }

    // Capability objects for access control
    public struct ProjectDeveloperCap has key, store {
        id: UID,
        developer: address
    }

    public struct VerifierCap has key, store {
        id: UID,
        verifier: address
    }

    // Initialize capabilities (called once per address)
    public entry fun initialize_developer_cap(ctx: &mut TxContext) {
        let cap = ProjectDeveloperCap {
            id: object::new(ctx),
            developer: tx_context::sender(ctx)
        };
        transfer::public_transfer(cap, tx_context::sender(ctx));
    }

    public entry fun initialize_verifier_cap(ctx: &mut TxContext) {
        let cap = VerifierCap {
            id: object::new(ctx),
            verifier: tx_context::sender(ctx)
        };
        transfer::public_transfer(cap, tx_context::sender(ctx));
    }

    // Create a new micro-project
    public entry fun create_project(
        _cap: &ProjectDeveloperCap,
        name: string::String,
        location: string::String,
        project_type: string::String,
        description: string::String,
        total_credits: u64,
        price_per_credit: u64,
        co_benefits: vector<string::String>,
        sdg_goals: vector<u8>,
        funding_goal: u64,
        metadata: string::String,
        ctx: &mut TxContext
    ) {
        let project = Project {
            id: object::new(ctx),
            name,
            location,
            project_type,
            description,
            developer: tx_context::sender(ctx),
            total_credits,
            credits_issued: 0,
            price_per_credit,
            co_benefits,
            sdg_goals,
            verification_status: 0, // pending
            funding_goal,
            funding_raised: 0,
            created_at: tx_context::epoch(ctx),
            metadata
        };

        event::emit(ProjectCreatedEvent {
            project_id: object::uid_to_inner(&project.id),
            name: project.name,
            developer: project.developer,
            location: project.location
        });

        transfer::public_transfer(project, tx_context::sender(ctx));
    }

    // Mint carbon credits for a project (called by project developer)
    public entry fun mint_credits(
        _cap: &ProjectDeveloperCap,
        project: &mut Project,
        co2_kg: u64,
        metadata: string::String,
        ctx: &mut TxContext
    ) {
        assert!(project.developer == tx_context::sender(ctx), ENOT_PROJECT_DEVELOPER);
        assert!(project.credits_issued + co2_kg <= project.total_credits, EEXCEEDS_TOTAL_CREDITS);

        let credit = CarbonCredit {
            id: object::new(ctx),
            project_id: object::uid_to_inner(&project.id),
            project_name: project.name,
            co2_kg,
            verification_hash: string::utf8(b""),
            dMRV_data: string::utf8(b""),
            retired: false,
            retirement_certificate: string::utf8(b""),
            created_at: tx_context::epoch(ctx),
            metadata
        };

        project.credits_issued = project.credits_issued + co2_kg;

        event::emit(CreditMintedEvent {
            credit_id: object::uid_to_inner(&credit.id),
            project_id: object::uid_to_inner(&project.id),
            co2_kg,
            minted_by: tx_context::sender(ctx)
        });

        transfer::public_transfer(credit, tx_context::sender(ctx));
    }

    // Verify credit through dMRV system (called by authorized verifier)
    public entry fun verify_credit(
        _cap: &VerifierCap,
        credit: &mut CarbonCredit,
        verification_hash: string::String,
        dMRV_data: string::String,
        verification_score: u64,
        ctx: &mut TxContext
    ) {
        assert!(!credit.retired, ECREDIT_RETIRED);
        assert!(verification_score <= 100, EINVALID_SCORE);
        assert!(verification_score >= 70, EINSUFFICIENT_SCORE); // Minimum 70% for verification

        credit.verification_hash = verification_hash;
        credit.dMRV_data = dMRV_data;

        event::emit(CreditVerifiedEvent {
            credit_id: object::uid_to_inner(&credit.id),
            project_id: credit.project_id,
            verifier: tx_context::sender(ctx),
            verification_score,
            timestamp: tx_context::epoch(ctx)
        });
    }

    // Create a marketplace listing to sell credits
    public entry fun create_listing(
        credit: CarbonCredit,
        price: u64,
        ctx: &mut TxContext
    ) {
        assert!(!credit.retired, ECREDIT_RETIRED);
        assert!(credit.verification_hash != string::utf8(b""), ENOT_VERIFIED);
        assert!(price > 0, EINVALID_PRICE);

        let listing = CreditListing {
            id: object::new(ctx),
            credit_id: object::uid_to_inner(&credit.id),
            seller: tx_context::sender(ctx),
            price,
            quantity: credit.co2_kg,
            active: true,
            created_at: tx_context::epoch(ctx)
        };

        transfer::public_transfer(listing, tx_context::sender(ctx));
        transfer::public_transfer(credit, tx_context::sender(ctx));
    }

    // Buy credits from a listing
    public entry fun buy_credits(
        listing: &mut CreditListing,
        mut payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(listing.active, ELISTING_INACTIVE);
        assert!(listing.seller != tx_context::sender(ctx), ECANNOT_BUY_OWN_LISTING);
        assert!(coin::value(&payment) >= listing.price, EINSUFFICIENT_PAYMENT);

        // Transfer payment to seller
        let seller_payment = coin::split(&mut payment, listing.price, ctx);
        transfer::public_transfer(seller_payment, listing.seller);

        // Return excess payment to buyer if any
        let remaining_value = coin::value(&payment);
        if (remaining_value > 0) {
            transfer::public_transfer(payment, tx_context::sender(ctx));
        } else {
            coin::destroy_zero(payment);
        };

        listing.active = false;

        event::emit(CreditTradedEvent {
            credit_id: listing.credit_id,
            seller: listing.seller,
            buyer: tx_context::sender(ctx),
            price: listing.price,
            timestamp: tx_context::epoch(ctx)
        });
    }

    // Permanently retire credit (prevent double-spending)
    public entry fun retire_credit(
        credit: &mut CarbonCredit,
        retirement_reason: string::String,
        ctx: &mut TxContext
    ) {
        assert!(!credit.retired, ECREDIT_RETIRED);
        assert!(credit.verification_hash != string::utf8(b""), ENOT_VERIFIED);

        credit.retired = true;
        credit.retirement_certificate = retirement_reason;

        event::emit(CreditRetiredEvent {
            credit_id: object::uid_to_inner(&credit.id),
            retirer: tx_context::sender(ctx),
            retirement_certificate: retirement_reason,
            timestamp: tx_context::epoch(ctx)
        });
    }

    // Fund a project (corporate buyers can fund projects directly)
    public entry fun fund_project(
        project: &mut Project,
        funding_amount: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(project.verification_status == 1, EPROJECT_NOT_VERIFIED);
        assert!(project.funding_raised + coin::value(&funding_amount) <= project.funding_goal, EEXCEEDS_FUNDING_GOAL);

        project.funding_raised = project.funding_raised + coin::value(&funding_amount);
        transfer::public_transfer(funding_amount, project.developer);
    }

    // Update project verification status
    public entry fun update_project_verification(
        _cap: &VerifierCap,
        project: &mut Project,
        status: u8,
        _ctx: &mut TxContext
    ) {
        assert!(status <= 2, EINVALID_STATUS);
        project.verification_status = status;
    }

    // Error codes
    const ECREDIT_RETIRED: u64 = 0;
    const ENOT_VERIFIED: u64 = 1;
    const ENOT_PROJECT_DEVELOPER: u64 = 2;
    const EEXCEEDS_TOTAL_CREDITS: u64 = 3;
    const EINVALID_SCORE: u64 = 4;
    const EINSUFFICIENT_SCORE: u64 = 5;
    const EINVALID_PRICE: u64 = 6;
    const ELISTING_INACTIVE: u64 = 7;
    const ECANNOT_BUY_OWN_LISTING: u64 = 8;
    const EINSUFFICIENT_PAYMENT: u64 = 9;
    const EPROJECT_NOT_VERIFIED: u64 = 10;
    const EEXCEEDS_FUNDING_GOAL: u64 = 11;
    const EINVALID_STATUS: u64 = 12;
}
