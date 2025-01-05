import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PLogoTop from '@/assets/svg/logo_top.svg'
import ImgTwitter from '@/assets/svg/X_w.svg'
import ImgTelegram from '@/assets/svg/telegram_w.svg'
import ImgPlug from '@/assets/imgs/plug.png'
import { plugReady, reConnectPlug, callBalance, initPlug } from '@/utils/icplug';
import { useAcountStore } from '@/stores/user';
import { fmtUvBalance } from '@/utils';

const TopBar = (props:any, ref:any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('');
  const [isLinkWallet,setIsLinkWallet]= useState<boolean>();
  const { setUserByPlugWallet, clearAccount, getUid, getPrincipal, getBalance, setBalance, getWalletType } = useAcountStore();
  const [showProfile, setShowProfile] = useState(false)

  useImperativeHandle(ref, () => ({
    hideProfile: () => {
      setShowProfile(false)
    }
  }))

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const clickHome = () => {
    if (currentPath === '/') return
    navigate('/')
    // navigate('/', { replace: true })
  }

  const clickWallet = () => {
    //miss, let user can reconnect 
    if (getUid()) {
      return;
    }
    const pReady = plugReady();
    if (!pReady) {
      alert('Please install plug-wallet extension first');
    } else {
      loginPlug();
    }
  }

  const clickProfile = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
    reverseShowProfile()
  }

  const clickProfilePanel = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
  }

  const loginPlug = () => {
    reConnectPlug()
      .then((principal_id) => {
        console.log('reConnectPlug done, pid:', principal_id)
        if (principal_id) {
          setIsLinkWallet(true);
           callBalance(principal_id).then(
               (tokenstr) =>{
                   console.log('callBalance done, tokens:', tokenstr);
                   setBalance(Number(tokenstr));
               }
          );          
          setUserByPlugWallet(principal_id);
        }
      }).catch((e) => {
        console.log('reConnectPlug exception!', e)
      })
  }
  // const clickA = () => {
  //   initPlug()
  // }

  const getPrincipalStr = (len1: number, len2: number) => {
    const pid = getPrincipal()
    // callBalance(pid).then((token_str) =>{
    //      console.log('callBalance done, tokens:', token_str);
    //     }
    // );
    return pid.substring(0, len1) + '...' + pid.substring(pid.length - len2);
  }

  const reverseShowProfile = () => {
    setShowProfile(!showProfile)
  }

  const clickCopyAccountId = () => {
    navigator.clipboard.writeText(getPrincipal())
  }

  const clickMyUnivoice = () => {
    reverseShowProfile()
    if (currentPath === '/myunivoice') return
    navigate('/myunivoice')
  }

  const clickDisconnect = () => {
    reverseShowProfile()
    clearAccount()
    setIsLinkWallet(false)
  }

  return (
    <div className="h-[88px] sm:px-[80px] flex flex-row items-center justify-between">
      <img src={PLogoTop} className="w-[100px] cursor-pointer" onClick={clickHome} />
      <div className="flex flex-row items-center">
        <a href="https://x.com/UNIVOICE_" target='_blank'><div className="btn-link-2">
          <img src={ImgTwitter} alt="" className="w-[18px]" />
        </div></a>
        <div className="btn-link-2-split bg-[#6C2CFD] mx-[12px]"></div>
        <a href="https://t.me/univoiceofficial" target='_blank'><div className="w-[32px] h-[32px] rounded-[32px] flex items-center justify-center cursor-pointer" style={{ border: '1px solid #6c2cfd' }}>
          <img src={ImgTelegram} alt="" className="w-[18px]" />
        </div></a>
        { getPrincipal() === ''? 
        <div className="ml-[-5px] lnk-wallet w-[166px] h-[84px] flex items-center justify-center relative">
          <div className="text-[14px] cursor-pointer px-[10px] py-[10px]" onClick={clickWallet}>Connect wallet</div>
        </div>
        :
        <div className="wallet-linked flex items-center justify-center relative cursor-pointer" onClick={clickProfile}>
          { getWalletType() === 'plug' && <img src={ImgPlug} alt="" className="wallet-icon" />}
          <div className="text-[14px] mx-[10px]">{getPrincipalStr(5, 3)}</div>
          <div className={`${showProfile ? 'arrow-up' : 'arrow-down'}`}></div>
          { showProfile  && 
          <div className="wallet-profile" onClick={clickProfilePanel}>
            <div className="profile-r">
              <div className="profile-label">Principal ID</div>
              <div className="principal-info items-center justify-center">
                <div>{getPrincipalStr(8, 11)}</div>
                <div className="btn-copy-account-id" onClick={clickCopyAccountId}></div>
              </div>
            </div>
            <div className="profile-r">
              <div className="profile-label">Univoice Balance</div>
              <div className="profile-uv-balance flex items-center flex-start px-[15px]">{fmtUvBalance(getBalance())}</div>
            </div>
            <div className="profile-r">
              <div className="lnk-mytokens-border" onClick={clickMyUnivoice}>
                <div className="lnk-mytokens flex flex-row items-center justify-center"><div>My Univoice</div><div className="icon-arrow-right"></div></div>
              </div>
            </div>
            <div className="split flex flex-row items-center justify-center">
              <div className="btn-disconnect" onClick={clickDisconnect}>
                <div className="icon-disconnect"></div>
                <div>Disconnect</div>
              </div>
            </div>
          </div>
          }
        </div>
        }
        {/* <div className="m-[10px]" onClick={clickA}>A</div> */}
      </div>
    </div>
  )
}
export default forwardRef(TopBar);