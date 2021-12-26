import { connect } from 'react-redux';
import { actionAddCart } from '../../../redux-Store/cartReducer'
import { backURL } from '../../../redux-Store/redux-Store';

const Good = ({ good: { name, description, images, price, _id }, onCartAdd }) => {
    return (
        <div className='Good'>
            <h3>{name}</h3>
            {images && images[0] && images[0].url && <img src={backURL + '/' + images[0].url} alt='product img' />}
            <strong>{price}</strong>
            <p>{description}</p>
            <button onClick={() => onCartAdd({ name, description, images, price, _id })}>+</button>
        </div>
    )
}


export const CGood = connect(state => ({ good: state.promise?.goodById?.payload || {} }), { onCartAdd: actionAddCart })(Good)