import "@stdlib/deploy";
import "@stdlib/ownable";
import "./player_stats";
import "./messages";

const codeInflowValueNotSufficient: Int = 50001;
const codeBalanceNotSufficient: Int = 50002;
const codeUnauthorized: Int = 50003;
const codeNftIndexNotExists: Int = 50200;
const codeNftCustomPayloadInvalid: Int = 50201;
const codeNftAlreadyInitialized: Int = 50202;
const codeNftShouldntBeRewarded: Int = 50203;

// https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#content-representation
struct Tep64TokenData {
    // flag is the flag of the content type.
    // 0 means on-chain, 1 means off-chain.
    flag: Int as uint8;
    content: String;
}

struct CollectionData {
    nextItemIndex: Int;
    collectionContent: Cell;
    ownerAddress: Address;
}

struct GetNftData {
    init: Bool;
    index: Int as uint256;
    collectionAddress: Address;
    ownerAddress: Address;
    individualContent: Cell;
}

message(0xe535b616) MintNFT {
    queryId: Int as uint64;
    receiver: Address;
    responseDestination: Address;
    forwardAmount: Int as coins = 0;
    forwardPayload: Cell?;
}

message(0x48a60907) UpdateCollection {
    queryId: Int as uint64;
    responseDestination: Address;
    collectionContent: Tep64TokenData?;
    itemContentUrlPrefix: String?;
}

// https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#1-transfer
message(0x5fcc3d14) NFTTransfer {
    queryId: Int as uint64;
    // newOwner is address of the new owner of the NFT item.
    newOwner: Address;
    // responseDestination is the address where to send a response
    // with confirmation of a successful transfer and the rest of
    // the incoming message coins.
    responseDestination: Address;
    // customPayload is the optional custom data.
    customPayload: Cell?;
    // forwardAmount is the amount of nanotons to be sent to the new owner.
    forwardAmount: Int as coins;
    // forwardPayload is the optional custom data that should be
    // sent to the new owner.
    forwardPayload: Cell?;
}

message(0x05138d91) OwnershipAssigned {
    queryId: Int as uint64;
    prevOwner: Address;
    forwardPayload: Cell?;
}

message(0x8b771735) ReportStaticData {
    queryId: Int as uint64;
    index: Int as uint256;
    collection: Address;
}

message(0x2fcb26a2) GetStaticData {
    queryId: Int as uint64;
}

message(0xd53276db) Excesses {
    queryId: Int as uint64;
}

// SetStaticTax is the message that used to set the static tax fee.
message(0x1509a420) SetStaticTax {
    staticTax: Int as coins;
}

contract RewardSBTCollection with Common {
    owner: Address;
    staticTax: Int as coins = ton("0.001");
    lockedValue: Int as coins = ton("0");

    nextItemIndex: Int as uint256 = 0;
    collectionContent: Cell;
    // itemContentUrlPrefix is the prefix of the individual NFT's content url.
    // the full url should be: `${itemContentUrlPrefix}${individualContent}.json`
    itemContentUrlPrefix: String;

    gameManager: Address;
    minLevelsCompleted: Int;
    mintNFTRequests: map<Address, MintNFT>;

    init(owner: Address, collectionContent: Tep64TokenData, itemContentUrlPrefix: String, gameManager: Address, minLevelsCompleted: Int) {
        self.owner = owner;
        self.collectionContent = collectionContent.toCell();
        self.itemContentUrlPrefix = itemContentUrlPrefix;
        self.gameManager = gameManager;
        self.minLevelsCompleted = minLevelsCompleted;
        self.mintNFTRequests = emptyMap();
    }

    // -------------------------------------
    // TEP-062 standard interfaces
    // -------------------------------------

    // collection's owner can mint NFTs
    receive(msg: MintNFT) {
        self.receiveMintNFT(msg);
    }

    receive(msg: ResponseStats) {
        self.receiveResponseStats(msg);
    }

    get fun get_collection_data(): CollectionData {
        return self.getCollectionData();
    }

    get fun get_nft_address_by_index(index: Int): Address {
        return self.getNftAddressByIndex(index);
    }

    get fun get_nft_content(index: Int, individualContent: Cell): Cell {
        return self.getNftContent(index, individualContent);
    }

    // -------------------------------------
    // Non standard methods
    // -------------------------------------

    // update collection's content and itemContentUrlPrefix
    receive(msg: UpdateCollection) {
        self.receiveUpdateCollection(msg);
    }

    fun receiveUpdateCollection(msg: UpdateCollection) {
        nativeThrowUnless(codeUnauthorized, sender() == self.owner);

        if (msg.collectionContent != null) {
            self.collectionContent = msg.collectionContent!!.toCell();
        }

        if (msg.itemContentUrlPrefix != null) {
            self.itemContentUrlPrefix = msg.itemContentUrlPrefix!!;
        }

        // refund
        self.reserveValue(0);
        send(SendParameters{
            to: msg.responseDestination,
            value: 0,
            mode: SendRemainingBalance,
            bounce: false,
            body: Excesses{
                queryId: msg.queryId
            }.toCell(),
        });
    }

    fun receiveMintNFT(msg: MintNFT) {
        let ctx: Context = context();
        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= self.staticTax + msg.forwardAmount);

        let playerStatsInit = initOf PlayerStats(self.gameManager, msg.receiver);
        let playerStats = contractAddress(playerStatsInit);
        self.mintNFTRequests.set(playerStats, msg);

        self.reserveValue(0);
        send(SendParameters{
                to: playerStats,
                bounce: true,
                value: 0,
                mode: SendRemainingBalance,
                body: "request stats".asComment()
            }
        );
    }

    fun receiveResponseStats(msg: ResponseStats) {
        let ctx: Context = context();
        let mintNFTRequest = self.mintNFTRequests.get(ctx.sender);
        nativeThrowUnless(codeUnauthorized, mintNFTRequest != null);
        self.mintNFTRequests.del(ctx.sender);
        nativeThrowUnless(codeNftShouldntBeRewarded, msg.levelsCompleted >= self.minLevelsCompleted);
        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= self.staticTax + mintNFTRequest!!.forwardAmount);

        let nftItemContract = self.getNftItemContract(self.nextItemIndex);

        // create NFT item contract
        self.reserveValue(0);
        send(SendParameters{
                to: contractAddress(nftItemContract),
                value: 0,
                bounce: true,
                mode: SendRemainingBalance,
                body: NFTTransfer {
                    queryId: mintNFTRequest!!.queryId,
                    newOwner: mintNFTRequest!!.receiver,
                    responseDestination: mintNFTRequest!!.responseDestination,
                    forwardAmount: mintNFTRequest!!.forwardAmount,
                    forwardPayload: mintNFTRequest!!.forwardPayload,
                    customPayload: "".asSlice().asCell(),
                }.toCell(),
                code: nftItemContract.code,
                data: nftItemContract.data,
            });

        self.nextItemIndex += 1;
    }

    fun getNftItemContract(nextItemIndex: Int): StateInit {
        return initOf RewardSBTItem(myAddress(), nextItemIndex);
    }

    fun getCollectionData(): CollectionData {
        return CollectionData{
            nextItemIndex: self.nextItemIndex,
            collectionContent: self.collectionContent,
            ownerAddress: self.owner,
        };
    }

    fun getNftAddressByIndex(index: Int): Address {
        nativeThrowUnless(codeNftIndexNotExists, index < self.nextItemIndex);
        return contractAddress(self.getNftItemContract(index));
    }

    fun getNftContent(index: Int, individualContent: Cell): Cell {
        return Tep64TokenData{
            flag: 1,
            content: beginString()
                .concat(self.itemContentUrlPrefix)
                .concat(individualContent.asSlice().asString())
                .concat(".json")
                .toString(),
        }.toCell();
    }
}

contract RewardSBTItem with Common {
    owner: Address;
    staticTax: Int as coins = ton("0.001");
    lockedValue: Int as coins = ton("0");

    initialized: Bool = false;
    collection: Address;
    itemIndex: Int as uint256;
    individualContent: Cell;

    init(collection: Address, index: Int) {
        nativeThrowUnless(codeUnauthorized, sender() == collection);

        self.owner = sender();
        self.collection = collection;
        self.individualContent = emptyCell();
        self.itemIndex = index;
    }

    receive(msg: NFTTransfer) {
        self.receiveNFTTransfer(msg);
    }

    receive(msg: GetStaticData) {
        self.receiveGetStaticData(msg);
    }

    get fun get_nft_data(): GetNftData {
        return self.getNftData();
    }

    fun receiveNFTTransfer(msg: NFTTransfer) {
        let ctx: Context = context();

        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= msg.forwardAmount);
        // only the collection contract can initialize the NFT
        nativeThrowUnless(codeUnauthorized, ctx.sender == self.collection);
        nativeThrowUnless(codeNftAlreadyInitialized, !self.initialized);
        nativeThrowUnless(codeNftCustomPayloadInvalid, msg.customPayload != null);

        let prevOwner = self.owner;
        self.owner = msg.newOwner;
        self.individualContent = msg.customPayload!!;
        self.initialized = true;

        // forward
        if (msg.forwardAmount > 0) {
            send(SendParameters{
                to: msg.responseDestination,
                value: msg.forwardAmount,
                bounce: false,
                body: OwnershipAssigned{
                    queryId: msg.queryId,
                    prevOwner: prevOwner,
                    forwardPayload: msg.forwardPayload,
                }.toCell(),
            });
        }

        // refund the remaining balance to the responseDestination
        self.reserveValue(0);
        send(SendParameters{
            to: msg.responseDestination,
            value: 0,
            mode: SendRemainingBalance,
            bounce: false,
            body: Excesses{
                queryId: msg.queryId
            }.toCell(),
        });
    }

    fun receiveGetStaticData(msg: GetStaticData) {
        let ctx: Context = context();

        self.reserveValue(0);
        send(SendParameters {
            to: ctx.sender,
            value: 0,
            mode: SendRemainingBalance,
            bounce: true,
            body: ReportStaticData{
                queryId: msg.queryId,
                index: self.itemIndex,
                collection: self.collection
            }.toCell(),
        });
    }

    fun getNftData(): GetNftData {
        return GetNftData {
            init: self.initialized,
            index: self.itemIndex,
            collectionAddress: self.collection,
            ownerAddress: self.owner,
            individualContent: self.individualContent
        };
    }
}

// Common is the common trait that contains some common and useful traits.
trait Common with Txable, Deployable {
    owner: Address;
    staticTax: Int;
    // lockedValue is the value that is locked in the contract,
    // can not be withdrawn by the owner.
    lockedValue: Int;

    // default to forward excesses to the owner
    receive(msg: Excesses) {
        self.receiveExcesses(msg);
    }

    // this is a non-standard method,
    // allows the owner to withdraw unlocked balances
    receive("withdraw") {
        self.receiveWithdraw();
    }

    get fun tonBalance(): Int {
        return myBalance();
    }

    virtual fun receiveWithdraw() {
        let ctx: Context = context();
        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);
        nativeThrowUnless(codeBalanceNotSufficient,
            myBalance() > (self.lockedValue + self.staticTax));

        // if there is some locked value in the contract,
        // should reserve the balance a little more than the locked value.
        if (self.lockedValue != 0) {
            nativeReserve(self.lockedValue + self.staticTax, ReserveExact);
        }

        send(SendParameters{
                to: self.owner,
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: Excesses{queryId: 0}.toCell()
            }
        );
    }

    // can be used to reserve the balance for SendRemainingBalance.
    // default to reserve the balance before current transaction plus staticTax.
    //
    // if lockedValue has been increased, the delta should be positive.
    virtual fun reserveValue(delta: Int) {
        let ctx = context();
        let val = max((myBalance() - ctx.value) + self.staticTax, self.lockedValue + self.staticTax);
        nativeReserve(val + delta, ReserveExact);
    }

    virtual fun receiveExcesses(msg: Excesses) {
        self.reserveValue(0);
        send(SendParameters{
                to: self.owner,
                bounce: false,
                value: 0,
                mode: SendRemainingBalance,
                body: msg.toCell(),
            }
        );
    }
}

trait Txable {
    owner: Address;
    // staticTax is the tax fee that is charged for each transaction.
    // the tax fee will be saved in the contract's balance.
    staticTax: Int;

    receive(msg: SetStaticTax) {
        self.receiveSetStaticTax(msg);
    }

    get fun staticTax(): Int {
        return self.staticTax;
    }

    virtual fun receiveSetStaticTax(msg: SetStaticTax) {
        nativeThrowUnless(codeUnauthorized, sender() == self.owner);

        self.staticTax = msg.staticTax;
        let answer = beginString()
            .concat("set static tax fee to ")
            .concat(msg.staticTax.toString())
            .toString();
        self.reply(answer.asComment());
    }
}