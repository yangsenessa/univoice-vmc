import { Outlet } from 'react-router-dom';
import TopBar from '../components/topbar'
import FootBar from '../components/footbar'

function MainLayout() {
  return (
    <div className="uv-container uv-container-sub-layer bg-uv-sub min-h-full overflow-hidden">
      <div className="w-full overflow-hidden bg-[#2D23404C]"><TopBar/></div>
      <Outlet/>
      <FootBar/>
    </div>
  )
}

export default MainLayout