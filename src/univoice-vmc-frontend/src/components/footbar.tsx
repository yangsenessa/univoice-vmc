import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IMGUVLogo from '@/assets/svg/LOGO.svg'
import ImgLeftBg from '@/assets/imgs/FooterBG@2x.png'
import ImgTwitter from '@/assets/svg/X.svg'
import ImgTelegram from '@/assets/svg/telegram.svg'
import ImgDiscord from '@/assets/svg/Discord.svg'
import ImgMedium from '@/assets/svg/medium.svg'
import ImgGitHub from '@/assets/svg/GitHub.svg'

const FootBar = (option:any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState('');
  const callHomeGoAnchor = (anchor: any) => {
    if (option.homeGoAnchor) {
      option.homeGoAnchor(anchor)
    } else {
      navigate('/' + anchor)
    }
  }

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  const clickHome = () => {
    callHomeGoAnchor('#home')
    // if (active === '/') return
    // navigate('/')
    // navigate('/', { replace: true })
  }
  const clickPartner = () => {
    callHomeGoAnchor('#ptn')
  }
  const clickVision = () => {
    callHomeGoAnchor('#vision')
  }
  
  const clickLink = (gourl:any) => {
    if (active === gourl) return
    navigate(gourl)
  }

  const clickSpeaking = () => {
    clickLink('/speaking')
  }
  const clickListening = () => {
    clickLink('/listening')
  }
  const clickCoCreating = () => {
    clickLink('/cocreating')
  }
  const clickAiAgent = () => {
    clickLink('/aiagent')
  }
  const clickToken = () => {
    clickLink('/tokens')
  }

  return (
    <div className="w-full" style={{ background: 'linear-gradient(-2.12deg, #140E22 28%, #231542 100%)' }}>
      <div className="uv-container-1 h-[360px] flex flex-row justify-between">
        <div className="relative">
          <div className="relative w-[448px] z-[200] flex flex-col items-center justify-start">
            <img src={ IMGUVLogo } className="pt-[40px]" />
            <div className="foot-lbar flex items-center justify-center">
              <a href="https://x.com/UNIVOICE_" target='_blank'><div className="btn-link-2">
                <img src={ImgTwitter} alt="" className="w-[18px]" />
              </div></a>
              <div className="btn-link-2-split"></div>
              <a href="https://t.me/univoiceofficial" target='_blank'><div className="btn-link-2">
                <img src={ImgTelegram} alt="" className="w-[18px]" />
              </div></a>
              <div className="btn-link-2-split"></div>
              <div className="btn-link-2 disable">
                <img src={ImgDiscord} alt="" className="w-[18px]" />
              </div>
              <div className="btn-link-2-split"></div>
              <div className="btn-link-2 disable">
                <img src={ImgMedium} alt="" className="w-[18px]" />
              </div>
              <div className="btn-link-2-split"></div>
              <div className="btn-link-2 disable">
                <img src={ImgGitHub} alt="" className="w-[18px]" />
              </div>
            </div>
            <div className="text-[#AFAEBA] text-[16px]">© Copyright 2024, All Rights Reserved by Univoice</div>
          </div>
          <img src={ ImgLeftBg } className="w-[448px] h-[360px] top-0 absolute z-[50]" />
        </div>

        <div className="basis-2/3 flex flex-row">
          <div className="basis-1/2 flex flex-col items-center">
            <div className="">
              <div className="text-[#EEEEEE] text-[32px] pt-[77px] mb-[20px]">Product</div>
              <div className="text-[#AFAEBA] text-[16px] mb-[12px] cursor-pointer" onClick={clickHome}>Home</div>
              <div className="text-[#AFAEBA] text-[16px] mb-[12px] cursor-pointer" onClick={clickPartner}>Partner Ship</div>
              <div className="text-[#AFAEBA] text-[16px] mb-[12px] cursor-pointer" onClick={clickVision}>Vision</div>
            </div>
          </div>
          <div className="basis-1/2 flex flex-col items-center">
            <div className="">
              <div className="text-[#EEEEEE] text-[32px] pt-[77px] mb-[20px]">Service</div>
              <div className="text-[#AFAEBA] text-[16px] mb-[12px] cursor-pointer" onClick={clickSpeaking}>Speaking</div>
              <div className="text-[#AFAEBA] text-[16px] mb-[12px] cursor-pointer" onClick={clickListening}>Listening</div>
              <div className="text-[#AFAEBA] text-[16px] mb-[12px] cursor-pointer" onClick={clickCoCreating}>Co-creating</div>
              <div className="text-[#AFAEBA] text-[16px] mb-[12px] cursor-pointer" onClick={clickAiAgent}>AI Agent</div>
              <div className="text-[#AFAEBA] text-[16px] mb-[12px] cursor-pointer" onClick={clickToken}>Token</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default FootBar;