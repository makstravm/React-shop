import { connect } from 'react-redux';
import { Link } from "react-router-dom"
import { CartItem } from './CartItem';
import { actionCleanCart, actionChangeCart, actionRemoveCart } from '../../../redux-Store/cartReducer'
import { actionOrder } from '../../../redux-Store/cartReducer';
export const Cart = ({ cart, auth, clearCart, sentOrder }) => {

    return <div className='Cart'>
        <h3>Корзина</h3>
        {!auth?.token && <strong>Для офрмления заказа нужно <Link to={'/login'}>войти в кабинет</Link></strong>}
        {Object.keys(cart).length !== 0 ?
            <button onClick={() => clearCart()}
                className='clearBtn'> Очистить корзину</button > : <div>Пока Пусто</div>}
        {Object.entries(cart).map(([, cartItem]) => <CCartItem key={cartItem.good._id} cartItem={cartItem} />)}
        {<button disabled={auth?.token ? false : true}
            onClick={() => sentOrder()}>
            Оформиь Заказ
        </button>}

    </div >
}

export const CCart = connect(state => ({ cart: state.cart, auth: state.auth }), { clearCart: actionCleanCart, sentOrder: actionOrder })(Cart)

const CCartItem = connect(null, { removeCart: actionRemoveCart, onChangeCart: actionChangeCart })(CartItem)