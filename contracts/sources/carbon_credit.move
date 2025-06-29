module carbon_marketplace::carbon_credit {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::table::{Self, Table};
    use std::string::{Self, String};
    use std::vector;

    // ===== Error Codes =====
    const E_INSUFFICIENT_BALANCE: u64 = 0;
    const E_INVALID_AMOUNT: u64 = 1;
    const E_PROJECT_NOT_FOUND: u64 = 2;
    const E_UNAUTHORIZED: u64 = 3;
    const E_CREDIT_ALREADY_RETIRED: u64 = 4;
    const E_INVALID_VERIFICATION_DATA: u64 = 5;

    // ===== Structs =====

    /// Represents a carbon credit with detailed metadata
    struct CarbonCredit has key, store {
        id: UID,
        project_id: String,
        amount: u64, // in kg CO2 equivalent
        vintage_year: u64,
        methodology: String,
        verification_status: u8, // 0: pending, 1: verified, 2: rejected
        verification_data: vector<u8>, // IPFS hash or sensor data
        co_benefits: vector<String>, // SDG alignment, biodiversity, etc.
        location: String,
        created_at: u64,
        verified_at: u64,
        retired: bool,
        retired_at: u64,
        retired_by: address,
        price_per_ton: u64, // in SUI (moved units)
    }

    /// Represents a micro-project that generates carbon credits
    struct Project has key, store {
        id: UID,
        name: String,
        description: String,
        project_type: String, // reforestation, renewable_energy, etc.
        location: String,
        coordinates: vector<f64>, // latitude, longitude
        owner: address,
        verifier: address,
        total_credits_generated: u64,
        total_credits_retired: u64,
        status: u8, // 0: draft, 1: active, 2: paused, 3: completed
        created_at: u64,
        updated_at: u64,
        methodology: String,
        expected_lifetime: u64, // in years
        monitoring_frequency: u64, // in days
    }

    /// Represents verification data from sensors or satellite imagery
    struct VerificationData has key, store {
        id: UID,
        project_id: String,
        data_type: String, // satellite, sensor, community_report
        data_hash: vector<u8>,
        timestamp: u64,
        coordinates: vector<f64>,
        confidence_score: u64, // 0-100
        verified_by: address,
    }

    /// Global marketplace state
    struct Marketplace has key {
        id: UID,
        total_credits_generated: u64,
        total_credits_retired: u64,
        total_projects: u64,
        total_volume_sui: u64,
        projects: Table<String, address>, // project_id -> project object address
        verifiers: Table<address, bool>, // verifier address -> is_active
        fees_collected: Balance<SUI>,
    }

    /// Capability for marketplace administration
    struct MarketplaceAdmin has key {
        id: UID,
    }

    /// Capability for project verification
    struct VerifierCap has key {
        id: UID,
    }

    // ===== Functions =====

    /// Initialize the marketplace
    fun init(ctx: &mut TxContext) {
        let marketplace = Marketplace {
            id: object::new(ctx),
            total_credits_generated: 0,
            total_credits_retired: 0,
            total_projects: 0,
            total_volume_sui: 0,
            projects: table::new(ctx),
            verifiers: table::new(ctx),
            fees_collected: balance::zero(),
        };

        let admin_cap = MarketplaceAdmin {
            id: object::new(ctx),
        };

        let verifier_cap = VerifierCap {
            id: object::new(ctx),
        };

        transfer::share_object(marketplace);
        transfer::transfer(admin_cap, tx_context::sender(ctx));
        transfer::transfer(verifier_cap, tx_context::sender(ctx));
    }

    /// Register a new verifier
    public fun register_verifier(
        _admin: &MarketplaceAdmin,
        marketplace: &mut Marketplace,
        verifier: address,
        ctx: &mut TxContext
    ) {
        table::add(&mut marketplace.verifiers, verifier, true);
    }

    /// Create a new micro-project
    public fun create_project(
        marketplace: &mut Marketplace,
        name: String,
        description: String,
        project_type: String,
        location: String,
        coordinates: vector<f64>,
        methodology: String,
        expected_lifetime: u64,
        monitoring_frequency: u64,
        ctx: &mut TxContext
    ): address {
        let project = Project {
            id: object::new(ctx),
            name,
            description,
            project_type,
            location,
            coordinates,
            owner: tx_context::sender(ctx),
            verifier: tx_context::sender(ctx), // Initially set to owner, can be changed
            total_credits_generated: 0,
            total_credits_retired: 0,
            status: 0, // draft
            created_at: tx_context::epoch(ctx),
            updated_at: tx_context::epoch(ctx),
            methodology,
            expected_lifetime,
            monitoring_frequency,
        };

        let project_id = string::utf8(b"project_");
        string::append(&mut project_id, string::utf8(b""));
        string::append(&mut project_id, string::utf8(b"")); // TODO: Add unique ID generation

        let project_addr = object::uid_to_address(&project.id);
        table::add(&mut marketplace.projects, project_id, project_addr);
        marketplace.total_projects = marketplace.total_projects + 1;

        transfer::share_object(project);
        project_addr
    }

    /// Generate carbon credits for a project
    public fun generate_credits(
        marketplace: &mut Marketplace,
        project: &mut Project,
        amount: u64,
        vintage_year: u64,
        methodology: String,
        verification_data: vector<u8>,
        co_benefits: vector<String>,
        location: String,
        price_per_ton: u64,
        ctx: &mut TxContext
    ): address {
        assert!(amount > 0, E_INVALID_AMOUNT);
        assert!(project.status == 1, E_PROJECT_NOT_FOUND); // Must be active

        let credit = CarbonCredit {
            id: object::new(ctx),
            project_id: string::utf8(b"project_"), // TODO: Get actual project ID
            amount,
            vintage_year,
            methodology,
            verification_status: 1, // verified
            verification_data,
            co_benefits,
            location,
            created_at: tx_context::epoch(ctx),
            verified_at: tx_context::epoch(ctx),
            retired: false,
            retired_at: 0,
            retired_by: @0x0,
            price_per_ton,
        };

        project.total_credits_generated = project.total_credits_generated + amount;
        project.updated_at = tx_context::epoch(ctx);
        marketplace.total_credits_generated = marketplace.total_credits_generated + amount;

        let credit_addr = object::uid_to_address(&credit.id);
        transfer::share_object(credit);
        credit_addr
    }

    /// Retire carbon credits (permanent removal from circulation)
    public fun retire_credits(
        marketplace: &mut Marketplace,
        credit: &mut CarbonCredit,
        project: &mut Project,
        retirement_reason: String,
        ctx: &mut TxContext
    ) {
        assert!(!credit.retired, E_CREDIT_ALREADY_RETIRED);
        assert!(credit.verification_status == 1, E_INVALID_VERIFICATION_DATA);

        credit.retired = true;
        credit.retired_at = tx_context::epoch(ctx);
        credit.retired_by = tx_context::sender(ctx);

        project.total_credits_retired = project.total_credits_retired + credit.amount;
        marketplace.total_credits_retired = marketplace.total_credits_retired + credit.amount;
    }

    /// Update project status
    public fun update_project_status(
        project: &mut Project,
        new_status: u8,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == project.owner, E_UNAUTHORIZED);
        project.status = new_status;
        project.updated_at = tx_context::epoch(ctx);
    }

    /// Add verification data
    public fun add_verification_data(
        _verifier: &VerifierCap,
        project_id: String,
        data_type: String,
        data_hash: vector<u8>,
        coordinates: vector<f64>,
        confidence_score: u64,
        ctx: &mut TxContext
    ) {
        let verification_data = VerificationData {
            id: object::new(ctx),
            project_id,
            data_type,
            data_hash,
            timestamp: tx_context::epoch(ctx),
            coordinates,
            confidence_score,
            verified_by: tx_context::sender(ctx),
        };

        transfer::share_object(verification_data);
    }

    // ===== View Functions =====

    /// Get project statistics
    public fun get_project_stats(project: &Project): (u64, u64, u64) {
        (project.total_credits_generated, project.total_credits_retired, project.status)
    }

    /// Get marketplace statistics
    public fun get_marketplace_stats(marketplace: &Marketplace): (u64, u64, u64, u64) {
        (
            marketplace.total_credits_generated,
            marketplace.total_credits_retired,
            marketplace.total_projects,
            marketplace.total_volume_sui
        )
    }

    /// Check if address is a verifier
    public fun is_verifier(marketplace: &Marketplace, verifier: address): bool {
        table::contains(&marketplace.verifiers, verifier)
    }
} 