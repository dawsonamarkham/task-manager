import { Component } from 'react';
import '../Modal/Modal.css';
import { getTaskById } from '../../api/tasks';
import ModalContainer from '../Modal/ModalContainer';
import ModalHeader from '../Modal/ModalHeader';
import ModalFooter from '../Modal/ModalFooter';
import ModalBody from '../Modal/ModalBody';
import axios from 'axios';
import { TaskData } from '../../models/tasks';

interface ViewTaskState {
    loading?: boolean;
    loadingError?: string;
    task?: TaskData;
}

interface ViewTaskProps {
    taskId: string;
    handleClose: () => void;
    handleAuthUpdate: () => void;
}

class ViewTaskModal extends Component<ViewTaskProps, ViewTaskState> {
    constructor(props: ViewTaskProps) {
        super(props);
        this.state = {};

        this.handleGetTask = this.handleGetTask.bind(this);
    }

    // Get most recent task data
    componentDidMount(): void {
        this.setState({loading: true});
        getTaskById(this.props.taskId, this.handleGetTask);
    }

    handleGetTask(task?: TaskData, err?: any): void {
        if (task) {
            this.setState({
                loading: false,
                loadingError: undefined,
                task: task
            });
        }
        else if (err) {
            if (axios.isAxiosError(err) && err.status === 401) {
                this.props.handleAuthUpdate();
            }
            this.setState({
                loading: false,
                loadingError: 'An error occurred when fetching Task.'
            });
        }
        else {
            this.setState({
                loading: false,
                loadingError: 'An unexpected error was encountered.'
            });
        }
    }

    render() {
        return (
            <ModalContainer>
                <ModalHeader
                    title={'View Task'}
                    handleClose={this.props.handleClose}/>
                <ModalBody>
                    { this.state.loading ?
                        <div>Loading...</div> : undefined
                    }
                    { !this.state.loading && this.state.loadingError ?
                        <div>{this.state.loadingError}</div> : undefined
                    }
                    { this.state.task ? 
                        <div style={{width: '100%'}}>
                            <table className='Modal-table'>
                                <tr>
                                    <td className='Modal-left-cell'>Title</td>
                                    <td className='Modal-right-cell'>{this.state.task.title}</td>
                                </tr>
                                <tr>
                                    <td className='Modal-left-cell'>Task ID</td>
                                    <td className='Modal-right-cell'>{this.state.task.id}</td>
                                </tr>
                                <tr>
                                    <td className='Modal-left-cell'>Creation Time</td>
                                    <td className='Modal-right-cell'>{this.state.task.createdAt.split('.')[0]}</td>
                                </tr>
                                <tr>
                                    <td className='Modal-left-cell'>Update Time</td>
                                    <td className='Modal-right-cell'>{this.state.task.updatedAt.split('.')[0]}</td>
                                </tr>
                                <tr>
                                    <td className='Modal-left-cell'>Description</td>
                                    { this.state.task.description ?
                                        <td className='Modal-right-cell'>{this.state.task.description}</td> :
                                        <td className='Modal-right-cell'>No description</td>
                                    }
                                </tr>
                                <tr>
                                    <td className='Modal-left-cell'>Category</td>
                                    <td className='Modal-right-cell'>{this.state.task.category}</td>
                                </tr>
                                <tr>
                                    <td className='Modal-left-cell' style={{border: '0'}}>Completion</td>
                                    <td className='Modal-right-cell' style={{border: '0'}}>
                                        {this.state.task.completed ? 'Complete' : 'Incomplete'}
                                    </td>
                                </tr>
                            </table>
                        </div> : undefined
                    }
                </ModalBody>
                <ModalFooter handleClose={this.props.handleClose}/>
            </ModalContainer>
        )
    }
}

export default ViewTaskModal;