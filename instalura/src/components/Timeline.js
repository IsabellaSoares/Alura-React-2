import React, { Component } from 'react';
import FotoItem from './Foto';
import PubSub from 'pubsub-js';
import { CSSTransitionGroup } from 'react-transition-group';

export default class Timeline extends Component {
	constructor(props) {
		super(props);
		this.state = { fotos: [] };
		this.login = this.props.login;
	}

	componentWillMount(){
        PubSub.subscribe('timeline',(topico,fotos) => {
			this.setState({ fotos: fotos.fotos });
        });
    }

	carregaFotos() {
		let urlPerfil;

		if (this.login === undefined) {
			urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
		} else {
			urlPerfil = `http://localhost:8080/api/public/fotos/${this.login}`;
		}

		fetch(urlPerfil).then((response) => response.json()).then((fotos) => {
			console.log(fotos);
			this.setState({ fotos });
		});
	}

	componentDidMount() {
		this.carregaFotos();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.login !== undefined) {
			this.login = nextProps.login;
			this.carregaFotos();
		}
	}

	render() {
		return (
			<div className="fotos container">
				<CSSTransitionGroup
					transitionName="timeline"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={300}>
					{
					this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto}/>)
					}
				</CSSTransitionGroup>
			</div>
		);
	}
}
