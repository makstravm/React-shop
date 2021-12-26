import { Link } from "react-router-dom"
import {connect } from 'react-redux';

const RootCategory = ({ cat: { _id, name } = {} }) =>
    <li>
        <Link to={`/category/${_id}`}>{name}</Link>
    </li>

export const RootCategories = ({ cats = [] }) =>{
   return <ul className='RootCategories'>
        {cats.map(cat => <RootCategory key={cat._id} cat={cat} />)}
    </ul>
}

export const CRootCategories = connect(state => ({ cats: state.promise.rootCats?.payload || [] }))(RootCategories)

