import logoDefault from './logo.svg';
import './App.scss';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const jwtDecode = token => {
    try {
        let arrToken = token.split('.')
        let base64Token = atob(arrToken[1])
        return JSON.parse(base64Token)
    }
    catch (e) {
        console.log('Лажа, Бро ' + e);
    }
}

function authReducer(state, { type, token }) {
    if (!state) {
        if (localStorage.authToken) {
            type = 'AUTH_LOGIN'
            token = localStorage.authToken
        } else state = {}
    }
    if (type === 'AUTH_LOGIN') {
        localStorage.setItem('authToken', token)
        let payload = jwtDecode(token)
        if (typeof payload === 'object') {
            return {
                ...state,
                token,
                payload
            }
        } else return state
    }
    if (type === 'AUTH_LOGOUT') {
        localStorage.removeItem('authToken')
        return {}
    }
    return state
}

const actionAuthLogin = token => ({ type: 'AUTH_LOGIN', token })
const actionAuthLogout = () => ({ type: 'AUTH_LOGOUT' })


function cartReducer(state = {}, { type, good = {}, count = 1 }) {
    const { _id } = good
    const types = {
        CART_ADD() {
            count = +count
            if (!count) return state
            return {
                ...state,
                [_id]: {
                    good,
                    count: count + (state[_id]?.count || 0)
                }
            }
        },
        CART_CHANGE() {
            count = +count
            if (!count) return state
            return {
                ...state,
                [_id]: {
                    good,
                    count: count
                }
            }
        },
        CART_REMOVE() {
            let { [_id]: remove, ...newState } = state
            return {
                ...newState
            }
        },
        CART_CLEAR() {
            return {}
        },
    }
    if (type in types) {
        return types[type]()
    }
    return state
}

const actionAddCart = (good, count) => ({ type: 'CART_ADD', good, count })
const actionChangeCart = (good, count) => ({ type: 'CART_CHANGE', good, count })
const actionRemoveCart = good => ({ type: 'CART_REMOVE', good })
const actionCleanCart = () => ({ type: 'CART_CLEAR' })

function promiseReducer(state = {}, { type, status, payload, error, name }) {
    if (type === 'PROMISE') {
        return {
            ...state,
            [name]: { status, payload, error }
        }
    }
    return state;
}

const actionPending = name => ({ type: 'PROMISE', status: 'PENDING', name })
const actionResolved = (name, payload) => ({ type: 'PROMISE', status: 'RESOLVED', name, payload })
const actionRejected = (name, error) => ({ type: 'PROMISE', status: 'REJECTED', name, error })

const actionPromise = (name, promise) =>
    async dispatch => {
        dispatch(actionPending(name))
        try {
            let data = await promise
            dispatch(actionResolved(name, data))
            return data
        }
        catch (error) {
            dispatch(actionRejected(name, error))
        }
    }

const getGQL = url =>
    async (query, variables = {}) => {
        let obj = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.authToken ? 'Bearer ' + localStorage.authToken : {},
            },
            body: JSON.stringify({ query, variables })
        })
        let a = await obj.json()
        if (!a.data && a.errors)
            throw new Error(JSON.stringify(a.errors))
        return a.data[Object.keys(a.data)[0]]
    }

const backURL = 'http://shop-roles.asmer.fs.a-level.com.ua'

const gql = getGQL(backURL + '/graphql');

const actionRootCats = () =>
    actionPromise('rootCats', gql(`query {
            CategoryFind(query: "[{\\"parent\\":null}]"){
                _id name
            }
        }`))

const actionCatById = (_id) =>
    actionPromise('catById', gql(`query catById($q: String){
            CategoryFindOne(query: $q){
                subCategories{name, _id}
                _id name goods {
                    _id name price images {
                        url
                    }
                }
            }
        }`, { q: JSON.stringify([{ _id }]) }))

const store = createStore(combineReducers({
    promise: promiseReducer,
    auth: authReducer,
    cart: cartReducer
}),
    applyMiddleware(thunk))


store.subscribe(() => console.log(store.getState()))
store.dispatch(actionRootCats())
store.dispatch(actionCatById('5dc49f4d5df9d670df48cc64'))




// {
// const defaultRootCats = [
//     {
//         "_id": "5dc49f4d5df9d670df48cc64",
//         "name": "Airconditions"
//     },
//     {
//         "_id": "5dc458985df9d670df48cc47",
//         "name": "     Smartphones"
//     },
//     {
//         "_id": "5dc4b2553f23b553bf354101",
//         "name": "Крупная бытовая техника"
//     },
//     {
//         "_id": "5dcac1b56d09c45440d14cf8",
//         "name": "Макароны"
//     }]


// const defaultCat = {
//     "subCategories": null,
//     "_id": "5dc458985df9d670df48cc47",
//     "name": "     Smartphones",
//     "goods": [
//         {
//             "_id": "61b105f9c750c12ba6ba4524",
//             "name": "iPhone ",
//             "price": 1200,
//             "images": [
//                 {
//                     "url": "images/50842a3af34bfa28be037aa644910d07"
//                 }
//             ]
//         },
//         {
//             "_id": "61b1069ac750c12ba6ba4526",
//             "name": "iPhone ",
//             "price": 1000,
//             "images": [
//                 {
//                     "url": "images/d12b07d983dac81ccad404582a54d8be"
//                 }
//             ]
//         },
//         {
//             "_id": "61b23f94c750c12ba6ba472a",
//             "name": "name1",
//             "price": 1214,
//             "images": [
//                 {
//                     "url": null
//                 }
//             ]
//         },
//         {
//             "_id": "61b23fbac750c12ba6ba472c",
//             "name": "smart",
//             "price": 1222,
//             "images": [
//                 {
//                     "url": "images/871f4e6edbf86c35f70b72dcdebcd8b2"
//                 }
//             ]
//         }
//     ]
// }

// const JSONTest = ({ data }) =>
//     <pre>
//         {JSON.stringify(data, null, 4)}
//         {Math.random() > 0.5 && <h1>asdfasf</h1>}
//     </pre>

// const ReduxJSON = connect(state => ({ data: state }))(JSONTest)

// const ListItem = ({ item }) =>
//     <li>{item}</li>

// const List = ({ data = ["пиво", "чипсы", "сиги"] }) =>
//     <ul>
//         {data.map(item => <ListItem item={item} />)}
//     </ul>
// }

//============== RootCategory =================

const RootCategory = ({ cat: { _id, name } = {} }) =>
    <li>
        <a href={`#/${_id}`}>{name}</a>
    </li>

const RootCategories = ({ cats = [] }) =>
    <ul className='RootCategories'>
        {cats.map(cat => <RootCategory cat={cat} />)}
    </ul>

const CRootCategories = connect(state => ({ cats: state.promise.rootCats?.payload || [] }))
    (RootCategories)

//============== Category =================

const SubCategories = ({ cats }) =>
    <></>

const GoodCard = ({ good: { _id, name, price, images } = {}, onCartAdd }) =>
    <div className='GoodCard'>
        <h2>{name}</h2>
        {images && images[0] && images[0].url && <img src={backURL + '/' + images[0].url} alt='product img' />}
        <strong>{price}</strong>
        <button onClick={() => onCartAdd({ _id, name, price, images })}>+</button>
    </div>

const CGoodCard = connect(null, { onCartAdd: actionAddCart })(GoodCard)

const Category = ({ cat: { _id, name, goods, subCategories } = {} }) =>
    <div className='Category'>
        <h1>{name}</h1>
        {subCategories && <SubCategories cats={subCategories} />}
        {(goods || []).map(good => <CGoodCard good={good} />)}
    </div>

const CCategory = connect(state => ({ cat: state.promise.catById?.payload }))(Category)


//============== Cart =================

const CartItem = ({ cartItem: { good, count }, removeCart, onChangeCart }) =>
    <div className='CartItem'>
        {good.images && good.images[0] && good.images[0].url && <img src={backURL + '/' + good.images[0].url} alt='productimg'/>}
        <h4>{good.name}</h4>
        <span>К-во:<input type='number' value={count} onChange={(e) => onChangeCart(good, e.currentTarget.value)} /></span>
        <span>Цена: <strong>{good.price * count}</strong></span>
        <button onClick={() => removeCart(good)}>X</button>
    </div>

const CCartItem = connect(null, { removeCart: actionRemoveCart, onChangeCart: actionChangeCart })(CartItem)

const Cart = ({ cart, clearCart }) =>
    <div className='Cart'>
        <h3>Корзин</h3>
        {Object.keys(cart).length !== 0 ?
            <button onClick={() => clearCart()}
                className='clearBtn'> Очистить корзину</button > : ''}
        {Object.entries(cart).map(([, cartItem]) => <CCartItem cartItem={cartItem} />)}
    </div >

const CCart = connect(state => ({ cart: state.cart }), { clearCart: actionCleanCart })(Cart)

//============== Header =================
const Header = ({ logo = logoDefault }) =>
    <header>
        <Logo logo={logo} />
        <CKoshik />
    </header>
const Logo = ({ logo = logoDefault }) =>
    <a href='#' className="Logo">
        <img src={logo} alt='logo' alt='logo' />
    </a>

const Koshik = ({ cart }) => {
    let count = 0;
    let sum = Object.entries(cart).map(([, val]) => val.count)
    count = sum.reduce((a, b) => a + b, 0)
    return (
        <div className='Koshik'>{count}</div>
    )
}

const CKoshik = connect(({ cart }) => ({ cart }))(Koshik)

//============== Main =================

const Aside = () =>
    <aside>
        <CRootCategories />
    </aside>

const Content = ({ children }) =>
    <div className='Content'>
        {children}
    </div>

const Main = () =>
    <main>
        <Aside />
        <Content>
            <CCategory />
        </Content>
    </main>

//============== Footer =================

const Footer = ({ logo = logoDefault }) =>
    <footer>
        <Logo logo={logo} />
    </footer>

//============== APP =================

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <Header />
                <Main />
                <CCart />
                <Footer />
            </div>
        </Provider>
    );
}

export default App;
