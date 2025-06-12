import { Component } from 'react';
import tmLogo from './favicon-32x32.png';
import './App.css';
import axios from 'axios';
import LoginForm from './components/LoginForm';
import AccCreateForm from './components/AccCreateForm';
import TasksForm from './components/TasksForm';

interface AppState {
  display: 'sign-in' | 'sign-up' | 'tasks' | 'loading';
  authenticated: boolean
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      display: 'loading',
      authenticated: false
    };
    this.checkAuth = this.checkAuth.bind(this);
    this.handleAuthGain = this.handleAuthGain.bind(this);
    this.handleDispChange = this.handleDispChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount(): void {
    const accessToken = sessionStorage.getItem('tmAccessToken');
    if (accessToken) {
      this.checkAuth(accessToken);
    }
    else {
      this.setState({display: 'sign-in', authenticated: false});
    }
  }

  async checkAuth(tkn: string) {
      try {
        await axios.get('/tasks', {
          headers: {
            'Authorization': 'Bearer ' + tkn,
            'Content-Type': 'application/json'
          }
        });
        this.setState({display: 'tasks', authenticated: true});
      } catch (err) {
        this.setState({display: 'sign-in', authenticated: false});
        sessionStorage.removeItem('tmAccessToken')
      }
  }

  handleDispChange(disp: 'sign-in' | 'sign-up' | 'tasks' | 'loading') {
    this.setState({display: disp});
  }

  handleAuthGain(tkn: string) {
    sessionStorage.setItem('tmAccessToken', tkn);
    this.setState({display: 'tasks', authenticated: true});
  }

  handleLogout() {
    sessionStorage.removeItem('tmAccessToken');
    this.setState({display: 'sign-in', authenticated: false});
  }

  render() {
    return (
    <div className='App'>
      <header className='Banner-header'>
        <img src={tmLogo} className='App-logo' alt='TM'/>
        { this.state.authenticated ? <div className='Banner-logout' onClick={() => this.handleLogout()}>Log Off</div> : undefined }
      </header>
      { this.state.display === 'sign-in' ? <LoginForm handleAuthUpdate={this.handleAuthGain} handleDispChange={this.handleDispChange}/> : undefined}
      { this.state.display === 'sign-up' ? <AccCreateForm handleAuthUpdate={this.handleAuthGain} handleDispChange={this.handleDispChange}/> : undefined}
      { this.state.display === 'tasks' ? <TasksForm /> : undefined}
      { this.state.display === 'loading' ? <div>Loading...</div> : undefined}
    </div>
  );
  }
}

export default App;
