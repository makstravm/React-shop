import { CPageCategory } from './category/Category'
import { Route } from 'react-router-dom';
import { Aside } from '../aside/Aside';
import { CCart } from './cart/Cart';
import { CPageGood } from './good/PageGood';
import { CDashboard } from './dashboard/Dashboard';

const Content = ({ children }) =>
    <div className='Content'>
        {children}
    </div>

const PageMain = () => <h2>Главная</h2>




export const Main = () =>
    <main>
        <Aside />
        <Content>
            <Route path='/' component={PageMain} exact />
            <Route path='/category/:_id' component={CPageCategory} />
            <Route path='/good/:_id' component={CPageGood} />
            <Route path='/order' component={CCart} />
            <Route path='/dashboard' component={CDashboard} />
        </Content>
    </main>
