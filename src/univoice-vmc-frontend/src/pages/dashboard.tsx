import { useEffect, useState } from 'react';
import { fmtInt, fmtUvBalance } from '@/utils';
import {poll_balance} from '@/utils/call_vmc_backend';
import Paging from '@/components/paging';

function DashboardPage() {

  const [summaryData, setSummaryData] = useState({
    tokenPoolAmount: 0,
    totalListener: 0,
    blockCreatedNumber: 0,
    totalTransactions: 0,
    blockProduceSpeed: 0,
    tokensPerBlocks: 0,
  });
  const [transactionData, setTransactionData] = useState<any>([]);
  const [transactionPage, setTransactionPage] = useState({
    pageNum: 0,
    totalPage: 0
  });

  const queryTransaction = (pagenum: number) => {
    let newData: any[] = [{
      id: 1,
      timestamp: new Date().toISOString(),
      block: 'ewrtertwerdfsdfadsfstw...fasfasfasdfas',
      transactionType: 'Transfer',
      amount: '1024123450000',
      to: 'ewqewqre...casd'
    },{
      id: 2,
      timestamp: new Date().toISOString(),
      block: 'ewrtertwerdfsdfadsfstw...fasfasfasdfas',
      transactionType: 'Transfer',
      amount: '1024123456700',
      to: 'ewqewqre...casd'
    },{
      id: 3,
      timestamp: new Date().toISOString(),
      block: 'ewrtertwerdfsdfadsfstw...fasfasfasdfas',
      transactionType: 'Transfer',
      amount: '1024000000000',
      to: 'ewqewqre...casd'
    },{
      id: 4,
      timestamp: new Date().toISOString(),
      block: 'ewrtertwerdfsdfadsfstw...fasfasfasdfas',
      transactionType: 'Transfer',
      amount: '1024123456789',
      to: 'ewqewqre...casd'
    }];
    setTransactionData(newData);
    let p = transactionPage;
    p.pageNum = pagenum
    // p.totalPage = 10
    setTransactionPage(p);
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    loadSummary()
    queryTransaction(1)
  }, []);
  
  const loadSummary = () => {
    const data = {
      tokenPoolAmount: 211234567800000000,
      totalListener: 123456789,
      blockCreatedNumber: 123456,
      totalTransactions: 123456789123456,
      blockProduceSpeed: 123.456,
      tokensPerBlocks: 12345600000000,
    }
    loadTokenPoolAmount();
    setSummaryData(data)
    // TODO
  }

  const loadTokenPoolAmount = async () => {
    poll_balance().then(balance_result=>{
      console.log("get poll balance is :" + balance_result);
      summaryData.tokenPoolAmount = Number(balance_result) ;
      setSummaryData(summaryData);

    }).catch((e) => {
      console.log('reConnectPlug exception!', e)
    })

  }
      

  return (
    <div className="uv-container-1 pb-[28px] pg-dashboard" style={{flexBasis: '100%'}}>
      <div className="sub-qa-block pt-[148px] flex flex-col items-center justify-end">
        <div className="txt-title text-[48px] text-center">Dashboard</div>
        <div className="qa-block-txt text-[24px] text-center">The following is a presentation of some data regarding Univoice Token.</div>
      </div>
      <div className="sub-qa-block dashboard-summary">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
          <div className="pannel-dashboard-summary">
            <div className="label">Token Pool Amount</div>
            <div className="data">
              <div className="val">{fmtUvBalance(summaryData.tokenPoolAmount)}</div>
              <div className="unit">Blocks</div>
            </div>
          </div>
          <div className="pannel-dashboard-summary">
            <div className="label">Total Listener</div>
            <div className="data">
              <div className="val">{fmtInt(summaryData.totalListener)}</div>
            </div>
          </div>
          <div className="pannel-dashboard-summary">
            <div className="label">Block Created Number</div>
            <div className="data">
              <div className="val">{fmtInt(summaryData.blockCreatedNumber)}</div>
              <div className="unit">Blocks</div>
            </div>
          </div>
          <div className="pannel-dashboard-summary">
            <div className="label">Total Transactions</div>
            <div className="data">
              <div className="val">{fmtInt(summaryData.totalTransactions)}</div>
              <div className="unit">TX</div>
            </div>
          </div>
          <div className="pannel-dashboard-summary">
            <div className="label">Block Produce Speed</div>
            <div className="data">
              <div className="val">{fmtInt(summaryData.blockProduceSpeed)}</div>
            </div>
          </div>
          <div className="pannel-dashboard-summary">
            <div className="label">Tokens Per-Blocks</div>
            <div className="data">
              <div className="val">{fmtUvBalance(summaryData.tokensPerBlocks)}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="sub-qa-block dashboard-transactions">
        <div className="qa-block-title mb-[30px]">Transactions</div>
        <div className="tbl-paged">
          <div className="tbl">
            <div className="tbl-r tbl-r-title">
              <div className="tbl-cell-title">Block ID</div>
              <div className="tbl-cell-title">Type</div>
              <div className="tbl-cell-title">Amount</div>
              <div className="tbl-cell-title">To</div>
              <div className="tbl-cell-title">Timestamp</div>
            </div>
          {transactionData.map((el: { id: string; timestamp: string; block: string; transactionType: string; amount: string | number; to: string; }) => (
            <div key={el.id} className="tbl-r">
              <div className="tbl-cell">{el.block}</div>
              <div className="tbl-cell">{el.transactionType}</div>
              <div className="tbl-cell">{fmtUvBalance(el.amount)}<span className="token-unit">UV</span></div>
              <div className="tbl-cell">{el.to}</div>
              <div className="tbl-cell">{el.timestamp}</div>
            </div>
          ))}
          </div>
          <Paging pageNum={transactionPage.pageNum} totalPage={transactionPage.totalPage} queryHandler={queryTransaction} />
        </div>
      </div>
    </div>
  )
}
export default DashboardPage;