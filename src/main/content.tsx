import { createRoot } from 'react-dom/client';
import App from '../components/App';

const rootElement = document.createElement('div');

document.body.append(rootElement);

const root = createRoot(rootElement);

root.render(
  <App></App>
);
