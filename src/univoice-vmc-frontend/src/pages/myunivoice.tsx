import { useEffect, useState } from 'react';
import { fmtInt, fmtUvBalance, fmtTimestamp, fmtSummaryAddr } from '@/utils';
import Paging from '@/components/paging';
import style from './myunivoice.module.scss'
import ImgBgGetMoreNft from '@/assets/imgs/bg_getmorenft.png'
import ImgNftThum from '@/assets/imgs/nft_thum.png'
import { showToast } from '@/components/toast';

import {sum_claimed_mint_ledger,sum_unclaimed_mint_ledger_onceday} from "@/utils/call_vmc_backend";

import { useAcountStore } from '@/stores/user';

const { getPrincipal } = useAcountStore();

function MyUnivoicePage() {

  const [summaryData, setSummaryData] = useState({
    rewards: '0',
    claimable: '0',
  });
  const [transactionData, setTransactionData] = useState<any>([]);
  const [transactionPage, setTransactionPage] = useState({
    pageNum: 0,
    totalPage: 0
  });
  const [licenseData, setLicenseData] = useState<any>([]);
  const [claimable, setClaimable] = useState(true)

  const queryTransaction = (pagenum: number) => {
    let newData: any[] = [{
      id: 1,
      minner: '6nimk-xpves-34bk3-zf7dp-nykqv-h3ady-iu3ze-xplot-vm4uy-ptbel-3qe',
      timestamp: new Date().getTime() * 1000,
      block: '6nimk-xpves-34bk3-zf7dp-nykqv-h3ady-iu3ze-xplot-vm4uy-ptbel-3qe',
      amount: 1024123456789,
      claimStat: 'Complete'
    },{
      id: 2,
      minner: 'ewrtertwerdfsdfadsfstw...fasfasfasdfas',
      timestamp: new Date().getTime() * 1000,
      block: 'ewqewqrecasd',
      amount: 1024123456789,
      claimStat: 'Complete'
    },{
      id: 3,
      minner: 'ewrtertwerdfsdfadsfstw...fasfasfasdfas',
      timestamp: new Date().getTime(),
      block: 'ewqewqrecasd',
      amount: 1024123456789,
      claimStat: 'Complete'
    },{
      id: 4,
      minner: 'ewrtertwerdfsdfadsfstw...fasfasfasdfas',
      timestamp: new Date().getTime(),
      block: 'ewqewqrecasd',
      amount: 1024123456789,
      claimStat: 'Complete'
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
      rewards: '1234567800000000',
      claimable: '123123456789',
    }
    let principal_id = getPrincipal();
    console.log("Current principal is :", principal_id);
    sum_claimed_mint_ledger(principal_id).then(
      sum_tokens => {
        data.rewards = String(sum_tokens);
      }
    
    )
    sum_unclaimed_mint_ledger_onceday(principal_id).then(unclaimed_tokens =>{
      data.claimable = String(unclaimed_tokens) ;

    })
    setSummaryData(data)
    // TODO
  }

  const catchNftImgFail = (event) => {
    event.target.src = ImgNftThum
  }

  const loadLicense = () => {
    const data = [{
      id: 1,
      imgurl: 'abc',
      idx: '01',
      intro: 'Goodluck charm Goodluck charm Goodluck charm Goodluck charm Goodluck charm Goodluck charm',
      owners: 21000,
      quantity: 10,
      myhashs: '#2001,#2002,#2003,#2004,#2005,#2006,#2007,#2008,#2009,#2010,#2002,#2003,#2004,#2005,#2006,#2007,#2008,#2009,#2010,#2002,#2003,#2004,#2005,#2006,#2007,#2008,#2009,#2010,#2002,#2003,#2004,#2005,#2006,#2007,#2008,#2009,#2010'
    },{
      id: 2,
      imgurl: 'http://y.tiancaikeji.cn/aa/nft2.png',
      idx: '02',
      intro: 'Goodluck charm2',
      owners: 21000,
      quantity: 1,
      myhashs: '#2001'
    },{
      id: 3,
      imgurl: 'http://y.tiancaikeji.cn/aa/nft2.png',
      idx: '03',
      intro: 'Goodluck charm3',
      owners: 21000,
      quantity: 8,
      myhashs: '#2001,#2002,#2003,#2004,#2005,#2006,#2007,#2008'
    },]
    setLicenseData(data)
  }

  const clickClaim = () => {
    // setClaimable(false)
    // showToast(new Date().toISOString())
    // showToast(new Date().toISOString(), 'error')
    showToast('say something', 'warn')
    // TODO
  }

  const clickCopyMyNftHashs = (str: string) => {
    navigator.clipboard.writeText(str)
  }
  
  return (
    <div className="uv-container-1 container-subpg pg-dashboard">
      <div className={`sub-qa-block ${style.panel_0}`}>
        <div className={style.pg_title}>My Univoice</div>
        <div className={style.pg_intro}>Look at my data</div>
      </div>
      <div className="sub-qa-block">
        <div className={style.block_title}>My Performance</div>
        <div className={style.summary}>
          <div className={style.rewards_panel}>
            <div className={style.label}>Token Rewards</div>
            <div className={style.data}>
              <div className={style.val}>{fmtUvBalance(summaryData.rewards)}</div>
              <div className={style.unit}>$UVC</div>
            </div>
          </div>
          <div className={style.claimable_panel}>
            <div>
              <div className={style.label}>Rewards Claimable</div>
              <div className={style.data}>
                <div className={style.val}>{fmtUvBalance(summaryData.claimable)}</div>
                <div className={style.unit}>$UVC</div>
              </div>
            </div>
            {
              claimable ?
              <div className={`btn-link-1 ${style.btn_claim}`} onClick={clickClaim}>Claim</div>
              :
              <div className={style.btn_claim_disable}>Claim</div>
            }
            
          </div>
        </div>
      </div>
      
      <div className="sub-qa-block">
        <div className={style.block_title}>License</div>
        {
        licenseData.length === 0 ? 
        <div className="nodata">
          <div className="nodata-img"></div>
          <div className="nodata-txt">No data</div>
        </div>
        :
        <div className={style.licenses}>
          <div className={style.tbl_r}>
            <div className={style.title}>#</div>
            <div className={style.title}>Collection</div>
            <div className={style.title}>Owners</div>
            <div className={style.title}>The number I hold</div>
            <div className={style.title}>Quantity</div>
          </div>
        {licenseData.map((el: { id: string; idx: string; imgurl: string; intro: string; owners: number; quantity: number; myhashs: string}) => (
          <div key={el.id} className={style.tbl_r}>
            <div className={style.cell}>{el.idx}</div>
            <div className={style.cell}>
                <div className={style.img_bg}><div className={style.img_wrap}><img className={`${style.img} img-fixed`} src={el.imgurl} onError={catchNftImgFail} /></div></div>
              <div className={style.intro}>{el.intro}</div>
            </div>
            <div className={style.cell}>{fmtInt(el.owners)}</div>
            <div className={style.cell}>
              <div className={style.myhashs}>{el.myhashs}</div>
              <div className={style.copy} onClick={() => {clickCopyMyNftHashs(el.myhashs)}}></div>
            </div>
            <div className={`${style.cell} ${style.quantity}`}>+{fmtInt(el.quantity)}</div>
          </div>
        ))}
        </div>
        }
      </div>
      
      <div className="sub-qa-block transactions">
        <div className={style.block_title}>Transactions</div>
        {
        transactionData.length === 0 ? 
        <div className="nodata">
          <div className="nodata-img"></div>
          <div className="nodata-txt">No data</div>
        </div>
        :
        <div className="tbl-paged">
          <div className="tbl">
            <div className={`tbl-r tbl-r-title ${style.transactions_row}`}>
              <div className="tbl-cell-title">Minner</div>
              <div className="tbl-cell-title">Timestamp</div>
              <div className="tbl-cell-title">Block Index</div>
              <div className="tbl-cell-title">Tokens</div>
              <div className="tbl-cell-title">Claim State</div>
            </div>
          {transactionData.map((el: { id: string; minner: string; timestamp: number; block: string; amount: string | number; claimStat: string; }) => (
            <div key={el.id} className={`tbl-r ${style.transactions_row}`}>
              <div className="tbl-cell">{fmtSummaryAddr(el.minner)}</div>
              <div className="tbl-cell">{fmtTimestamp(el.timestamp)}</div>
              <div className="tbl-cell">{fmtSummaryAddr(el.block)}</div>
              <div className="tbl-cell">{fmtUvBalance(el.amount)}<span className="token-unit">$UVC</span></div>
              <div className="tbl-cell">{el.claimStat}</div>
            </div>
          ))}
          </div>
          <Paging pageNum={transactionPage.pageNum} totalPage={transactionPage.totalPage} queryHandler={queryTransaction} />
        </div>
        }
      </div>

      <div className="sub-qa-block">
        <div className={style.getmore_nft}>
          <img src={ImgBgGetMoreNft} className={style.img}/>
          <div className={style.title}>Get more License</div>
          <div className={`${style.btn} btn-link-1`}>Coming Soon</div>
        </div>
      </div>
    </div>
  )
}
export default MyUnivoicePage;