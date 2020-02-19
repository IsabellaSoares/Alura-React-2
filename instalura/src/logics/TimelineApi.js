import PubSub from 'pubsub-js';

export default class TimelineApi {
	constructor(fotos) {
		this.fotos = fotos;
	}

	static lista(urlPerfil, store) {
		fetch(urlPerfil).then((response) => response.json()).then((fotos) => {
			store.dispatch({ type: 'LISTAGEM', fotos });
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
				const fotoAchada = this.fotos.find((foto) => foto.id === fotoId);
				fotoAchada.comentarios.push(novoComentario);
				PubSub.publish('timeline', this.fotos);
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
				const fotoAchada = this.fotos.find((foto) => foto.id === fotoId);
				fotoAchada.likeada = !fotoAchada.likeada;

				const possivelLiker = fotoAchada.likers.find((likerAtual) => likerAtual.login === liker.login);

				if (possivelLiker === undefined) {
					fotoAchada.likers.push(liker);
				} else {
					const novosLikers = fotoAchada.likers.filter((likerAtual) => likerAtual.login !== liker.login);
					fotoAchada.likers = novosLikers;
				}

				PubSub.publish('timeline', this.fotos);
			});
	}

	subscribe(callback) {
		PubSub.subscribe('timeline', (topico, fotos) => {
			callback(fotos);
		});
	}
}
