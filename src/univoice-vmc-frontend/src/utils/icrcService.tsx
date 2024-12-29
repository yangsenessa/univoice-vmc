import {Principal} from "@dfinity/principal";
import {HttpAgent} from "@dfinity/agent";
import {IcrcLedgerCanister, IcrcIndexCanister} from "@dfinity/ledger-icrc";

const canisterId = Principal.fromText("jfqe5-daaaa-aaaai-aqwvq-cai");
const indexCanisterId = Principal.fromText("qoctq-giaaa-aaaaa-aaaea-cai");
const agent = new HttpAgent({host: "https://ic0.app"});

// 初始化
const ledger = IcrcLedgerCanister.create({canisterId, agent});
const indexCanister = IcrcIndexCanister.create({canisterId, agent})

// 获取用户余额
export const getBalance = async (accountId: string): Promise<string> => {
    try {
        const balance = await ledger.balance({owner: Principal.fromText(accountId)});
        return balance.toString();
    } catch (error) {
        console.error("Error fetching balance: ", error);
        throw error;
    }
};

// 查询交易记录
export const getTransactions = async (
    accountId: string,
    maxResults: bigint,
    start?: bigint
) => {
    try {
        // 构造参数
        const params = {
            max_results: maxResults,
            start: start || undefined,
            account: {
                owner: Principal.fromText(accountId),
                subaccount: undefined, // (Uint8Array | number[] | undefined) 类型
            },
        };

        // 调用方法
        const transactions = await indexCanister.getTransactions(params);
        console.log("Fetched transactions:", transactions);
        return transactions;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
};
