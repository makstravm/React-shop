import './App.scss';
import { Router, Route } from 'react-router-dom';
import createHistory from "history/createBrowserHistory";
import { Provider } from 'react-redux';
import { Header } from './components/header/Header';
import { Main } from './components/main/Main';
import { Footer } from './components/Footer';
import { store } from './redux-Store/redux-Store'
import { actionPromise } from './redux-Store/promiseReducer'
import { gql } from './redux-Store/redux-Store'
import { CLoginForm } from './components/authorization/LoginForm';
import { CRegisterForm } from './components/authorization/RegisterForm';

const actionRootCats = () =>
    actionPromise('rootCats', gql(`query {
            CategoryFind(query: "[{\\"parent\\":null}]"){
                _id name
            }
        }`))


store.subscribe(() => console.log(store.getState()))
store.dispatch(actionRootCats())

export const history = createHistory()

function App() {
    return (
        <Router history={history}>
            <Provider store={store}>
                <div className="App">
                    <Header />
                    <Main />
                    <Footer />
                    <Route path='/login' component={CLoginForm} />
                    <Route path='/registration' component={CRegisterForm} />
                </div>
            </Provider>
        </Router>
    );
}

export default App;
