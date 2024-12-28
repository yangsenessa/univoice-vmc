import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PLogoTop from '@/assets/svg/logo_top.svg'
import ImgTwitter from '@/assets/svg/X_w.svg'
import ImgTelegram from '@/assets/svg/telegram_w.svg'
import { plugReady, reConnectPlug } from '@/utils/icplug';
import { useAcountStore } from '@/stores/user';

const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('');
  const { setUserByPlugWallet, clearAccount, getUid, getPrincipal } = useAcountStore();

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const clickHome = () => {
    if (currentPath === '/') return
    navigate('/')
    // navigate('/', { replace: true })
  }
  
  const clickWallet = () => {
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

  const loginPlug = () => {
    reConnectPlug()
    .then((principal_id)=>{
      console.log('reConnectPlug done, pid:', principal_id)
      if (principal_id) {
        setUserByPlugWallet(principal_id);
      }
    }).catch((e)=>{
      console.log('reConnectPlug exception!', e)
    })
  }
  // const clickA = () => {
  //   console.log('uid:', getUid())
  //   console.log('pid:', getPrincipal())
  // }
  // const clickC = () => {
  //   clearAccount()
  // }

  const getWalletStr = () => {
    const pid = getPrincipal()
    return pid.substring(0, 8) + '...' + pid.substring(pid.length - 4);
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
        <div className="ml-[-5px] lnk-wallet w-[166px] h-[84px] flex items-center justify-center">
          { getPrincipal() === ''? 
          <div className="text-[14px] cursor-pointer px-[10px] py-[10px]" onClick={clickWallet}>Connect wallet</div>
          :<div className="text-[14px] cursor-pointer px-[10px] py-[10px]">{getWalletStr()}</div>
          }
        </div>
        {/* <div className="m-[10px]" onClick={clickA}>A</div>
        <div className="m-[10px]" onClick={clickC}>logout</div> */}
      </div>
    </div>
  )
}
export default TopBar;