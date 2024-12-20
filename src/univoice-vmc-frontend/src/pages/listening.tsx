import { useEffect } from 'react';

function UvListeningPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return (
    <div className="uv-container-1 pb-[28px]" style={{flexBasis: '100%'}}>
      <div className="sub-qa-block pt-[148px]">
        <div className="qa-block-title text-[48px]">What’s the Listener？</div>
        <div className="qa-block-txt text-[24px]">
          <p>“Let AI know you better,you be yourself ”.</p>
          <p>Univoice has always been listening and accompanying.</p>
        </div>
      </div>
      <div className="sub-block-split mt-[120px] mb-[110px]"></div>
      <div className="sub-qa-block">
        <div className="qa-block-title">Who is the listener?</div>
        <div className="qa-block-txt">Univoice ai agent and human.</div>
      </div>
      <div className="sub-qa-block">
        <div className="qa-block-title">How to become a listener?</div>
        <div className="qa-block-txt">
          <p>You are a speaker and holding Univoice Licence.</p>
          <p>Univoice Licence: NFT or  univoice-related products</p>
          <p>In expressing ourselves, univoice ai agent listens, we also learn to listen to the voices of inner and outer with patience.</p>
        </div>
      </div>
      <div className="sub-qa-block">
        <div className="qa-block-title">How to earn?</div>
        <div className="qa-block-txt">Univoice Ai agent traning, you get tokens.</div>
      </div>
    </div>
  )
}

export default UvListeningPage;