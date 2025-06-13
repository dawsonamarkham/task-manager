import { Component } from 'react';
import './Modal.css';

interface ModalFooterProps {
    confirm?: {
        confirmName: string;
        confirmWarn?: boolean;
        disableConfirm?: boolean;
        handleConfirm: () => void;
    }
    handleClose: () => void;
}

// This footer is designed to have a close button and an optional confirmation button
class ModalFooter extends Component<ModalFooterProps, {}> {
    constructor(props: ModalFooterProps) {
        super(props);
    }

    render() {
        return (
            <div className='Modal-footer'>
                { this.props.confirm ? 
                    <button
                        className='Modal-confirm-button'
                        disabled={this.props.confirm.disableConfirm}
                        onClick={this.props.confirm.handleConfirm}
                    >
                        {this.props.confirm.confirmName}
                    </button> : undefined
                }
                <button
                    className='Modal-close-button'
                    onClick={this.props.handleClose}
                >
                    Close
                </button>
            </div>
        );
    }
}

export default ModalFooter;