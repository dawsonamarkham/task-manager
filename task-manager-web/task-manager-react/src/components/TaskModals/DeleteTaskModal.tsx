import { Component } from 'react';
import '../Modal/Modal.css';
import { deleteTaskById, getTaskById } from '../../api/tasks';
import ModalContainer from '../Modal/ModalContainer';
import ModalHeader from '../Modal/ModalHeader';
import ModalFooter from '../Modal/ModalFooter';
import ModalBody from '../Modal/ModalBody';
import axios from 'axios';
import { TaskData } from '../../models/tasks';

interface DeleteTaskState {
    task?: TaskData;
    loading?: boolean;
    loadingError?: string;
    sendError?: string;
}

interface DeleteTaskProps {
    taskId: string;
    handleClose: () => void;
    handleConfirmation: () => void;
    handleAuthUpdate: () => void;
}

class DeleteTaskModal extends Component<DeleteTaskProps, DeleteTaskState> {
    constructor(props: DeleteTaskProps) {
        super(props);
        this.state = {};

        this.handleGetTask = this.handleGetTask.bind(this);
        this.disableConfirm = this.disableConfirm.bind(this);
        this.handleDeleteTask = this.handleDeleteTask.bind(this);
        this.handleTaskResp = this.handleTaskResp.bind(this);
    }

    // Retrieve task on creation (Ensures it still exists)
    componentDidMount(): void {
        this.setState({loading: true});
        getTaskById(this.props.taskId, this.handleGetTask);
    }

    // Set state according to response
    handleGetTask(task?: TaskData, err?: any): void {
        if (task) {
            this.setState({
                task: task,
                loading: false
            });
        }
        else if (err) {
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

    // Only allow confirmation if task is received
    disableConfirm(): boolean {
        return !(this.state.task);
    }

    handleDeleteTask(): void {
        if (this.state.task) {
            deleteTaskById(this.state.task.id, this.handleTaskResp);
        }
    }

    // If successful, close modal. Otherwise, display error
    handleTaskResp(completed: boolean, err?: any): void {
        if (completed) {
            this.props.handleConfirmation();
        }
        else if (err) {
            // If unauthorized, go back to Login form
            if (axios.isAxiosError(err) && err.status === 401) {
                this.props.handleAuthUpdate();
            }
            this.setState({
                sendError: 'Error encountered when deleting task'
            });
        }
        else {
            this.setState({
                sendError: 'Unexpected error encountered when deleting task'
            });
        }
    }

    render() {
        return (
            <ModalContainer>
                <ModalHeader
                    title={'Delete Task'}
                    handleClose={this.props.handleClose}/>
                <ModalBody>
                    { this.state.loading ?
                        <div>Loading...</div> : undefined
                    }
                    { !this.state.loading && this.state.loadingError ?
                        <div>{this.state.loadingError}</div> : undefined
                    }
                    { this.state.task ? (
                        <div>
                            <div>Are your sure you want to delete:</div>
                            <div>{'\'' + this.state.task.title + '\''}</div>
                        </div>
                        ) : undefined
                    }
                    { this.state.sendError ?
                        <span className='Modal-warning'>{this.state.sendError}</span> : undefined
                    }
                </ModalBody>
                <ModalFooter 
                    handleClose={this.props.handleClose}
                    confirm={{
                        confirmName: 'Confirm',
                        disableConfirm: this.disableConfirm(),
                        handleConfirm: this.handleDeleteTask
                    }}/>
            </ModalContainer>
        )
    }
}

export default DeleteTaskModal;