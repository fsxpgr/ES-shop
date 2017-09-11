import React from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { browserHistory, Link, hashHistory } from 'react-router';

import Spinner from './Spinner';

import './css/List.css';

export default class List extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			data: [],
			offset: 0
		}
		this.updateSearch = this.updateSearch.bind(this);
		this.handleClickDelete = this.handleClickDelete.bind(this);
		this.handleClickEdit = this.handleClickEdit.bind(this);
	}
	handleClickDelete(e, s) {
		e.preventDefault()
		var that = this;
		axios.delete("/admin/product/" + s)
			.then(response => {
				that.setState({ loading: true }, () => {
					that.componentWillMount();
				});;
			})
			.catch(error =>
				console.log(error)
			);
	}

	handleClickEdit(e, s) {
		e.preventDefault()
		browserHistory.push({
			pathname: '/admin/create',
			state: s
		});
	}

	handlePageClick = (data) => {
		let selected = data.selected;
		let offset = Math.ceil(selected * 10);
		this.setState({ offset: offset, loading: true }, () => {
			this.componentWillMount();
		});
	};

	getInitialState() {
		if (!this.props.isAuth) {
			browserHistory.push('/admin/login');
			return;
		}
	}

	componentWillMount() {
		//*isLogged*//
		axios.post('/').then(response => {
			if (response.data.Logged === false) {
				browserHistory.push('/admin/login')
			}
		})
		//*isLogged*//
		this.setState({ isLoading: true });
		axios.get(`/admin/product?page=${this.state.offset}`).then(response =>
			this.setState({ data: response.data.doc, pageCount: response.data.total_count, loading: false }));
	}



	updateSearch(event) {
		this.setState({
			search: event.target.value,
			offset: 0
		}, () => {
			axios.get(`/admin/product`,
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
					pageCount: response.data.total_count
				}));
		})
	}

	render() {
		var data = this.state.data;
		return (

			<div>
				<div className="mui-container">
					<div className="mui-panel admin-miu-panel no-padding">

						<div className="mui-panel search-bar">
							<div class="mui-textfield search-wrap">
								<i class="material-icons mui--text-dark">search</i>
								<input type="search" class="Search-box" placeholder="Search" onChange={this.updateSearch} />
							</div>
						</div>


						<div className="mui-appbar">
							<div className="mui-col-md-10 admin-list-wrapper">
								<div className="mui-row">
									<div className="mui-col-md-2 wrap-padding "><div className="mui--text-headline mui--text-center">Title</div></div>
									<div className="mui-col-md-3 wrap-padding "><div className="mui--text-headline mui--text-center">Description</div></div>
									<div className="mui-col-md-1 wrap-padding "><div className="mui--text-headline mui--text-center">Price</div></div>
									<div className="mui-col-md-2 wrap-padding "><div className="mui--text-headline mui--text-center">Tags</div></div>
									<div className="mui-col-md-1 wrap-padding "><div className="mui--text-headline mui--text-center">Image</div></div>
									<div className="mui-col-md-3 wrap-padding "><div className="mui--text-headline mui--text-center">Properties</div></div>
								</div>
							</div>
							<div className="mui-col-md-2 wrap-padding">
								<div className="mui-row ">
									<div className="mui-col-md-4 admin-product-item wrap-padding"></div>
									<div className="mui-col-md-4 admin-product-item wrap-padding"></div>
									<div className="mui-col-md-4 admin-product-item wrap-padding"></div>
								</div>
							</div>
						</div>

						<div>
							{this.state.loading ? (<div className="mui--text-center"><Spinner /></div>) : (
								<div>
									{data.map((item, i) =>
										<div key={i} className="admin-inner-panel mui-panel wrap-padding">
											<div className="mui-col-md-10">
												<div className="mui-row">
													<div className="mui-col-md-2 admin-product-item wrap-padding">{item.title}</div>
													<div className="mui-col-md-3 admin-product-item wrap-padding">{item.desc}</div>
													<div className="mui-col-md-1 admin-product-item wrap-padding">${(item.price / 100).toFixed(2)}</div>
													<div className="mui-col-md-2 admin-product-item wrap-padding">{item.tags.join(', ')}</div>
													<div className="mui-col-md-2 admin-product-item wrap-padding"><img src={item.img[0]} alt={item.title} /></div>
													<div className="mui-col-md-2 admin-product-item wrap-padding">
														{item.properties.map((prop, i) =>
															<div key={i}>
																<span>
																	<span><b>{prop.name}</b></span>
																	<span> {prop.value}</span>
																</span>
																<br />
															</div>
														)}

													</div>
												</div>
											</div>
											<div className="mui-col-md-2 wrap-padding">
												<div className="mui-row ">
													<div className="mui-col-md-4 wrap-padding">{item.accessible ? (<i class="material-icons admin-ico-big">shopping_cart</i>) : (<i class="material-icons admin-ico-big">remove_shopping_cart</i>)}</div>
													<div className="mui-col-md-4 admin-btn-center wrap-padding"><button className="mui-btn mui-btn--fab mui-btn--primary" onClick={(e) => { this.handleClickEdit(e, item._id) }}><i class="material-icons">mode_edit</i></button></div>
													<div className="mui-col-md-4 admin-btn-center wrap-padding"><button className="mui-btn mui-btn--fab mui-btn--danger" onClick={(e) => { this.handleClickDelete(e, item._id) }}><i className="material-icons">delete_forever</i></button></div>
												</div>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
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







