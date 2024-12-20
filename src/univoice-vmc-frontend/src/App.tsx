import { useRoutes } from 'react-router-dom';
import routes from '@/routes/index';
import './App.scss'

function App() {
  // 初始化路由
  const views = useRoutes(routes);

  return (
    <>
    {views}
    </>
  )
}

export default App