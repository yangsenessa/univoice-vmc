import { useEffect, useState } from 'react';
import { fmtInt, fmtUvBalance } from '@/utils'
import Paging from '@/components/paging';

function MyUnivoicePage() {

  const [summaryData, setSummaryData] = useState({
    rewards: 0,
    claimable: 0,
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
      minner: 'ewrtertwerdfsdfadsfstw...fasfasfasdfas',
      timestamp: new Date().toISOString(),
      block: 'ewqewqre...casd',
      amount: '1024123456789',
      claimStat: 'Complete'
    },{
      id: 2,
      minner: 'ewrtertwerdfsdfadsfstw...fasfasfasdfas',
      timestamp: new Date().toISOString(),
      block: 'ewqewqre...casd',
      amount: '1024123456789',
      claimStat: 'Complete'
    },{
      id: 3,
      minner: 'ewrtertwerdfsdfadsfstw...fasfasfasdfas',
      timestamp: new Date().toISOString(),
      block: 'ewqewqre...casd',
      amount: '1024123456789',
      claimStat: 'Complete'
    },{
      id: 4,
      minner: 'ewrtertwerdfsdfadsfstw...fasfasfasdfas',
      timestamp: new Date().toISOString(),
      block: 'ewqewqre...casd',
      amount: '1024123456789',
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
      rewards: 1234567800000000,
      claimable: 123123456789,
    }
    setSummaryData(data)
    // TODO
  }

  const loadLicense = () => {
    const data = [{
      id: 1,
      imgurl: 'http://y.tiancaikeji.cn/aa/nft2.png'
    },{
      id: 2,
      imgurl: 'http://y.tiancaikeji.cn/aa/nft2.png'
    },{
      id: 3,
      imgurl: 'http://y.tiancaikeji.cn/aa/nft2.png'
    },]
    setLicenseData(data)
  }

  const clickClaim = () => {
    // TODO
  }
  
  return (
    <div className="uv-container-1 pb-[28px] pg-dashboard" style={{flexBasis: '100%'}}>
      <div className="sub-qa-block pt-[148px] flex flex-col items-center justify-end">
        <div className="txt-title text-[48px] text-center">My Univoice</div>
        <div className="qa-block-txt text-[24px] text-center">Look at my data</div>
      </div>
      <div className="sub-qa-block">
        <div className="qa-block-title mb-[30px]">My Performance</div>
        <div className="pannel-myunivoice-summary grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="rewards-panel">
            <div className="label">Token Rewards</div>
            <div className="data">
              <div className="val">{fmtUvBalance(summaryData.rewards)}</div>
            </div>
          </div>
          <div className="claimable-panel">
            <div>
              <div className="label">Rewards Claimable</div>
              <div className="data">
                <div className="val">{fmtUvBalance(summaryData.claimable)}</div>
              </div>
            </div>
            <div className="btn-link-1 ml-[20px]" onClick={clickClaim}>Claim</div>
          </div>
        </div>
      </div>
      
      <div className="sub-qa-block myunivoice-license">
        <div className="qa-block-title mb-[30px]">License</div>
        {
        licenseData.length === 0 ? 
        <div>no data</div>
        :
        <div className="license-block grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[80px]">
        {licenseData.map((el: { id: string; imgurl: string; }) => (
          <div key={el.id} className="license">
            <img className="license-img img-fixed" src={el.imgurl} />
          </div>
        ))}
        </div>
        }
      </div>
      
      <div className="sub-qa-block myunivoice-transactions">
        <div className="qa-block-title mb-[30px]">Transactions</div>
        <div className="tbl-paged">
          <div className="tbl">
            <div className="tbl-r tbl-r-title">
              <div className="tbl-cell-title">Minner</div>
              <div className="tbl-cell-title">Timestamp</div>
              <div className="tbl-cell-title">Block Index</div>
              <div className="tbl-cell-title">Tokens</div>
              <div className="tbl-cell-title">Claim State</div>
            </div>
          {transactionData.map((el: { id: string; minner: string; timestamp: string; block: string; amount: string | number; claimStat: string; }) => (
            <div key={el.id} className="tbl-r">
              <div className="tbl-cell">{el.minner}</div>
              <div className="tbl-cell">{el.timestamp}</div>
              <div className="tbl-cell">{el.block}</div>
              <div className="tbl-cell">{fmtUvBalance(el.amount)}<span className="token-unit">UV</span></div>
              <div className="tbl-cell">{el.claimStat}</div>
            </div>
          ))}
          </div>
          <Paging pageNum={transactionPage.pageNum} totalPage={transactionPage.totalPage} queryHandler={queryTransaction} />
        </div>
      </div>

      <div className="relative w-full rounded-[10px] bg-[#222] h-[440px] p-[50px]">
        <div className="mt-[45px] text-[60px]">Get more License</div>
        <div className="btn-link-1 absolute bottom-[50px] left-[50px] w-[320px] h-[60px]">Coming Soon</div>
      </div>
    </div>
  )
}
export default MyUnivoicePage;