import { useEffect } from 'react';

function UvTokensPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return (
    <div className="uv-container-1 pb-[28px] pg-token" style={{flexBasis: '100%'}}>
      <div className="sub-qa-block pt-[148px]">
        <div className="qa-block-title text-[48px]">Token</div>
        <div className="qa-block-txt text-[24px]">“ Understand that voice, see that person, comprehend that heart ”, communicate smoothly and create harmoniously together.</div>
      </div>
      <div className="sub-block-split mt-[120px] mb-[110px]"></div>
      <div className="sub-qa-block tabs">
        <div className="tab-bar">
          <div className="tab-bar-item tab-bar-item-selected">Mining</div>
          <div className="tab-bar-item">License</div>
        </div>
        <div className="tab-content">
          <div className="tbl"></div>
        </div>
      </div>
      {/* <div className="sub-qa-block">
        <div className="qa-block-title">How to become a speaker?</div>
        <div className="qa-block-txt">
          <p>Useing Univoice, your omnipresent 'tree hole' (dapp/telegram miniapp...), to express your voice freely and participate in Univoice's voice-themed activities.</p>
          <p>Your voice will be encrypted and stored on the blockchain, giving you a secure 'tree hole' and assigning value to your voice.</p>
        </div>
      </div>
      <div className="sub-qa-block">
        <div className="qa-block-title">How to earn?</div>
        <div className="qa-block-txt">Accumulate points to earn rewards.</div>
      </div> */}
    </div>
  )
}

export default UvTokensPage;