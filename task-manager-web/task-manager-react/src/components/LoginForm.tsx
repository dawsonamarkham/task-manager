import React, { Component } from 'react';
import './AuthForm.css';
import axios from 'axios';
import { createToken } from '../api/auth';

interface LoginState {
    email: string,
    password: string,
    emPwError: boolean,
    lgError?: string
}

interface LoginProps {
    handleAuthUpdate: (tkn: string) => void,
    handleDispChange: (disp: 'sign-in' | 'sign-up' | 'tasks' | 'loading') => void,
    showAuthLossMsg: boolean
}

class LoginForm extends Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.state = {
            email: '',
            password: '',
            emPwError: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.allowLogin = this.allowLogin.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleResp = this.handleResp.bind(this);
    }

    // Identify event source and set changes
    handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        if (event?.target.name === 'email') {
            this.setState({ email: event.target.value, emPwError: false });
        }
        
        if (event?.target.name === 'password') {
            this.setState({ password: event.target.value, emPwError: false });
        }
    }

    // Used to enable/disable confirmation button
    allowLogin(): boolean {
        console.log(this.state.email !== '' && this.state.password !== '' && !this.state.emPwError)
        return this.state.email !== '' && this.state.password !== '' && !this.state.emPwError
    }

    // Attempt to create a token
    handleLogin(): void {
        createToken({
            email: this.state.email,
            password: this.state.password
        }, this.handleResp);
    }

    // On success, go to Task View. Otherwise, Display error
    handleResp(tkn?: string, err?: any): void {
        if (tkn) {
            this.props.handleAuthUpdate(tkn);
        }
        else {
            const errMsg = err && axios.isAxiosError(err) ?
                err?.response?.data.error ||  'Unexpected error. Please try again.' :
                'Unexpected error. Please try again.';
            this.setState({
                lgError: errMsg,
                emPwError: errMsg === 'Email or password is incorrect.'
            });
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
                            borderColor: this.state.emPwError ? '#F03': undefined,
                            outline: this.state.emPwError ? '#F03': undefined
                        }}
                    />
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
                            borderColor: this.state.emPwError ? '#F03': undefined,
                            outline: this.state.emPwError ? '#F03': undefined
                        }}
                    />
                </div>
                <button
                    className='Large-button'
                    disabled={!this.allowLogin()}
                    onClick={() => this.handleLogin()}
                >
                    Login
                </button>
                { this.state.lgError ?
                    <div className='Input-warning'>
                        {this.state.lgError}
                    </div> : undefined
                }
                { this.props.showAuthLossMsg ?
                    <div className='Input-warning'>
                        Signed out or session expired.
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