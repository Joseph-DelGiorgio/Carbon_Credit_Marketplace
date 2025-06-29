module carbon_marketplace::marketplace {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::table::{Self, Table};
    use sui::event;
    use std::string::{Self, String};
    use std::vector;
    use carbon_marketplace::carbon_credit::{Self, CarbonCredit, Project, Marketplace};

    // ===== Error Codes =====
    const E_INSUFFICIENT_BALANCE: u64 = 0;
    const E_INVALID_AMOUNT: u64 = 1;
    const E_CREDIT_NOT_FOR_SALE: u64 = 2;
    const E_INSUFFICIENT_CREDITS: u64 = 3;
    const E_AUCTION_NOT_FOUND: u64 = 4;
    const E_AUCTION_ENDED: u64 = 5;
    const E_BID_TOO_LOW: u64 = 6;
    const E_UNAUTHORIZED: u64 = 7;
    const E_CREDIT_ALREADY_RETIRED: u64 = 8;

    // ===== Structs =====

    /// Represents a carbon credit listing for sale
    struct CreditListing has key, store {
        id: UID,
        credit_id: address,
        seller: address,
        price_per_ton: u64, // in SUI (moved units)
        total_amount: u64, // in kg CO2
        available_amount: u64, // in kg CO2
        created_at: u64,
        expires_at: u64,
        active: bool,
    }

    /// Represents an auction for carbon credits
    struct CreditAuction has key, store {
        id: UID,
        credit_id: address,
        seller: address,
        starting_price: u64, // in SUI (moved units) per ton
        reserve_price: u64, // minimum acceptable price
        total_amount: u64, // in kg CO2
        available_amount: u64, // in kg CO2
        start_time: u64,
        end_time: u64,
        highest_bid: u64,
        highest_bidder: address,
        active: bool,
        bids: Table<address, u64>, // bidder -> bid amount
    }

    /// Represents a bid in an auction
    struct AuctionBid has key, store {
        id: UID,
        auction_id: address,
        bidder: address,
        amount: u64, // in SUI (moved units)
        timestamp: u64,
    }

    /// Represents a completed transaction
    struct Transaction has key, store {
        id: UID,
        credit_id: address,
        buyer: address,
        seller: address,
        amount: u64, // in kg CO2
        price_per_ton: u64, // in SUI (moved units)
        total_price: u64, // in SUI (moved units)
        transaction_type: String, // "direct_sale", "auction", "retirement"
        timestamp: u64,
    }

    /// Capability for marketplace operations
    struct MarketplaceCap has key {
        id: UID,
    }

    // ===== Events =====

    /// Event emitted when a credit is listed for sale
    struct CreditListed has copy, drop {
        listing_id: address,
        credit_id: address,
        seller: address,
        price_per_ton: u64,
        amount: u64,
    }

    /// Event emitted when a credit is sold
    struct CreditSold has copy, drop {
        transaction_id: address,
        credit_id: address,
        buyer: address,
        seller: address,
        amount: u64,
        price_per_ton: u64,
        total_price: u64,
    }

    /// Event emitted when an auction is created
    struct AuctionCreated has copy, drop {
        auction_id: address,
        credit_id: address,
        seller: address,
        starting_price: u64,
        reserve_price: u64,
        amount: u64,
        end_time: u64,
    }

    /// Event emitted when a bid is placed
    struct BidPlaced has copy, drop {
        auction_id: address,
        bidder: address,
        amount: u64,
    }

    /// Event emitted when an auction ends
    struct AuctionEnded has copy, drop {
        auction_id: address,
        winner: address,
        winning_bid: u64,
        amount: u64,
    }

    // ===== Functions =====

    /// Initialize marketplace capabilities
    fun init(ctx: &mut TxContext) {
        let cap = MarketplaceCap {
            id: object::new(ctx),
        };
        transfer::transfer(cap, tx_context::sender(ctx));
    }

    /// List carbon credits for sale
    public fun list_credits(
        _cap: &MarketplaceCap,
        credit: &mut CarbonCredit,
        price_per_ton: u64,
        expires_at: u64,
        ctx: &mut TxContext
    ): address {
        assert!(tx_context::sender(ctx) == credit.retired_by || credit.retired_by == @0x0, E_UNAUTHORIZED);
        assert!(!credit.retired, E_CREDIT_ALREADY_RETIRED);
        assert!(price_per_ton > 0, E_INVALID_AMOUNT);

        let listing = CreditListing {
            id: object::new(ctx),
            credit_id: object::uid_to_address(&credit.id),
            seller: tx_context::sender(ctx),
            price_per_ton,
            total_amount: credit.amount,
            available_amount: credit.amount,
            created_at: tx_context::epoch(ctx),
            expires_at,
            active: true,
        };

        let listing_addr = object::uid_to_address(&listing.id);
        transfer::share_object(listing);

        event::emit(CreditListed {
            listing_id: listing_addr,
            credit_id: object::uid_to_address(&credit.id),
            seller: tx_context::sender(ctx),
            price_per_ton,
            amount: credit.amount,
        });

        listing_addr
    }

    /// Buy carbon credits directly
    public fun buy_credits(
        _cap: &MarketplaceCap,
        listing: &mut CreditListing,
        credit: &mut CarbonCredit,
        marketplace: &mut Marketplace,
        payment: Coin<SUI>,
        amount_to_buy: u64,
        ctx: &mut TxContext
    ): (address, Coin<SUI>) {
        assert!(listing.active, E_CREDIT_NOT_FOR_SALE);
        assert!(amount_to_buy <= listing.available_amount, E_INSUFFICIENT_CREDITS);
        assert!(tx_context::epoch(ctx) <= listing.expires_at, E_CREDIT_NOT_FOR_SALE);

        let total_price = (amount_to_buy * listing.price_per_ton) / 1000; // Convert from kg to tons
        let payment_balance = coin::value(&payment);
        assert!(payment_balance >= total_price, E_INSUFFICIENT_BALANCE);

        // Calculate fees (2% marketplace fee)
        let marketplace_fee = total_price * 2 / 100;
        let seller_amount = total_price - marketplace_fee;

        // Update listing
        listing.available_amount = listing.available_amount - amount_to_buy;
        if (listing.available_amount == 0) {
            listing.active = false;
        };

        // Update marketplace stats
        marketplace.total_volume_sui = marketplace.total_volume_sui + total_price;
        balance::join(&mut marketplace.fees_collected, coin::split(&mut payment, marketplace_fee, ctx));

        // Create transaction record
        let transaction = Transaction {
            id: object::new(ctx),
            credit_id: object::uid_to_address(&credit.id),
            buyer: tx_context::sender(ctx),
            seller: listing.seller,
            amount: amount_to_buy,
            price_per_ton: listing.price_per_ton,
            total_price,
            transaction_type: string::utf8(b"direct_sale"),
            timestamp: tx_context::epoch(ctx),
        };

        let transaction_addr = object::uid_to_address(&transaction.id);
        transfer::share_object(transaction);

        event::emit(CreditSold {
            transaction_id: transaction_addr,
            credit_id: object::uid_to_address(&credit.id),
            buyer: tx_context::sender(ctx),
            seller: listing.seller,
            amount: amount_to_buy,
            price_per_ton: listing.price_per_ton,
            total_price,
        });

        (transaction_addr, payment)
    }

    /// Create an auction for carbon credits
    public fun create_auction(
        _cap: &MarketplaceCap,
        credit: &mut CarbonCredit,
        starting_price: u64,
        reserve_price: u64,
        duration_days: u64,
        ctx: &mut TxContext
    ): address {
        assert!(tx_context::sender(ctx) == credit.retired_by || credit.retired_by == @0x0, E_UNAUTHORIZED);
        assert!(!credit.retired, E_CREDIT_ALREADY_RETIRED);
        assert!(starting_price >= reserve_price, E_INVALID_AMOUNT);

        let end_time = tx_context::epoch(ctx) + (duration_days * 24 * 60 * 60); // Convert days to seconds

        let auction = CreditAuction {
            id: object::new(ctx),
            credit_id: object::uid_to_address(&credit.id),
            seller: tx_context::sender(ctx),
            starting_price,
            reserve_price,
            total_amount: credit.amount,
            available_amount: credit.amount,
            start_time: tx_context::epoch(ctx),
            end_time,
            highest_bid: 0,
            highest_bidder: @0x0,
            active: true,
            bids: table::new(ctx),
        };

        let auction_addr = object::uid_to_address(&auction.id);
        transfer::share_object(auction);

        event::emit(AuctionCreated {
            auction_id: auction_addr,
            credit_id: object::uid_to_address(&credit.id),
            seller: tx_context::sender(ctx),
            starting_price,
            reserve_price,
            amount: credit.amount,
            end_time,
        });

        auction_addr
    }

    /// Place a bid in an auction
    public fun place_bid(
        _cap: &MarketplaceCap,
        auction: &mut CreditAuction,
        payment: Coin<SUI>,
        bid_amount: u64,
        ctx: &mut TxContext
    ): (address, Coin<SUI>) {
        assert!(auction.active, E_AUCTION_NOT_FOUND);
        assert!(tx_context::epoch(ctx) < auction.end_time, E_AUCTION_ENDED);
        assert!(bid_amount > auction.highest_bid, E_BID_TOO_LOW);

        let bidder = tx_context::sender(ctx);
        let payment_balance = coin::value(&payment);
        assert!(payment_balance >= bid_amount, E_INSUFFICIENT_BALANCE);

        // Refund previous highest bidder if exists
        if (auction.highest_bidder != @0x0) {
            let previous_bid = table::borrow(&auction.bids, auction.highest_bidder);
            // TODO: Implement refund mechanism
        };

        // Update auction state
        auction.highest_bid = bid_amount;
        auction.highest_bidder = bidder;
        table::add(&mut auction.bids, bidder, bid_amount);

        let bid = AuctionBid {
            id: object::new(ctx),
            auction_id: object::uid_to_address(&auction.id),
            bidder,
            amount: bid_amount,
            timestamp: tx_context::epoch(ctx),
        };

        let bid_addr = object::uid_to_address(&bid.id);
        transfer::share_object(bid);

        event::emit(BidPlaced {
            auction_id: object::uid_to_address(&auction.id),
            bidder,
            amount: bid_amount,
        });

        (bid_addr, payment)
    }

    /// End an auction and process the winner
    public fun end_auction(
        _cap: &MarketplaceCap,
        auction: &mut CreditAuction,
        credit: &mut CarbonCredit,
        marketplace: &mut Marketplace,
        ctx: &mut TxContext
    ): address {
        assert!(auction.active, E_AUCTION_NOT_FOUND);
        assert!(tx_context::epoch(ctx) >= auction.end_time, E_AUCTION_ENDED);

        auction.active = false;

        if (auction.highest_bid >= auction.reserve_price) {
            // Auction successful
            let total_price = (auction.total_amount * auction.highest_bid) / 1000; // Convert from kg to tons
            let marketplace_fee = total_price * 2 / 100;
            let seller_amount = total_price - marketplace_fee;

            // Update marketplace stats
            marketplace.total_volume_sui = marketplace.total_volume_sui + total_price;

            // Create transaction record
            let transaction = Transaction {
                id: object::new(ctx),
                credit_id: object::uid_to_address(&credit.id),
                buyer: auction.highest_bidder,
                seller: auction.seller,
                amount: auction.total_amount,
                price_per_ton: auction.highest_bid,
                total_price,
                transaction_type: string::utf8(b"auction"),
                timestamp: tx_context::epoch(ctx),
            };

            let transaction_addr = object::uid_to_address(&transaction.id);
            transfer::share_object(transaction);

            event::emit(AuctionEnded {
                auction_id: object::uid_to_address(&auction.id),
                winner: auction.highest_bidder,
                winning_bid: auction.highest_bid,
                amount: auction.total_amount,
            });

            transaction_addr
        } else {
            // Auction failed - no winner
            event::emit(AuctionEnded {
                auction_id: object::uid_to_address(&auction.id),
                winner: @0x0,
                winning_bid: 0,
                amount: 0,
            });

            @0x0
        }
    }

    /// Cancel a listing
    public fun cancel_listing(
        _cap: &MarketplaceCap,
        listing: &mut CreditListing,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == listing.seller, E_UNAUTHORIZED);
        listing.active = false;
    }

    /// Cancel an auction
    public fun cancel_auction(
        _cap: &MarketplaceCap,
        auction: &mut CreditAuction,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == auction.seller, E_UNAUTHORIZED);
        assert!(tx_context::epoch(ctx) < auction.end_time, E_AUCTION_ENDED);
        auction.active = false;
    }

    // ===== View Functions =====

    /// Get listing details
    public fun get_listing_details(listing: &CreditListing): (address, address, u64, u64, u64, bool) {
        (
            listing.credit_id,
            listing.seller,
            listing.price_per_ton,
            listing.available_amount,
            listing.expires_at,
            listing.active
        )
    }

    /// Get auction details
    public fun get_auction_details(auction: &CreditAuction): (address, address, u64, u64, u64, u64, bool) {
        (
            auction.credit_id,
            auction.seller,
            auction.highest_bid,
            auction.highest_bidder,
            auction.end_time,
            auction.available_amount,
            auction.active
        )
    }

    /// Check if auction has ended
    public fun is_auction_ended(auction: &CreditAuction, current_time: u64): bool {
        current_time >= auction.end_time
    }
} 