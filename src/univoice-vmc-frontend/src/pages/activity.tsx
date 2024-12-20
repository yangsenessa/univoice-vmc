import { useEffect } from 'react';

function UvActivityPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return (
    <div className="uv-container-1 pb-[28px]" style={{flexBasis: '100%'}}>
      <div className="sub-qa-block pt-[148px]">
        <div className="qa-block-title text-[48px]">Activities</div>
        <div className="qa-block-txt text-[24px]">
          <p><span className="text-[#FFF]">Free Voice: </span>Each time within 30 seconds, 10-15 seconds is optimal. We recommend prioritizing your native language, although using multiple languages is even better if you have that skill.</p>
        </div>
        <div className="qa-block-txt text-[24px]">
          <p><span className="text-[#FFF]">Themed Voice: </span>Share Univoice's slogan and participate in the global fast flash themed voice activities. You can also initiate your desired theme and explore various interesting voice activities together.</p>
        </div>
      </div>
      <div className="sub-block-split mt-[120px] mb-[110px]"></div>
      <div className="sub-qa-block">
        <div className="qa-block-title">Recently activies:</div>
        <div className="qa-block-txt">
          <div className="text-[#DDD] text-[24px]">1.Sologon</div>
          <p>Each time within 30 seconds, 10-15 seconds is optimal. We recommend prioritizing your native language, although using multiple languages is even better if you have that skill.</p>
        </div>
        <div className="qa-block-txt">
          <div className="text-[#DDD] text-[24px]">2.Your best wishes</div>
          <p>Share Univoice's slogan and participate in the global fast flash themed voice activities. You can also initiate your desired theme and explore various interesting voice activities together.</p>
        </div>
      </div>
      <div className="sub-qa-block">
        <div className="qa-block-title">Topic:</div>
        <div className="qa-block-txt">coming soon</div>
      </div>
    </div>
  )
}

export default UvActivityPage;