import React, { Component } from 'react';
import '../Modal/Modal.css';
import Dropdown from '../Dropdown';
import { createTask, getTaskById, updateTaskById } from '../../api/tasks';
import ModalContainer from '../Modal/ModalContainer';
import ModalHeader from '../Modal/ModalHeader';
import ModalFooter from '../Modal/ModalFooter';
import ModalBody from '../Modal/ModalBody';
import axios from 'axios';
import { Categories, TaskBody, TaskData, ValidCategories } from '../../models/tasks';

interface AddEditTaskState {
    task?: TaskData;
    title?: string;
    description?: string;
    category?: Categories;
    completed?: string;
    loading?: boolean;
    titleError?: string;
    descError?: string;
    catError?: string;
    compError?: string;
    loadingError?: string;
    sendError?: string;
}

interface AddEditTaskProps {
    taskId: string;
    handleClose: () => void;
    handleConfirmation: () => void;
    handleAuthUpdate: () => void;
}

// This modal provides a method for both adding and editing a task
// If an ID is provided, the modal will behave as an editor
class AddEditTaskModal extends Component<AddEditTaskProps, AddEditTaskState> {
    constructor(props: AddEditTaskProps) {
        super(props);
        this.state = {};

        this.handleGetTask = this.handleGetTask.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleCatSelection = this.handleCatSelection.bind(this);
        this.handleCompSelection = this.handleCompSelection.bind(this);
        this.disableConfirm = this.disableConfirm.bind(this);
        this.handleSendData = this.handleSendData.bind(this);
        this.handleTaskResp = this.handleTaskResp.bind(this);
    }

    // On creation, retrieve task if ID is given 
    componentDidMount(): void {
        if (this.props.taskId) {
            this.setState({loading: true});
            getTaskById(this.props.taskId, this.handleGetTask);
        }
        else {
            this.setState({loading: false});
        }
    }

    // Update state according to API response
    handleGetTask(task?: TaskData, err?: any): void {
        if (task) {
            this.setState({
                task: task,
                title: task.title,
                description: task.description,
                category: task.category,
                completed: task.completed ? 'Yes' : 'No',
                loading: false
            });
        }
        else if (err) {
            // If unauthorized, immediately return to Login form
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

    // Handle Input Events
    handleTitleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        if (event?.target.name === 'title') {
            let err = 'Title must be between 1 and 32 characters.';
            if (event.target.value.length > 0 && event.target.value.length <= 32) {
                err = '';
            }
            this.setState({
                title: event.target.value,
                titleError: err ? err : undefined
            });
        }
    }

    handleDescChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
        if (event?.target.name === 'description') {
            let err = 'Description must be between 0 and 200 characters.';
            if (event.target.value.length <= 200) {
                err = '';
            }
            this.setState({
                description: event.target.value,
                descError: err ? err : undefined
            });
        }
    }

    handleCatSelection(sel: string): void {
        let err = 'Must select a category.';
        if (ValidCategories.includes(sel)) {
            err = '';
        }
        this.setState({
            category: sel as Categories,
            catError: err ? err : undefined
        });
    }

    handleCompSelection(sel: string): void {
        let err = 'Must select a status.';
        if (sel === 'Yes' || sel === 'No') {
            err = '';
        }
        this.setState({
            completed: sel,
            compError: err ? err : undefined
        });
    }

    // Compute if data is acceptable for submission
    // Used to disable confirmation button
    disableConfirm(): boolean {
        if (!(
            this.state.title &&
            this.state.title.length > 0 &&
            this.state.title.length <= 32
        )) {
            return true;
        }

        if (!(
            (this.state.description && this.state.description.length <= 200) ||
            !this.state.description
        )) {
            return true;
        }

        if (!(
            this.state.category &&
            ValidCategories.includes(this.state.category)
        )) {
            return true;
        }

        if (!(
            this.state.completed &&
            ['Yes', 'No'].includes(this.state.completed)
        )) {
            return true;
        }

        return false;
    }

    // Construct data body and send to server
    handleSendData(): void {
        if (this.state.title && this.state.category && this.state.completed) {
            const data: TaskBody = {
                title: this.state.title,
                description: this.state.description ? this.state.description : undefined,
                category: this.state.category,
                completed: this.state.completed === 'Yes'
            }
            if (this.props.taskId) {
                updateTaskById(this.props.taskId, data, this.handleTaskResp);
            }
            else {
                createTask(data, this.handleTaskResp);
            }
        }
    }

    // If task is received, close modal. Otherwise, notify user
    handleTaskResp(task?: TaskData, err?: any): void {
        if (task) {
            this.props.handleConfirmation();
        }
        else if (err) {
            // If unauthorized, go back to Login form
            if (axios.isAxiosError(err) && err.status === 401) {
                this.props.handleAuthUpdate();
            }
            this.setState({
                sendError: 'Error encountered when sending data.'
            });
        }
        else {
            this.setState({
                sendError: 'Unexpected error encountered when sending data.'
            });
        }
    }

    render() {
        return (
            <ModalContainer>
                <ModalHeader
                    title={this.props.taskId ? 'Edit Task' : 'Add Task'}
                    handleClose={this.props.handleClose}/>
                <ModalBody>
                    { this.state.loading ?
                        <div>Loading...</div> : undefined
                    }
                    { !this.state.loading && this.state.loadingError ?
                        <div>{this.state.loadingError}</div> : undefined
                    }
                    { !this.state.loading && !this.state.loadingError ? 
                        <table className='Modal-table'>
                            <tr>
                                <td className='Modal-left-cell'>Title</td>
                                <td className='Modal-right-cell'>
                                    <input
                                        style={{
                                            width: '165px',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                        type='text'
                                        name='title'
                                        value={this.state.title}
                                        onChange={this.handleTitleChange}
                                        placeholder='Enter Title'
                                    />
                                    { this.state.titleError ?
                                        <div
                                            className='Modal-warning'
                                            style={{
                                                width: '165px',
                                                wordBreak: 'normal',
                                                wordWrap: 'normal'
                                            }}>
                                            {this.state.titleError}
                                        </div> : undefined
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className='Modal-left-cell'>Description</td>
                                <td className='Modal-right-cell'>
                                    <textarea
                                        style={{
                                            width: '165px',
                                            resize: 'vertical',
                                            maxHeight: '165px',
                                            wordWrap: 'normal',
                                            wordBreak: 'normal',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                        name='description'
                                        value={this.state.description}
                                        onChange={this.handleDescChange}
                                        placeholder='Enter Description (optional)'
                                    />
                                    { this.state.descError ?
                                        <div
                                            className='Modal-warning'
                                            style={{
                                                width: '165px',
                                                wordBreak: 'normal',
                                                wordWrap: 'normal'
                                            }}>
                                            {this.state.descError}
                                        </div> : undefined
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className='Modal-left-cell'>Category</td>
                                <td className='Modal-right-cell'>
                                    <Dropdown
                                        style={{
                                            width: '173px',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                        selectedValue={this.state.task?.category}
                                        options={['', ...ValidCategories]}
                                        onSelection={this.handleCatSelection}
                                    />
                                    { this.state.catError ?
                                        <div
                                            className='Modal-warning'
                                            style={{
                                                width: '165px',
                                                wordBreak: 'normal',
                                                wordWrap: 'normal'
                                            }}>
                                            {this.state.catError}
                                        </div> : undefined
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className='Modal-left-cell' style={{border: '0'}}>Completion</td>
                                <td className='Modal-right-cell' style={{border: '0'}}>
                                    <Dropdown
                                        style={{
                                            width: '173px',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                        selectedValue={this.state.task ? this.state.task.completed ? 'Yes' : 'No' : undefined}
                                        options={['', 'Yes', 'No']}
                                        onSelection={this.handleCompSelection}
                                    />
                                    { this.state.compError ?
                                        <div
                                            className='Modal-warning'
                                            style={{
                                                width: '165px',
                                                wordBreak: 'normal',
                                                wordWrap: 'normal'
                                            }}>
                                            {this.state.compError}
                                        </div> : undefined
                                    }
                                </td>
                            </tr>
                        </table> : undefined
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
                        handleConfirm: this.handleSendData
                    }}/>
            </ModalContainer>
        )
    }
}

export default AddEditTaskModal;