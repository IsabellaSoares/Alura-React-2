import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './components/Login';
import Logout from './components/Logout';
import './css/timeline.css';
import './css/reset.css';
import './css/login.css';
import {Router,Route,browserHistory} from 'react-router';

function verificaAutenticacao(nextState,replace) {
    if(localStorage.getItem('auth-token') == null) {
        replace('/?msg=você precisa estar logado para acessar o endereço');
    }
}

ReactDOM.render(
    (
        <Router history={browserHistory}>
            <Route path="/" component={Login}/>
            <Route path="/timeline(/:login)" component={App} onEnter={verificaAutenticacao}/>      
            <Route path="/logout" component={Logout}/>
        </Router>
    ),
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
