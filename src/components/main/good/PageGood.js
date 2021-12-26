import { connect } from 'react-redux';
import { useEffect } from "react"
import { actionGoodById } from '../../../redux-Store/redux-Store'
import { CGood } from './Good';

export const PageGood = ({ match: { params: { _id } }, getGood }) => {
    useEffect(() => {
        getGood(_id)
    }, [_id])
    return (
        <><CGood /></>
    )
}

export const CPageGood = connect(null, { getGood: actionGoodById })(PageGood)


