import { useEffect, useState } from 'react';
import { fmtInt, fmtUvBalance, fmtTimestamp, fmtSummaryAddr } from '@/utils';
import {reConnectPlug,call_tokens_of,call_get_transactions_listener} from '@/utils/icplug';
import type {UnvMinnerLedgerRecord,TransferTxState} from 'declarations/univoice-vmc-backend/univoice-vmc-backend.did';
import Paging from '@/components/paging';
import style from './myunivoice.module.scss'
import ImgBgGetMoreNft from '@/assets/imgs/bg_getmorenft.png'
import ImgNftThum from '@/assets/imgs/nft_thum.png'
import { showToast } from '@/components/toast';

import {fetch_sumary_for_myvoice,claim_to_account_by_principal,get_miner_jnl} from "@/utils/call_vmc_backend";

import { useAcountStore } from '@/stores/user';
import { timeStamp } from 'console';


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
  const { getPrincipal } = useAcountStore();


  const queryTransaction = (pagenum: number) => {

    if(!getPrincipal()){
      reConnectPlug();
    }
    let minner_txs = [];
    get_miner_jnl(getPrincipal(), BigInt(5*pagenum),BigInt(5)).then(
      miner_jnls =>{
        miner_jnls.forEach((element:UnvMinnerLedgerRecord,index)=> {
          console.log("Fetch one trx_element:", element);
          let data={
            id:index,
            minner:element.minner_principalid,
            timestamp:element.gmt_claim_time == BigInt(0)?Number(element.gmt_datetime):Number(element.gmt_claim_time),
            block:String(element.block_index[0]),
            amount:Number(element.tokens),
            claimStat: 'Claimed' in element.biz_state? 'Claimed':'WaitClaim'
          };
          minner_txs[index] = data;
        });

      }
    );

    setTransactionData(minner_txs);
    let p = transactionPage;
    p.pageNum = pagenum
    // p.totalPage = 10
    setTransactionPage(p);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSummary();
    loadLicense();
    queryTransaction(0);
  }, []);
  
  const loadSummary = () => {

    let data={
      rewards: '888',
      claimable: '888',
    };
    
    let principal_id = getPrincipal();
    if(!principal_id) {
      reConnectPlug();
    }
    console.log("Current principal is :", principal_id);
    fetch_sumary_for_myvoice(principal_id).then(
      sum_tokens => {
        data.claimable =  String(sum_tokens.sum_unclaimed);
        data.rewards = String(sum_tokens.sum_claimed);
        console.log("get sum_tokens:", sum_tokens);
        console.log("Set summary1");
        setSummaryData(data);
        
      }
    );  
  }

  const catchNftImgFail = (event) => {
    //event.target.src = ImgNftThum
  }

  const loadLicense = () => {
    const dataItem ={ 
       id: 1,
       imgurl: 'https://bafybeibhnv326rmac22wfcxsmtrbdbzjzn5mviykq3rbt4ltqkqqfgobga.ipfs.w3s.link/thum.jpg',
       idx: '01',
       intro: 'Univoice listener',
       owners: 21000,
       quantity: 10,
       myhashs: '#2001,#2002,#2003,#2004,#2005,#2006,#2007,#2008,#2009,#2010,#2002,#2003,#2004,#2005,#2006,#2007,#2008,#2009,#2010,#2002,#2003,#2004,#2005,#2006,#2007,#2008,#2009,#2010,#2002,#2003,#2004,#2005,#2006,#2007,#2008,#2009,#2010'
    }

    const data = [];
    reConnectPlug()
          .then((principal_id) => {
            console.log('reConnectPlug done, pid:', principal_id)
            if (principal_id) {
              //get_miner_license(principal_id);
              
              call_tokens_of(principal_id).then(tokenIds=>{
                let owner_cnt = 0;
                let myhash_str = "";
                console.log("Origin nft tokens is",tokenIds);

                for (let token_id in  tokenIds) {
                    console.log("hold license of token_id", tokenIds[token_id]);
                    owner_cnt +=1;
                    myhash_str += '#'+tokenIds[token_id]+',';

                }
                dataItem.owners = owner_cnt;
                dataItem.myhashs = myhash_str;
                data[0] = dataItem;
                setLicenseData(data);

              })      
            }
          }).catch((e) => {
            console.log('reConnectPlug exception!', e)
          })




    //setLicenseData(data)
  }

  const clickClaim = () => {
    // setClaimable(false)
    // showToast(new Date().toISOString())
    // showToast(new Date().toISOString(), 'error')
    if(getPrincipal()){
      reConnectPlug();
    }
    claim_to_account_by_principal(getPrincipal()).then(trans_tokens=>{
      showToast("You have claimed "+String(trans_tokens)+" success. You can recheck by your wallet.", 'info');
      loadSummary();
    }

    );
   
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