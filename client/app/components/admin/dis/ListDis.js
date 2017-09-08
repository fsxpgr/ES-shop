import React, { Component } from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import axios from 'axios';
import moment from 'moment';

import './../css/ListDis.css';

export default class ListDis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.handleClickEdit = this.handleClickEdit.bind(this)
    }

    handleClickEdit(e, s) {
        e.preventDefault();
        browserHistory.push({
            pathname: '/admin/create_discount',
            state: s
        });
    }

    handleClickDelete(e, s) {
        e.preventDefault();
        axios.delete(`/admin/discount/${s}`)
            .then(response =>
                this.setState({ loading: true }, () => { this.componentWillMount() }));
    }




    componentWillMount() {
        axios.get(`/admin/discount`).then(response =>
            this.setState({ data: response.data }));

    }



    updateSearch(event) {
        this.setState({
            search: event.target.value,
        }, () => {
            axios.get(`/admin/discount`,
                {
                    params:
                    {
                        search: this.state.search
                    }
                }
            ).then(response =>
                this.setState({
                    data: response.data
                })
                );
        })
    }

    render() {
        var data = this.state.data
        return (
            <div className="mui-container">
                <div className="mui-col-md-2"></div>
                <div className="mui-col-md-8">
                    <div className="mui-panel admin-miu-panel no-padding">

                        <div className="mui-panel search-bar">
                            <div class="mui-textfield search-wrap">
                                <i class="material-icons mui--text-dark">search</i>
                                <input type="search" class="Search-box" placeholder="Search" onChange={this.updateSearch.bind(this)} />
                            </div>
                        </div>
                        <div className="mui-panel">

                            {this.state.data.map((item, i) =>
                                <div key={i}>
                                    <div className="mui-panel">
                                        <div className="mui-col-md-4">
                                            <div class="mui--text-Display1">{item.disCode}</div>
                                            <div>
                                                <span class="mui--text-dark-secondary">Date Expired: </span>
                                                <span class="mui--text-subhead">{moment(item.dateExpired).format("DD.MM.YY")}</span>
                                            </div>
                                            <div className="dis-list-btn">
                                                <button className="mui-btn mui-btn--fab mui-btn--primary" onClick={(e) => this.handleClickEdit(e, item.disCode)}><i class="material-icons">mode_edit</i></button>
                                                <button className="mui-btn mui-btn--fab mui-btn--danger" onClick={(e) => this.handleClickDelete(e, item.disCode)}><i className="material-icons">delete_forever</i></button>
                                            </div>
                                        </div>

                                        <div className="mui-col-md-8">
                                            <div className="mui-panel">
                                                {item.product.map((item, i) =>
                                                    <div key={i}>
                                                        <div className="mui-col-md-10 mui--text-subhead">{item.prodTitle}</div>
                                                        <div className="mui-col-md-2 mui--text-subhead">{item.discount}%</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
                <div className="mui-col-md-2"></div>
            </div>






        );
    }
}
