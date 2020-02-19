import React, { Component } from 'react';
import FotoItem from './Foto';
import { CSSTransitionGroup } from 'react-transition-group';
import TimelineApi from '../logics/TimelineApi';

export default class Timeline extends Component {

    constructor(props){
      super(props);
      this.state = {fotos:[]};
      this.login = this.props.login;      
    }

    componentWillMount(){
      this.props.store.subscribe(() => {
        this.setState({fotos:this.props.store.getState()});
      });
    }

    carregaFotos(){  
      let urlPerfil;

      if(this.login === undefined) {
        urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
      } else {
        urlPerfil = `http://localhost:8080/api/public/fotos/${this.login}`;
      }

      const listaFixa = [{"urlPerfil":"https://s3.amazonaws.com/loa-production-23ffs35gui41a/writers/images/000/000/187/big/lincoln_abraham_WD.jpg?1458837750","loginUsuario":"alots","horario":"09/02/2020 23:21","urlFoto":"https://www.fatosdesconhecidos.com.br/wp-content/uploads/2018/02/thomas-edison-1.jpg","id":1,"likeada":false,"likers":[],"comentarios":[],"comentario":"Wow que legal!"},{"urlPerfil":"https://s3.amazonaws.com/loa-production-23ffs35gui41a/writers/images/000/000/187/big/lincoln_abraham_WD.jpg?1458837750","loginUsuario":"alots","horario":"09/02/2020 23:21","urlFoto":"https://www.investors.com/wp-content/uploads/2016/03/LSpic_Franklin_031816_pd.jpg","id":2,"likeada":false,"likers":[],"comentarios":[],"comentario":"Isso é bom demais!"}];
      
      TimelineApi.lista(urlPerfil,this.props.store);
      this.props.store.dispatch({type:'LISTAGEM',fotos:listaFixa});
      // this.props.store.lista(urlPerfil);
    }

    componentDidMount(){
      this.carregaFotos();
    }

    componentWillReceiveProps(nextProps){
      if(nextProps.login !== undefined){
        this.login = nextProps.login;
        this.carregaFotos();
      }
    }

    like(fotoId) {
      this.props.store.like(fotoId);    
    }

    comenta(fotoId, textoComentario) {
      this.props.store.comenta(fotoId, textoComentario);   
    }

    render(){
        return (
        <div className="fotos container">
        <CSSTransitionGroup
          transitionName="timeline"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
            {
              this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like.bind(this)} comenta={this.comenta.bind(this)}/>)
            }               
        </CSSTransitionGroup>        

        </div>            
        );
    }
}
