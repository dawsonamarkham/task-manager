import { Component } from 'react';
import './Modal.css';

interface ModealHeaderProps {
    title: string;
    handleClose: () => void;
}

// This headeris designed to include a close button in the right corner
class ModealHeader extends Component<ModealHeaderProps, {}> {
    constructor(props: ModealHeaderProps) {
        super(props);
    }

    render() {
        return (
            <div className='Modal-header'>
                <span className='Modal-title'>
                    {this.props.title}
                </span>
                <span
                    className='Modal-header-close'
                    onClick={this.props.handleClose}
                >
                    &times;
                </span>
            </div>
        );
    }
}

export default ModealHeader;