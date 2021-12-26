import { Link } from 'react-router-dom';
import { useState } from 'react';
import { connect } from 'react-redux';
import { actionFullLogin } from '../../redux-Store/authReducer'
import { history } from '../../App';

const LoginForm = ({ onLogin }) => {
    const [log, setLog] = useState('')
    const [pas, setPas] = useState('')
    const [errorMode, setErrorMode] = useState(false)
    const onChangeLog = (e) => {
        setLog(e.currentTarget.value)
        setErrorMode(false)
    }
    const onChangePas = (e) => {
        setPas(e.currentTarget.value)
        setErrorMode(false)
    }
    const onCheckLogin = () => {
        const validateSpace = /^\S*$/
        const validetedSpaceLog = validateSpace.test(log)
        const validetedSpacePas = validateSpace.test(pas)
        if (validetedSpaceLog && validetedSpacePas) {
            onLogin(log, pas)
            history.push('/')
        } else {
            setErrorMode(true)
        }
    }
    return (
        <div className='LoginForm' onClick={() => history.push('/')}>
            <div className="LoginForm__inner" onClick={(e => e.stopPropagation())
            }>
                <h4>Login</h4>
                <label >
                    Login:
                    <input style={{ borderColor: errorMode ? 'red' : 'black' }}
                        value={log}
                        onChange={onChangeLog}
                        placeholder='login' />
                </label>
                <label>
                    Password:
                    <input style={{ borderColor: errorMode ? 'red' : 'black' }}
                        value={pas}
                        onChange={onChangePas}
                        placeholder='password' />
                </label>
                {errorMode && <div style={{ color: 'red' }}>Error, please check for spaces </div>}
                <button onClick={onCheckLogin}
                    disabled={!log || !pas || errorMode ? true : false}>Login
                </button>
                <Link to={'/registration'}>Registration</Link>
                <button className="close" onClick={() => history.push('/')}>X</button>
            </div >
        </div >
    )
}
export const CLoginForm = connect(null, { onLogin: actionFullLogin, })(LoginForm)