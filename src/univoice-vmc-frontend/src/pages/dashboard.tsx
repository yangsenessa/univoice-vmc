import { useEffect, useState } from 'react';
import { fmtInt, fmtUvBalance } from '@/utils';
import {poll_balance} from '@/utils/call_vmc_backend';
import Paging from '@/components/paging';
import style from './dashboard.module.scss'
import ImgBgTopLight from '@/assets/imgs/bg_toplight.png'
import ImgBgTopLight2 from '@/assets/imgs/bg_toplight_over.png'
import type {Result} from 'declarations/univoice-vmc-backend/univoice-vmc-backend.did';


function DashboardPage() {

  const [summaryData, setSummaryData] = useState({
    tokenPoolAmount:0,
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
  const [licenseData, setLicenseData] = useState<any>([]);

  const queryTransaction = (pagenum: number) => {
    let newData: any[] = [{
      id: 1,
      timestamp: new Date().toISOString(),
      block: 'ewrtertwerdfsdfadsfstw...fasfasfasdfas',
      transactionType: 'Transfer',
      amount: '1024123450000',
      from: 'ewqewqre...casd',
      to: 'ewqewqre...casd'
    },{
      id: 2,
      timestamp: new Date().toISOString(),
      block: 'ewrtertwerdfsdfadsfstw...fasfasfasdfas',
      transactionType: 'Transfer',
      amount: '1024123456700',
      from: 'ewqewqre...casd',
      to: 'ewqewqre...casd'
    },{
      id: 3,
      timestamp: new Date().toISOString(),
      block: 'ewrtertwerdfsdfadsfstw...fasfasfasdfas',
      transactionType: 'Transfer',
      amount: '1024000000000',
      from: 'ewqewqre...casd',
      to: 'ewqewqre...casd'
    },{
      id: 4,
      timestamp: new Date().toISOString(),
      block: 'ewrtertwerdfsdfadsfstw...fasfasfasdfas',
      transactionType: 'Transfer',
      amount: '1024123456789',
      from: 'ewqewqre...casd',
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
    loadLicense()
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
    setSummaryData(data)

    loadTokenPoolAmount();
    // TODO
  }

  const loadLicense = () => {
    const data = [{
      id: 1,
      imgurl: 'http://y.tiancaikeji.cn/aa/nft2.png',
      intro: 'Goodluck charm',
      txt: 'hello world'
    },{
      id: 2,
      imgurl: 'http://y.tiancaikeji.cn/aa/nft2.png',
      intro: 'Goodluck charm Good luck charm Goodluck charm Goodluck charm',
      txt: 'hello world hello world hello world hello world hello world'
    },{
      id: 3,
      imgurl: 'http://y.tiancaikeji.cn/aa/nft2.png',
      intro: 'Goodluck charm',
      txt: 'hello world'
    },{
      id: 4,
      imgurl: 'http://y.tiancaikeji.cn/aa/nft2.png',
      intro: 'Goodluck charm',
      txt: 'hello world'
    },{
      id: 5,
      imgurl: 'http://y.tiancaikeji.cn/aa/nft2.png',
      intro: 'Goodluck charm',
      txt: 'hello world'
    },]
    setLicenseData(data)
  }

  const loadTokenPoolAmount = async () => {
   
    let result = await poll_balance(); 
    console.log("Call pool balance = "+ String(result));
    if("Ok" in result) {
      let balance = (result as {'Ok': BigInt}).Ok;
      summaryData.tokenPoolAmount = Number(balance);
      setSummaryData(summaryData);

    }
    if("Err" in result) {
      console.log("Balance result Err");
    }

  }
      

  return (
    <div className="uv-container-1 container-subpg pg-dashboard">
      <img src={ImgBgTopLight} className={`img-fixed ${style.toplight}`} />
      <img src={ImgBgTopLight2} className={`img-fixed ${style.toplight2}`} />
      <div className={`sub-qa-block ${style.panel_0}`}>
        <div className={style.pg_title}>Dashboard</div>
        <div className={style.pg_intro}>The following is a presentation of some data regarding Univoice Token.</div>
      </div>
      <div className={`sub-qa-block ${style.summary}`}>
          <div className={style.item}>
            <div className={style.label}>Token Pool Amount</div>
            <div className={style.data}>
              <div className={style.val}>{fmtUvBalance(summaryData.tokenPoolAmount)}</div>
              <div className={style.unit}>$UVC</div>
            </div>
          </div>
          <div className={style.item}>
            <div className={style.label}>Total Listener</div>
            <div className={style.data}>
              <div className={style.val}>{fmtInt(summaryData.totalListener)}</div>
            </div>
          </div>
          <div className={style.item}>
            <div className={style.label}>Block Created Number</div>
            <div className={style.data}>
              <div className={style.val}>{fmtInt(summaryData.blockCreatedNumber)}</div>
              <div className={style.unit}>Blocks</div>
            </div>
          </div>
          <div className={style.item}>
            <div className={style.label}>Total Transactions</div>
            <div className={style.data}>
              <div className={style.val}>{fmtInt(summaryData.totalTransactions)}</div>
              <div className={style.unit}>TX</div>
            </div>
          </div>
          <div className={style.item}>
            <div className={style.label}>Block Produce Speed</div>
            <div className={style.data}>
              <div className={style.val}>{fmtInt(summaryData.blockProduceSpeed)}</div>
            </div>
          </div>
          <div className={style.item}>
            <div className={style.label}>Tokens Per-Blocks</div>
            <div className={style.data}>
              <div className={style.val}>{fmtUvBalance(summaryData.tokensPerBlocks)}</div>
            </div>
          </div>
      </div>
      
      <div className="sub-qa-block">
        <div className={style.block_title}>Gallery of License</div>
        <div className={style.nfts}>
        {licenseData.map((el: { id: string; imgurl: string; intro: string; txt: string}) => (
          <div key={el.id} className={style.nft}>
            <img className={`img-fixed ${style.img}`} src={el.imgurl} />
            <div className={style.info}>
              <div className={style.iconimg}></div>
              <div className={style.infoctx}>
                <div className={style.intro}>{el.intro}</div>
                <div className={style.txt}>{el.txt}</div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      <div className="sub-qa-block transactions">
        <div className={style.block_title}>Transactions</div>
        <div className="tbl-paged">
          <div className="tbl">
            <div className={`tbl-r tbl-r-title ${style.transactions_row}`}>
              <div className="tbl-cell-title">Block ID</div>
              <div className="tbl-cell-title">Type</div>
              <div className="tbl-cell-title">Amount</div>
              <div className="tbl-cell-title">From</div>
              <div className="tbl-cell-title">To</div>
              <div className="tbl-cell-title">Timestamp</div>
            </div>
          {transactionData.map((el: { id: string; timestamp: string; block: string; transactionType: string; amount: string | number; from: string; to: string; }) => (
            <div key={el.id} className={`tbl-r ${style.transactions_row}`}>
              <div className="tbl-cell">{el.block}</div>
              <div className="tbl-cell"><div className={style.trans_type}>{el.transactionType}</div></div>
              <div className="tbl-cell">{fmtUvBalance(el.amount)}<span className="token-unit">UVC</span></div>
              <div className="tbl-cell">{el.from}</div>
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