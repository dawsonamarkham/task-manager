import { Component, ReactNode } from 'react';
import './Modal.css';

interface ModalBodyProps {
    children: ReactNode;
}

class ModalBody extends Component<ModalBodyProps, {}> {
    constructor(props: ModalBodyProps) {
        super(props);
    }

    render() {
        return (
            <div className='Modal-body'>
                {this.props.children}
            </div>
        );
    }
}

export default ModalBody;