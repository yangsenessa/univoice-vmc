import { useEffect } from 'react';

function UvCoCreatingPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return (
    <div className="uv-container-1 pb-[28px]" style={{flexBasis: '100%'}}>
      <div className="sub-qa-block pt-[148px]">
        <div className="qa-block-title text-[48px]">Co-Creating</div>
        <div className="qa-block-txt text-[24px]"></div>
      </div>
      {/* <div className="sub-block-split mt-[120px] mb-[110px]"></div>
      <div className="sub-qa-block">
        <div className="qa-block-title">What can we creat?</div>
        <div className="qa-block-txt">We are human.</div>
      </div> */}
    </div>
  )
}

export default UvCoCreatingPage;