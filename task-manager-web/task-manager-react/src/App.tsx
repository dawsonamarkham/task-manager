import { Component } from 'react';
import tmLogo from './favicon-32x32.png';
import './App.css';
import LoginForm from './components/LoginForm';
import AccCreateForm from './components/AccCreateForm';
import TasksForm from './components/TasksForm';
import { destroyToken } from './api/auth';
import { getTasks } from './api/tasks';
import { PaginatedTaskData } from './models/tasks';

interface AppState {
    display: 'sign-in' | 'sign-up' | 'tasks' | 'loading';
    authenticated: boolean,
    showAuthLossMsg: boolean
}

class App extends Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            display: 'loading',
            authenticated: false,
            showAuthLossMsg: false
        };
        this.checkAuth = this.checkAuth.bind(this);
        this.handleResp = this.handleResp.bind(this);
        this.handleAuthGain = this.handleAuthGain.bind(this);
        this.handleDispChange = this.handleDispChange.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleAuthLoss = this.handleAuthLoss.bind(this);
    }

    // On creation, check for access token in session (allows for keeping auth during refreshes)
    componentDidMount(): void {
        const accessToken = sessionStorage.getItem('tmAccessToken');
        if (accessToken) {
            this.checkAuth();
        }
        else {
            this.setState({display: 'sign-in', authenticated: false});
        }
    }

    // Make sure token is not expired
    checkAuth(): void {
        getTasks({ page: 1, limit: 1 }, this.handleResp)
    }

    // If Authorized, go to Task View. Otherwise, Login form
    handleResp(tasks?: PaginatedTaskData, err?: any): void {
        if (tasks) {
            this.setState({display: 'tasks', authenticated: true});
            return
        }
        this.setState({display: 'sign-in', authenticated: false});
        sessionStorage.removeItem('tmAccessToken');
    }

    // Allows the child Forms to trigger display changes
    handleDispChange(disp: 'sign-in' | 'sign-up' | 'tasks' | 'loading'): void {
        this.setState({display: disp, showAuthLossMsg: false});
    }

    // Allows Auth Forms to save access token and swap view to Tasks
    handleAuthGain(tkn: string): void {
        sessionStorage.setItem('tmAccessToken', tkn);
        this.setState({display: 'tasks', authenticated: true});
    }

    // Allows Task Form (and children) to remove token and swap to Login
    handleAuthLoss(): void {
        sessionStorage.removeItem('tmAccessToken');
        this.setState({display: 'sign-in', authenticated: false, showAuthLossMsg: true});
    }

    // Sends signout request (Not necessary) and removes token
    handleLogout(): void {
        destroyToken({}, this.handleAuthLoss);
    }

    render() {
        return (
        <div className='App'>
            <header className='Banner-header'>
                <img src={tmLogo} className='App-logo' alt='TM'/>
                { this.state.authenticated ? <div className='Banner-logout' onClick={() => this.handleLogout()}>Log Off</div> : undefined }
            </header>
            { this.state.display === 'sign-in' ?
                <LoginForm
                    handleAuthUpdate={this.handleAuthGain}
                    handleDispChange={this.handleDispChange}
                    showAuthLossMsg={this.state.showAuthLossMsg}/> : undefined
            }
            { this.state.display === 'sign-up' ? <AccCreateForm handleAuthUpdate={this.handleAuthGain} handleDispChange={this.handleDispChange}/> : undefined}
            { this.state.display === 'tasks' ? <TasksForm handleAuthUpdate={this.handleAuthLoss}/> : undefined}
            { this.state.display === 'loading' ? <div>Loading...</div> : undefined}
        </div>
        );
    }
}

export default App;
