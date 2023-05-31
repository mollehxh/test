import ReactDOM from 'react-dom/client';
import { Application } from '~/app/application';
import { appStarted } from './shared/config/init';

const container = document.querySelector('#root') as HTMLElement;

const root = ReactDOM.createRoot(container);

appStarted();
root.render(<Application />);
