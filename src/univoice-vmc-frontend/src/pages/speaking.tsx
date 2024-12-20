import { useEffect } from 'react';

function UvSpeakingPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return (
    <div className="uv-container-1 pb-[28px]" style={{flexBasis: '100%'}}>
      <div className="sub-qa-block pt-[148px]">
        <div className="qa-block-title text-[48px]">What’s the speaker？</div>
        <div className="qa-block-txt text-[24px]">the essence of Univoice, where every individual can freely express themselves and contribute to the creation of a harmonious, voice-driven world.</div>
      </div>
      <div className="sub-block-split mt-[120px] mb-[110px]"></div>
      <div className="sub-qa-block">
        <div className="qa-block-title">Who is the speaker?</div>
        <div className="qa-block-txt">We are human.</div>
      </div>
      <div className="sub-qa-block">
        <div className="qa-block-title">How to become a speaker?</div>
        <div className="qa-block-txt">
          <p>Useing Univoice, your omnipresent 'tree hole' (dapp/telegram miniapp...), to express your voice freely and participate in Univoice's voice-themed activities.</p>
          <p>Your voice will be encrypted and stored on the blockchain, giving you a secure 'tree hole' and assigning value to your voice.</p>
        </div>
      </div>
      <div className="sub-qa-block">
        <div className="qa-block-title">How to earn?</div>
        <div className="qa-block-txt">Accumulate points to earn rewards.</div>
      </div>
    </div>
  )
}
export default UvSpeakingPage;