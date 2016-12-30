import App from '../components/App';
import About from '../pages/About';
import Error404 from '../pages/Error404';
import ViewUpload from './ViewUpload';

export default function createRoutes(store) {
  const root = {
    path: '/',
    component: App,
    indexRoute: {
      component: require('./Home').default,
    },
    childRoutes: [
      ViewUpload,
      About,
      Error404,
    ],
  };
  return root;
}
