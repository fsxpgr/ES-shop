import React from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import { browserHistory, Link, hashHistory } from 'react-router';

import Spinner from './Spinner';

import './css/ListOrder.css';

export default class ListOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            offset: 0
        }
        this.updateSearch = this.updateSearch.bind(this)
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * 10);
        this.setState({ offset: offset, loading: true }, () => {
            this.componentWillMount();
        });
    };

    updateSearch(event) {
        this.setState({
            search: event.target.value,
            offset: 0
        }, function () {
            axios.get(`/admin/order`,
                {
                    params:
                    {
                        page: this.state.offset,
                        search: this.state.search
                    }
                }
            ).then(response =>
                this.setState({
                    data: response.data.doc,
                    pageCount: response.data.total_count, loading: false
                }));
        })
    }

    componentWillMount() {
        //*isLogged*//
        axios.post('/').then(response => {
            if (response.data.Logged === false) {
                browserHistory.push('/admin/login')
            }
        })
        //*isLogged*//
        axios.get(`/admin/order?page=${this.state.offset}`).then(response => {
            this.setState({ data: response.data.doc, pageCount: response.data.total_count, loading: false })
        });
    }

    render() {
        return (
            <div className="mui-container">
                <div className="mui-panel admin-miu-panel no-padding">

                    <div className="mui-panel search-bar">
                        <div class="mui-textfield search-wrap">
                            <i class="material-icons mui--text-dark">search</i>
                            <input type="search" class="Search-box" placeholder="Search" onChange={this.updateSearch} />
                        </div>
                    </div>

                    <div className="mui-appbar">
                        <div className="mui-col-md-4 admin-list-wrapper">
                            <div className="mui-row">
                                <div className="mui-col-md-12 wrap-padding "><div className="mui--text-headline mui--text-center">Main order info</div></div>

                            </div>
                        </div>
                        <div className="mui-col-md-8 wrap-padding ">
                            <div className="mui-row ">
                                <div className="mui-col-md-7 admin-product-item wrap-padding"><div className="mui--text-headline mui--text-center">Item title</div></div>
                                <div className="mui-col-md-1 admin-product-item wrap-padding"><div className="mui--text-headline mui--text-center">Price</div></div>
                                <div className="mui-col-md-1 admin-product-item wrap-padding"><div className="mui--text-headline mui--text-center"></div></div>
                                <div className="mui-col-md-2 admin-product-item wrap-padding"><div className="mui--text-headline mui--text-center">Total price</div></div>
                            </div>
                        </div>
                    </div>

                    <div className="mui-panel">
                        {this.state.loading ? (<div className="mui--text-center"><Spinner /></div>) : (
                            <div>
                                {this.state.data.map((item, i) =>
                                    <div key={i} className="admin-inner-panel mui-panel wrap-padding">
                                        <div className="mui-col-md-4">

                                            <div className="mui-row">


                                                <div className="mui-col-md-4">
                                                    <div class="mui--text-dark mui--text-body1">Order id</div>
                                                    <div class="mui--text-dark mui--text-body1">User id</div>
                                                    <div class="mui--text-dark mui--text-body1">Status</div>
                                                    <div class="mui--text-dark mui--text-body1">Total summ</div>
                                                    <div class="mui--text-dark mui--text-body1">Order time</div>
                                                </div>

                                                <div className="mui-col-md-8">
                                                    <div className=" mui--text-dark mui--text-body1">{item.orderId}</div>
                                                    <div className=" mui--text-dark mui--text-body1">{item.userId}</div>
                                                    <div className=" mui--text-dark mui--text-body1">

                                                        <div>
                                                            {(() => {
                                                                switch (item.status) {
                                                                    case 'delivering':
                                                                        return (<span><i class="material-icons mui--text-dark mui--text-body1">local_shipping</i> In delivering</span>)
                                                                    case 'paid':
                                                                        return (<span><i class="material-icons mui--text-dark mui--text-body1">monetization_on</i> Paid</span>)
                                                                    default:
                                                                        return (<span><i class="material-icons mui--text-dark mui--text-body1">done_all</i> Done</span>)
                                                                }
                                                            })()}
                                                        </div>

                                                    </div>
                                                    <div class="mui--text-dark mui--text-body1">${(item.purchasesSum / 100).toFixed(2)}</div>
                                                    <div class="mui--text-dark mui--text-body1">{moment(item.dateExpired).format("DD.MM.YY HH:MM")}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mui-col-md-8">
                                            <div className="mui-panel">
                                                {item.items.map((iitem, i) =>
                                                    <div className="miu-row">
                                                        <div className="mui-col-md-7">{iitem.title}</div>
                                                        <div className="mui-col-md-2">${(iitem.price / 100).toFixed(2)}</div>
                                                        <div className="mui-col-md-1">{iitem.quantity}</div>
                                                        <div className="mui-col-md-2">${(iitem.cost / 100).toFixed(2)}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <ReactPaginate
                            previousLabel={"previous"}
                            nextLabel={"next"}
                            breakLabel={<a class="admin-link">...</a>}
                            breakClassName={"break-me"}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={"admin-pagination"}
                            pageLinkClassName={"admin-link"}
                            subContainerClassName={"pages admin-pagination"}
                            activeClassName={"admin-active"}
                            previousLinkClassName={"admin-prev"}
                            nextLinkClassName={"admin-nex"}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
