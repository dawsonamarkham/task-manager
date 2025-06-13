import { Component, ReactNode } from 'react';
import './Modal.css';

interface ModalContainerProps {
    children: ReactNode;
}

class ModalContainer extends Component<ModalContainerProps, {}> {
    constructor(props: ModalContainerProps) {
        super(props);
    }

    render() {
        return (
            <div className='Modal-overlay'>
                <div className='Modal'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default ModalContainer;