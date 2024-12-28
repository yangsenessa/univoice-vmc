import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBar from '@/components/topbar'
import FootBar from '@/components/footbar'
import ImgBg from '@/assets/imgs/BG@1x.png'
import ImgService from '@/assets/imgs/Services@2x.png'
import ImgSpeakingIcon from '@/assets/imgs/Speakingicon@2x.png'
import ImgListeningIcon from '@/assets/imgs/Listeningicon@2x.png'
import ImgCoCreatingIcon from '@/assets/imgs/creatingicon@2x.png'
import ImgAiAgentIcon from '@/assets/imgs/AIAgenticon@2x.png'
import ImgTokenIcon from '@/assets/imgs/Tokenicon@2x.png'
import ImgArrowRIcon from '@/assets/imgs/icon_arrow_r.png'
import ImgICPLogo from '@/assets/imgs/ICP_logo@2x.png'
import ImgZonliLogo from '@/assets/imgs/zonli.png'
import ImgMixlabLogo from '@/assets/imgs/Mixlab_logo@2x.png'
import ImgYukuLogo from '@/assets/svg/YUKU.svg'
import ImgUVbottomLogo from '@/assets/imgs/logo_homebottom@2x.png'
import ImgBgBack from '@/assets/imgs/bg_homeback.png'
// import { getPrincipal, goLogin } from '@/utils/icplug';
import { readStorage, writeStorage, removeStorage } from '@/utils';

function UvHomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const refHome:any = useRef(null);
  const refPartner:any = useRef(null);
  const refVision:any = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const fnClickFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const goAnchor = (anchor:any) => {
    if ('#ptn' === anchor) {
      goPartner()
    } else if ('#vision' === anchor) {
      goVision()
    } else if ('#home' === anchor) {
      goHome()
    }
  }
  const goHome = () => {
    refHome.current && refHome.current.scrollIntoView(true)
  }
  const goPartner = () => {
    refPartner.current.scrollIntoView(true)
  }
  const goVision = () => {
    refVision.current.scrollIntoView(true)
  }

  const goWhitePaper = () => {
    navigate('/whitepaper.pdf')
  }

  const goActivity = () => {
    navigate('/activity')
  }
  
  const goSpeaking = () => {
    navigate('/speaking')
  }
  const goListening = () => {
    navigate('/listening')
  }
  const goCoCreating = () => {
    navigate('/cocreating')
  }
  const goAiAgent = () => {
    navigate('/aiagent')
  }
  const goToken = () => {
    navigate('/tokens')
  }

  const startSpeaking = () => {}
  const startListening = () => {}
  const startCoCreating = () => {}

  useEffect(() => {
    goAnchor(location.hash)
    // goWhitePaper()
  }, []);
  return (
    <div className="flip-card bg-[#110E19] overflow-hidden" ref={refHome}>
      <div className={`flip-card-inner ${isFlipped ? 'flip-card-inner-flipped' : ''}`}>
        <div className="flip-card-front uv-container">
          <div className="uv-home-1">
            <img src={ImgBg} className="uv-home-1-bg img-fixed w-full" />
            <div className="uv-home-1-ctx">
              <TopBar/>
              <div className="uv-container-0">
                <div className="pannel-info">
                  <div className="t1">I'm Univoice</div>
                  <div className="t1">I'm Undefined</div>
                  <div className="t2">Hello,I’m univoice.I’m undefined.</div>
                  <div className="t2">welcome to the new world created by voices.</div>
                  <div className="t2">“Authentic Freedom Infinite is superpower”</div>
                  <div className="flex flex-row txtlink">
                    <a href="/whitepaper.pdf" target="_blank"><div className="btn-link-1">WHITE PAPER</div></a>
                    <div className="btn-link-1 ml-[20px]" onClick={goActivity}>ACTIVITY</div>
                  </div>
                </div>
                <div className="ipcard ip-uv-home"></div>
                <div className="btn-join-us" onClick={fnClickFlip}><div className="btn-txt">JOIN US</div></div>
              </div>
            </div>
          </div>

          <div className="uv-container-1 uv-home-2">
            <div className="relative h-[300px] overflow-hidden mx-auto flex flex-col items-center justify-end">
              <img src={ImgService} className="top-[100px] w-[180px] h-[50px]" />
              <div className="text-[48px] txt-wwd pb-[75px] pt-[40px]">What We Do ?</div>
            </div>
          </div>
          <div className="uv-container-1 grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
            <div className="pannel-bg-1 pb-[128px] relative">
              <div className="flex flex-col items-center px-[35px]">
                <img src={ImgSpeakingIcon} className="w-[52px] h-[52px] mt-[21px]" />
                <div className="text-[24px] mt-[24px]">Speaking</div>
                <div className="text-center mt-[30px] text-[16px] leading-[24px] max-w-[400px]">
                  <p>the essence of Univoice, where every individual can freely express themselves and contribute to the creation of a harmonious, voice-driven world.</p>
                  <div className="lnk-learn-more" onClick={goSpeaking}>learn more ...</div>
                </div>
                <div className="btn-link-1 w-[260px] h-[48px] text-[16px] absolute bottom-[30px]" onClick={startSpeaking}>
                  <div>Start</div>
                  <img src={ImgArrowRIcon} className="w-[18px] h-[18px] ml-[10px]" />
                </div>
              </div>
            </div>
            <div className="pannel-bg-1 pb-[128px] relative">
              <div className="flex flex-col items-center px-[35px]">
                <img src={ImgListeningIcon} className="w-[52px] h-[52px] mt-[21px]" />
                <div className="text-[24px] mt-[24px]">Listening</div>
                <div className="text-center mt-[30px] text-[16px] leading-[24px] max-w-[400px]">
                  <p>“ Let AI know you better,you be yourself ”.</p>
                  <p>Univoice has always been listening and accompanying.</p>
                  <div className="lnk-learn-more" onClick={goListening}>learn more ...</div>
                </div>
                <div className="btn-link-1 w-[260px] h-[48px] text-[16px] absolute bottom-[30px]" onClick={startListening}>
                  <div>Start</div>
                  <img src={ImgArrowRIcon} className="w-[18px] h-[18px] ml-[10px]" />
                </div>
              </div>
            </div>
            <div className="pannel-bg-1 pb-[128px] relative">
              <div className="flex flex-col items-center px-[35px]">
                <img src={ImgCoCreatingIcon} className="w-[52px] h-[52px] mt-[21px]" />
                <div className="text-[24px] mt-[24px]">Co-creating</div>
                <div className="text-center mt-[30px] text-[16px] leading-[24px] max-w-[400px]">
                  <p>“ Understand that voice, see that person, comprehend that heart ”, communicate smoothly and create harmoniously together.</p>
                  <div className="lnk-learn-more" onClick={goCoCreating}>learn more ...</div>
                </div>
                <div className="btn-link-1 w-[260px] h-[48px] text-[16px] absolute bottom-[30px]" onClick={startCoCreating}>
                  <div>Start</div>
                  <img src={ImgArrowRIcon} className="w-[18px] h-[18px] ml-[10px]" />
                </div>
                {/* <div className="w-[260px] h-[48px] text-[16px] absolute bottom-[30px] flex flex-col justify-center">
                  <div className="text-center text-[#666]">Coming soon</div>
                </div> */}
              </div>
            </div>
          </div>

          <div className="uv-container-1 grid grid-cols-1 md:grid-cols-2 gap-[30px] pt-[30px]">
            <div className="pannel-bg-2 pb-[128px] relative">
              <div className="flex flex-col items-center px-[35px]">
                <img src={ImgAiAgentIcon} className="w-[52px] h-[52px] mt-[21px]" />
                <div className="text-[24px] mt-[24px]">AI Agent</div>
                <div className="text-center mt-[30px] text-[16px] leading-[24px] max-w-[400px]">
                  <p>“ Understand that voice, see that person, comprehend that heart ”, communicate smoothly and create harmoniously together.</p>
                </div>
                <div className="btn-link-1 w-[260px] h-[48px] text-[16px] absolute bottom-[30px]" onClick={goAiAgent}>
                  <div>Training Process</div>
                  <img src={ImgArrowRIcon} className="w-[18px] h-[18px] ml-[10px]" />
                </div>
              </div>
            </div>
            <div className="pannel-bg-2 pb-[128px] relative">
              <div className="flex flex-col items-center px-[35px]">
                <img src={ImgTokenIcon} className="w-[52px] h-[52px] mt-[21px]" />
                <div className="text-[24px] mt-[24px]">Token</div>
                <div className="text-center mt-[30px] text-[16px] leading-[24px] max-w-[400px]">
                  <p>“ Understand that voice, see that person, comprehend that heart ”, communicate smoothly and create harmoniously together.</p>
                </div>
                <div className="btn-link-1 w-[260px] h-[48px] text-[16px] absolute bottom-[30px]" onClick={goToken}>
                  <div>Get Token Now</div>
                  <img src={ImgArrowRIcon} className="w-[18px] h-[18px] ml-[10px]" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="uv-container-1 mt-[180px] pb-[70px]" ref={refPartner}>
            <div className="mx-auto flex flex-col items-center justify-end">
              <div className="h-[1px] w-[600px]" style={{ background: 'linear-gradient(90deg, #FFFFFF00 0%, #FFFFFF 55%, #FFFFFF00 100%)' }}></div>
              <div className="text-[48px] txt-wwd pt-[40px]">Partner Ship</div>
              <div className="text-[24px] text-[#EEEEEE] pt-[30px] text-center">Our expanding networkof ecosystems</div>
            </div>
          </div>

          <div className="uv-container-1 grid grid-cols-2 gap-[30px] lg:flex lg:flex-row lg:justify-between">
            <div className="flex justify-center">
              <div className="pannel-bg-3">
                <div className="pannel-ctx flex flex-col items-center justify-center">
                  <img src={ ImgMixlabLogo } className="w-[120px] h-[120px] mt-[21px]" />
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="pannel-bg-3">
                <div className="pannel-ctx flex flex-col items-center justify-center">
                  <img src={ ImgICPLogo } className="w-[159px] h-[29px] mt-[21px]" />
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="pannel-bg-3">
                <div className="pannel-ctx flex flex-col items-center justify-center">
                  <img src={ ImgYukuLogo } className="w-[120px] h-[120px] mt-[21px]" />
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="pannel-bg-3">
                <div className="pannel-ctx flex flex-col items-center justify-center">
                  <img src={ ImgZonliLogo } className="w-[85px] h-[35px] mt-[21px]" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="uv-container-1 mt-[180px] pb-[70px]" ref={refVision}>
            <div className="w-full mx-auto flex flex-col items-center justify-end relative">
              <div className="h-[1px] w-[600px]" style={{ background: 'linear-gradient(90deg, #FFFFFF00 0%, #FFFFFF 55%, #FFFFFF00 100%)' }}></div>
              <div className="uv-home-vision-1 w-full h-[200px] mt-[-28px]"></div>
              <div className="uv-home-vision-2 w-full h-[700px]"></div>
              <div className="absolute w-full top-0">
                <div className="relative flex flex-col items-center">
                  <div className="text-[48px] txt-vision pt-[100px]">Vision</div>
                  <div className="text-[24px] text-[#EEEEEE] pt-[30px] max-w-[1050px] p-[60px] text-center z-[200]">
                    <p>Together! let's co-create an univioce AI Agent that listens to all voices and understands our the best.</p>
                    <p>Create an AI agent that is unique to you. You are unique soul with Authentic Freedom Infinite.</p>
                  </div>
                  <img src={ ImgUVbottomLogo } className="w-[277px] h-[277px] top-[310px] ml-[20px] absolute z-[100]" />
                </div>
              </div>
              
            </div>
          </div>
          <FootBar homeGoAnchor={goAnchor} />

        </div>
        <div className="flip-card-back uv-container">
          <div className="w-full h-full flex flex-col items-center justify-start">
            <div className="py-[20px] text-[28px] font-pf flex flex-col items-center justify-start">
              <div className="flex flex-col items-center justify-start">
                <p>"If you want to find the secrets of</p>
                <p>the universe, think in terms of</p>
                <p>energy, frequency and vibration."</p>
                <div className="w-full text-right">- Nikola Tesla</div>
              </div>
            </div>
            <img src={ ImgBgBack } className="min-w-[1280px] w-full img-fixed" />
            <div onClick={fnClickFlip} className="fixed top-[30px] right-[50px] cursor-pointer">BACK</div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default UvHomePage;