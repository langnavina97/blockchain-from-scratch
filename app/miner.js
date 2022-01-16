const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction");

class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.p2pServer = p2pServer;
        this.wallet = wallet;
    }

    mine() {
        // include a reward for the miner
        const validTransactions = this.transactionPool.validTransactions();
        validTransactions.push(
            Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
        );
        // create a block consisting of the valid transactions
        const block = this.blockchain.addBlock(validTransactions);
        // sync the chains in the peer to peer sever
        this.p2pServer.syncChains();
        // clear the transactionPool
        this.transactionPool.clear();
        // broadcast to every miner to clear the transaction pool
        this.p2pServer.broadcastClearTransactions();

        return block;
    }
}

module.exports = Miner;