import React from 'react'
import { Link } from 'react-router'

import './css/NotFound.css';


export default class NotFound extends React.Component {

    render() {
        return (
            <div className="mui-container ">
            <div className='admin-miu-panel'>
                <div className="mui--text-center mui--text-display4 mui--text-dark-secondary">404</div>
                <div className="mui--text-center mui--text-display1 mui--text-dark-secondary">Page Not Found</div>
                <div className="mui--text-center mui--text-display4 mui--text-dark-secondary lentach">¯\_(ツ)_/¯</div>
            </div> 
            </div>
        );
    }
}
