import { Logo } from '../LogoR';
import { connect } from 'react-redux';
import { Link } from "react-router-dom"
import order from '../../order.png'
import dashboard from '../../dashboard.png'
import { actionAuthLogout } from '../../redux-Store/authReducer'


const Koshik = ({ cart, auth }) => {
    let count = 0;
    let sum = Object.entries(cart).map(([, val]) => val.count)
    count = sum.reduce((a, b) => a + b, 0)
    return (
        <div className='Koshik'>
            <Link className='Koshik__link' to={'/order'}>
                <img src={order} alt='order' />
                {count !== 0 ? <span>{sum}</span> : ''}
            </Link>
            {auth?.token &&
                <Link to={'/dashboard'}>
                    <img src={dashboard} alt="dashboard" />
                </Link>}
        </div>

    )
}

const CKoshik = connect(state => ({ cart: state.cart, auth: state.auth }))(Koshik)

const HeaderTop = ({ children }) =>
    <div className='HeaderTop'>
        {children}
    </div>


const UserPanel = ({ auth, onLogout }) => {
    return (
        <div className='UserPanel'>
            {!auth?.token ?
                <>
                    <Link to={`/login`} >Sign in</Link>
                    <Link to={'/registration'}>Sign up</Link>
                </> :
                <>
                    <h2>Hello, {auth?.payload?.sub.login}</h2>
                    <button onClick={() => onLogout()}>Выйти</button>
                </>}
        </div>
    )
}

const CUserPanel = connect(state => ({ auth: state.auth }), { onLogout: actionAuthLogout })(UserPanel)

export const Header = () =>
    <header>
        <HeaderTop>
            <Logo />
            <CUserPanel />
        </HeaderTop>
        <CKoshik />
    </header>