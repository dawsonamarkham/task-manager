import React, { Component } from 'react';
import './AuthForm.css';
import axios from 'axios';
import ValidEmail from '../helpers/ValidEmail';

interface LoginState {
    email: string,
    password: string,
    emError?: string,
    pwError?: string,
    lgError?: string
}

interface LoginProps {
    handleAuthUpdate: (tkn: string) => void,
    handleDispChange: (disp: 'sign-in' | 'sign-up' | 'tasks' | 'loading') => void
}

class LoginForm extends Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.allowLogin = this.allowLogin.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event?.target.name === 'email') {
            if (event.target.value.match(ValidEmail)) {
                this.setState({ email: event.target.value, emError: undefined });
            }
            else {
                this.setState({ email: event.target.value, emError: 'Username must be a valid email address.' });
            }
        }
        
        if (event?.target.name === 'password') {
            if (event.target.value.length >= 8 && event.target.value.length <= 72) {
                this.setState({ password: event.target.value, pwError: undefined });
            }
            else {
                this.setState({ password: event.target.value, pwError: 'Password must be between the length of 8 and 72.' });
            }
        }

    }

    allowLogin(): boolean {
        return !(
            this.state.email !== '' &&
            this.state.password !== '' &&
            !(this.state.emError || this.state.pwError)
        );
    }

    async handleLogin() {
        try {
            const res = await axios.post('/signin', {
                email: this.state.email,
                password: this.state.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
            }});
            this.props.handleAuthUpdate(res.data['access_token']);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                this.setState({lgError: err?.response?.data.error ||  "Unexpected error. Please try again."})
            }
            else {
                this.setState({lgError: "Unexpected error. Please try again."})
            }
        }
    }

    render() {
        return (
            <div className='Form-container'>
                <div className='Form-header'>
                    <p>Welcome to Task Manager</p>
                </div>
                <div className='Input-container'>
                    <label className='Input-label'>Username:</label>
                    <input
                        className='Input-field'
                        type='email'
                        name='email'
                        value={this.state.email}
                        onChange={this.handleChange}
                        placeholder='Enter username'
                        style={{
                            borderColor: this.state.emError ? '#F03': undefined,
                            outline: this.state.emError ? '#F03': undefined
                        }}
                    />
                    { this.state.emError ?
                        <span className='Input-warning'>
                            {this.state.emError}
                        </span> :undefined
                    }
                </div>
                <div className='Input-container'>
                    <label className='Input-label'>Password:</label>
                    <input
                        className='Input-field'
                        type='password'
                        name='password'
                        value={this.state.password}
                        onChange={this.handleChange}
                        placeholder='Enter password'
                        style={{
                            borderColor: this.state.pwError ? '#F03': undefined,
                            outline: this.state.pwError ? '#F03': undefined
                        }}
                    />
                    { this.state.pwError ?
                        <span className='Input-warning'>
                            {this.state.pwError}
                        </span> : undefined
                    }
                </div>
                <button
                    className='Large-button'
                    disabled={this.allowLogin()}
                    onClick={() => this.handleLogin()}
                >
                    Login
                </button>
                { this.state.lgError ?
                    <div className='Input-warning'>
                        {this.state.lgError}
                    </div> : undefined
                }
                <div style={{marginTop: '15px'}}>
                    <div style={{fontStyle: 'italic', fontSize: 'small'}}>
                        Don't have an account?
                    </div>
                    <button className='Large-button' onClick={() => this.props.handleDispChange('sign-up')}>Create Account</button>
                </div>
            </div>
        )
    }
}

export default LoginForm