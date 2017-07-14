import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import { getRoutes } from './routes';

const routes = getRoutes();

ReactDOM.render(routes, document.getElementById('root'));

registerServiceWorker();
