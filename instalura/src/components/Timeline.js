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

	componentWillMount() {
		PubSub.subscribe('timeline', (topico, fotos) => {
			this.setState({ fotos: fotos.fotos });
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

	like(fotoId) {
		fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {
			method: 'POST'
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('não foi possível realizar o like da foto');
				}
			})
			.then((liker) => {
				PubSub.publish('atualiza-liker', { fotoId, liker });
			});
	}

	comenta(fotoId, textoComentario) {
		const requestInfo = {
			method: 'POST',
			body: JSON.stringify({ texto: textoComentario }),
			headers: new Headers({
				'Content-type': 'application/json'
			})
		};

		fetch(
			`http://localhost:8080/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`,
			requestInfo
		)
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('não foi possível comentar');
				}
			})
			.then((novoComentario) => {
				PubSub.publish('novos-comentarios', { fotoId, novoComentario });
			});
	}

	render() {
		return (
			<div className="fotos container">
				<CSSTransitionGroup transitionName="timeline" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
					{this.state.fotos.map((foto) => (
						<FotoItem key={foto.id} foto={foto} like={this.like} comenta={this.comenta} />
					))}
				</CSSTransitionGroup>
			</div>
		);
	}
}
