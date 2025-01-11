import { useEffect, useState } from 'react';
import { fmtInt, fmtUvBalance } from '@/utils';
import {call_tokens_of,reConnectPlug} from '@/utils/icplug';
import {poll_balance,get_total_listener,get_main_site_summary,get_miner_license} from '@/utils/call_vmc_backend';
import Paging from '@/components/paging';
import style from './dashboard.module.scss'
import ImgBgTopLight from '@/assets/imgs/bg_toplight.png'
import ImgBgTopLight2 from '@/assets/imgs/bg_toplight_over.png'
import ImgNftThum from '@/assets/imgs/nft_thum.png'
import { useAcountStore } from '@/stores/user';


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

  const { setUserByPlugWallet, getPrincipal, getWalletType } = useAcountStore();


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
  
  const loadSummary = async() => {
    let data = {
      tokenPoolAmount:2100000000000,
      totalListener: 2100,
      blockCreatedNumber: 123456,
      totalTransactions: 123456789123456,
      blockProduceSpeed: 123.456,
      tokensPerBlocks: 12345600000000,
    }
    setSummaryData(data);
    get_main_site_summary().then(
      mainsite_summary=>{
        data = summaryData;
        data.blockCreatedNumber = Number(mainsite_summary.aigcblock_created_number);
        data.tokensPerBlocks = Number(mainsite_summary.token_per_block) ;
        data.totalListener = Number(mainsite_summary.listener_count) ;
        data.tokenPoolAmount = Number(mainsite_summary.token_pool_balance);
        data.blockProduceSpeed = 900;
        setSummaryData(data);

      }

    );
    
    // TODO
  }

   

  const loadLicense = () => {
    reConnectPlug()
          .then((principal_id) => {
            console.log('reConnectPlug done, pid:', principal_id)
            if (principal_id) {
              //get_miner_license(principal_id);
              
              call_tokens_of(principal_id).then(tokenIds=>{
                let index = 0;
                let data =[];
                console.log("Origin nft tokens is",tokenIds);

                for (let token_id in  tokenIds) {
                    console.log("hold license of token_id", tokenIds[token_id]);
            
                    let license_item = {
                      id: Number(tokenIds[token_id]),
                      imgurl: 'https://bafybeibhnv326rmac22wfcxsmtrbdbzjzn5mviykq3rbt4ltqkqqfgobga.ipfs.w3s.link/thum.jpg',
                      intro: 'Univoice listener',
                      txt: 'A liciense for identify as Univoice-Listener.'
                    }
                    data[index]=license_item;
                    index=index+1;

                }
                setLicenseData(data)

              })      
            }
          }).catch((e) => {
            console.log('reConnectPlug exception!', e)
          })

  }

  const loadTokenPoolAmount =  (data) => {
    let balance:BigInt =BigInt(0) ;
     poll_balance().then(result=>{
         console.log("Call pool balance = "+ String(result));
         if("Ok" in result) {
            balance = (result as {'Ok': BigInt}).Ok;
            console.log("Call pool balance Ok ",balance);
            let newData = data;
            data.tokenPoolAmount= Number(balance);
            setSummaryData(data);
          }
          if("Err" in result) {
            console.log("Balance result Err");
          }
     }) 
    
  }

  const load_total_listener =  (data):Number=>{
    let count:number = 0;
    get_total_listener().then(result =>{
      console.log("get_total_listener pre =",result);
      if(result) {
          console.log("get_total_listener=",result)
          count =  Number(result);
          
          data.totalListener = count;
      }
    })
    return count;

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