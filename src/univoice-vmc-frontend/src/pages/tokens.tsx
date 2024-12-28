import { useEffect, useState } from 'react';
import {getBalance, getTransactions} from "@/utils/icrcService";

function UvTokensPage() {
  const [selectedTab, setSelectedTab] = useState('1');
  const [accountId, setAccountId] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  const clickTab = (tabName: string) => {
    if (selectedTab === tabName) {
      return;
    }
    setSelectedTab(tabName); 
  }

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const userBalance = await getBalance(accountId);
      setBalance(userBalance);
    } catch (err) {
      setError("Failed to fetch balance. Please check the accountId.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const txns = await getTransactions(accountId);
      setTransactions(txns);
    } catch (err) {
      setError("Failed to fetch transactions. Please check the accountId.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="uv-container-1 pb-[28px] pg-token" style={{flexBasis: '100%'}}>
      <div className="sub-qa-block pt-[148px]">
        <div className="qa-block-title text-[48px]">Token</div>
        <div className="qa-block-txt text-[24px]">“ Understand that voice, see that person, comprehend that heart ”, communicate smoothly and create harmoniously together.</div>
      </div>
      <div className="sub-block-split mt-[120px] mb-[110px]"></div>

      <div className="sub-qa-block">
        <div className="mb-4">
          <input
          type="text"
          placeholder="Enter Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="p-2 border rounded mb-2 w-full"/>

          <button
            onClick={fetchBalance}
            disabled={loading}
            className="bg-blue-500 text-white py-2 px-4 rounded mr-2">
            Get Balance
          </button>

          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="bg-green-500 text-white py-2 px-4 rounded">
            Get Transactions
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p> }
        {balance && (
            <p className="text-xl font-semibold mt-2">
              Balance: <span className="text-blue-600">{balance}</span>
            </p>
        )}
      </div>

      <div className="sub-qa-block tabs">
        <div className="tab-bar">
          <div className={`tab-bar-item ${selectedTab === '1' ? 'tab-bar-item-selected' : ''}`} onClick={()=>clickTab('1')}>Mining</div>
          <div className={`tab-bar-item ${selectedTab === '2' ? 'tab-bar-item-selected' : ''}`} onClick={()=>clickTab('2')}>License</div>
        </div>
        <div className="tab-content">
          {selectedTab === '1' &&
          <div></div>}
          {selectedTab === '2' &&
          <div className="tbl-wrap"><div className="tbl grid grid-cols-4">
            <div className="tbl-cell-title tbl-cell-row-start">Datetime</div>
            <div className="tbl-cell-title">NFT</div>
            <div className="tbl-cell-title">BlockIndex</div>
            <div className="tbl-cell-title">Tokens</div>
            <div className="tbl-cell tbl-cell-row-start">2024-12-27 18:18:18</div>
            <div className="tbl-cell">ewrtertwertw</div>
            <div className="tbl-cell">dsfsadfasdg</div>
            <div className="tbl-cell">12.3456</div>
            <div className="tbl-cell tbl-cell-row-start">2024-12-26 18:18:18</div>
            <div className="tbl-cell">ewrtertwertw</div>
            <div className="tbl-cell">dsfsadfasdg</div>
            <div className="tbl-cell">12.3456</div>
            <div className="tbl-cell tbl-cell-row-start">2024-12-25 18:18:18</div>
            <div className="tbl-cell">ewrtertwertw</div>
            <div className="tbl-cell">dsfsadfasdg</div>
            <div className="tbl-cell">12.3456</div>
            <div className="tbl-cell tbl-cell-row-start">2024-12-24 18:18:18</div>
            <div className="tbl-cell">ewrtertwertw</div>
            <div className="tbl-cell">dsfsadfasdg</div>
            <div className="tbl-cell">12.3456</div>
          </div></div>}
        </div>
      </div>
      {/* <div className="sub-qa-block">
        <div className="qa-block-title">How to become a speaker?</div>
        <div className="qa-block-txt">
          <p>Useing Univoice, your omnipresent 'tree hole' (dapp/telegram miniapp...), to express your voice freely and participate in Univoice's voice-themed activities.</p>
          <p>Your voice will be encrypted and stored on the blockchain, giving you a secure 'tree hole' and assigning value to your voice.</p>
        </div>
      </div>
      <div className="sub-qa-block">
        <div className="qa-block-title">How to earn?</div>
        <div className="qa-block-txt">Accumulate points to earn rewards.</div>
      </div> */}
    </div>
  )
}

export default UvTokensPage;