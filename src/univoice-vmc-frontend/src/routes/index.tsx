import { Navigate, RouteObject } from 'react-router-dom';
import HomePage from '../pages/home';
import SubLayout from '../layout/subpage';
import SpeakingPage from '../pages/speaking';
import ListeninggPage from '../pages/listening';
import AiAgentPage from '../pages/aiagent';
import TokensPage from '../pages/tokens';
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
        element: <ListeninggPage />
      }, {
        path: '/aiagent',
        element: <AiAgentPage />
      }, {
        path: '/tokens',
        element: <TokensPage />
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