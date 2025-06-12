import axios from 'axios';
import { Component } from 'react';
import './AuthForm.css';
import ValidEmail from '../helpers/ValidEmail';

interface AccCreateState {
    email: string,
    password1: string,
    password2: string,
    emError?: string,
    pw1Error?: string,
    pw2Error?: string,
    lgError?: string
}

interface AccCreateProps {
    handleAuthUpdate: (tkn: string) => void,
    handleDispChange: (disp: 'sign-in' | 'sign-up' | 'tasks' | 'loading') => void
}

class AccCreateForm extends Component<AccCreateProps, AccCreateState> {
    
    constructor(props: AccCreateProps) {
        super(props);
        this.state = {
            email: '',
            password1: '',
            password2: ''
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
        
        if (event?.target.name === 'password1') {
            if (event.target.value.length >= 8 && event.target.value.length <= 72) {
                this.setState({
                    password1: event.target.value,
                    pw1Error: undefined,
                    pw2Error: this.state.password2 && event.target.value !== this.state.password2 ?
                        'Passwords do not match.' : undefined
                });
            }
            else {
                this.setState({
                    password1: event.target.value,
                    pw1Error: 'Password must be between the length of 8 and 72.',
                    pw2Error: this.state.password2 && event.target.value !== this.state.password2 ?
                        'Passwords do not match.' : undefined
                });
            }
        }

        if (event?.target.name === 'password2') {
            if (event.target.value === this.state.password1) {
                this.setState({ password2: event.target.value, pw2Error: undefined });
            }
            else {
                this.setState({ password2: event.target.value, pw2Error: 'Passwords do not match.' });
            }
        }

    }

    allowLogin(): boolean {
        return !(
            this.state.email !== '' &&
            this.state.password1 !== '' &&
            this.state.password1 === this.state.password2 &&
            !(this.state.emError || this.state.pw1Error)
        );
    }

    async handleLogin() {
        try {
            const res = await axios.post('/signup', {
                email: this.state.email,
                password: this.state.password1
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
                        name='password1'
                        value={this.state.password1}
                        onChange={this.handleChange}
                        placeholder='Enter password'
                        style={{
                            borderColor: this.state.pw1Error ? '#F03': undefined,
                            outline: this.state.pw1Error ? '#F03': undefined
                        }}
                    />
                    { this.state.pw1Error ?
                        <span className='Input-warning'>
                            {this.state.pw1Error}
                        </span> : undefined
                    }
                </div>
                <div className='Input-container'>
                    <label className='Input-label'>Re-enter Password:</label>
                    <input
                        className='Input-field'
                        type='password'
                        name='password2'
                        value={this.state.password2}
                        onChange={this.handleChange}
                        placeholder='Enter password'
                        style={{
                            borderColor: this.state.pw2Error ? '#F03': undefined,
                            outline: this.state.pw2Error ? '#F03': undefined
                        }}
                    />
                    { this.state.pw2Error ?
                        <span className='Input-warning'>
                            {this.state.pw2Error}
                        </span> : undefined
                    }
                </div>
                <button
                    className='Large-button'
                    disabled={this.allowLogin()}
                    onClick={() => this.handleLogin()}
                >
                    Create Account
                </button>
                { this.state.lgError ?
                    <div className='Input-warning'>
                        {this.state.lgError}
                    </div> : undefined
                }
                <div style={{marginTop: '15px'}}>
                    <div style={{fontStyle: 'italic', fontSize: 'small'}}>
                        Already have an account?
                    </div>
                    <button className='Large-button' onClick={() => this.props.handleDispChange('sign-in')}>Login</button>
                </div>
            </div>
        )
    }
}

export default AccCreateForm