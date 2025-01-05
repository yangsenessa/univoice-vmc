import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../components/topbar'
import FootBar from '../components/footbar'

function MainLayout() {

  const topbarRef = useRef<{ hideProfile: () => void }>(null)
  const handleHideProfile = () => {
    if (topbarRef.current) {
      topbarRef.current.hideProfile()
    }
  }

  return (
    <div className="uv-container uv-container-sub-layer bg-uv-sub min-h-full overflow-hidden" onClick={handleHideProfile}>
      <div className="w-full bg-[#2D23404C]"><TopBar ref={topbarRef}/></div>
      <Outlet/>
      <FootBar/>
    </div>
  )
}

export default MainLayout