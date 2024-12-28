import {Principal} from "@dfinity/principal";
import {IcrcLedger} from "@dfinity/ledger-icrc";

const canisterId = "jfqe5-daaaa-aaaai-aqwvq-cai";
export const ledger = new IcrcLedger ({
    canisterId,
    agentOptions: {
        // Internet Computer host
        host: "https://ic0.app",
    },
});

// 获取用户余额
export const getBalance = async (accountId: string): Promise<string> => {
    try {
        const balance = await ledger.getBalance({owner: Principal.fromText(accountId)});
        return balance.toString();
    } catch (error) {
        console.error("Error fetching balance: ", error);
        throw error;
    }
};

// 查询交易记录
export const getTransactions = async (accountId: string, start = 0, limit = 10): Promise<any[]> => {
    try {
        const transactions = await ledger.getTransactions({accountId: Principal.fromText(accountId), start, limit});
        return transactions;
    } catch (error) {
        console.error("Error fetching transactions: ", error);
        throw error;
    }
};



