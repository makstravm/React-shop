import { actionMyOrders } from '../../../redux-Store/redux-Store';
import { connect } from 'react-redux';
import { Link } from "react-router-dom"

const MyordersList = ({ myorder }) => {
    return (
        <>{myorder.map(t => <div key={t._id} className='MyordersList'>
            {console.log(t)}
            <Link to={`/good/${t.good?._id || 'СсылкаГовно'}`}>{t.good?.name || 'Спасибо Беку за Дичь'}</Link>
            <p>Цена: <strong>{t.price}</strong></p>
            <p>К-во: <strong>{t.count}</strong></p>
            <p>Сумма: <strong>{t.total}</strong></p>
        </div>)} </>
    )
}
const CMyordersList = connect(state => ({ myorder: state?.promise?.myOrders?.payload || [] }))(MyordersList)

const Dashboard = ({ getMyorders }) => {
    getMyorders()
    return (
        <>  <CMyordersList /></>
    )
}
export const CDashboard = connect(null, { getMyorders: actionMyOrders })(Dashboard)