import { connect } from 'react-redux';
import { useEffect } from 'react'
import { CGoodCart } from './GoodCart'
import { actionCatById } from '../../../redux-Store/redux-Store'

export const SubCategories = ({ cats }) =>
    <></>

const Category = ({ cat: { _id, name, goods, subCategories } = {} }) =>
    <div className='Category'>
        <h1>{name}</h1>
        {subCategories && <SubCategories cats={subCategories} />}
        {(goods || []).map(good => <CGoodCart key={good._id} good={good} />)}
    </div>

const CCategory = connect(state => ({ cat: state.promise.catById?.payload }))(Category)

export const PageCategory = ({ match: { params: { _id } }, getData }) => {
    useEffect(() => {
        getData(_id)
    }, [_id])
    return (
        <CCategory />
    )
}

export const CPageCategory = connect(null, { getData: actionCatById })(PageCategory)