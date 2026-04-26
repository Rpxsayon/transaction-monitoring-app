import { jsx as _jsx } from "react/jsx-runtime";
import { store } from "../store/store";
import { Provider } from "react-redux";
import { RouterProvider } from 'react-router';
import { router } from './routes';
const App = () => {
    return (_jsx(Provider, { store: store, children: _jsx(RouterProvider, { router: router }) }));
};
export default App;
