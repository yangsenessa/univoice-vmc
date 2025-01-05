import { Navigate, RouteObject } from 'react-router-dom';
import HomePage from '../pages/home';
import SubLayout from '../layout/subpage';
import SpeakingPage from '../pages/speaking';
import ListeningPage from '../pages/listening';
import CoCreatingPage from '../pages/cocreating';
import AiAgentPage from '../pages/aiagent';
import DashboardPage from '../pages/dashboard';
import MyUnivoicePage from '../pages/myunivoice';
import ActivityPage from '../pages/activity';

const routes: RouteObject[] = [{
    path: '/',
    element: <HomePage/>
  },{
    Component: SubLayout,
    children: [
      {
        path: '/speaking',
        element: <SpeakingPage />
      }, {
        path: '/listening',
        element: <ListeningPage />
      }, {
        path: '/cocreating',
        element: <CoCreatingPage />
      }, {
        path: '/aiagent',
        element: <AiAgentPage />
      }, {
        path: '/dashboard',
        element: <DashboardPage />
      }, {
        path: '/myunivoice',
        element: <MyUnivoicePage />
      }, {
        path: '/activity',
        element: <ActivityPage />
      }
    ]
  },
  // ...external,
  {
    path: '/*',
    element: <Navigate to="/" />
  }
];
export default routes;