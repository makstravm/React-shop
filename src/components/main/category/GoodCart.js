
import { Link } from "react-router-dom"
import { backURL } from "../../../redux-Store/redux-Store"
import { connect } from 'react-redux';
import { actionAddCart } from '../../../redux-Store/cartReducer'

export const GoodCart = ({ good: { _id, name, price, images } = {}, onCartAdd }) =>
    <div className='GoodCart'>
        <Link to={`/good/${_id}`}>{name}</Link>
        {images && images[0] && images[0].url && <img src={backURL + '/' + images[0].url} alt='product img' />}
        <strong>{price}</strong>
        <button onClick={() => onCartAdd({ _id, name, price, images })}>+</button>
    </div>

export const CGoodCart = connect(null, { onCartAdd: actionAddCart })(GoodCart)