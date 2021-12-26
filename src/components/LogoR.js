import { Link } from 'react-router-dom'
import logoImg from '../logo.svg'

export const Logo = () => {
    return (
        <div>
            <Link to='/' className="Logo">
                <img src={logoImg} alt='logo' />
            </Link>
        </div>
    )
}