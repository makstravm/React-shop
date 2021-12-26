
import { backURL } from "../../../redux-Store/redux-Store"

export const CartItem = ({ cartItem: { good, count }, removeCart, onChangeCart }) =>
    <div className='CartItem'>
        {good.images && good.images[0] && good.images[0].url && <img src={backURL + '/' + good.images[0].url} alt='productimg' />}
        <h4>{good.name}</h4>
        <span>К-во:<input type='number' value={count} onChange={(e) => onChangeCart(good, e.currentTarget.value)} /></span>
        <span>Цена: <strong>{good.price * count}</strong></span>
        <button onClick={() => removeCart(good)}>X</button>
    </div>
