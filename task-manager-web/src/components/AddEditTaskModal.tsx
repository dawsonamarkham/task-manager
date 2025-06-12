import React, { Component } from "react";
import './Modal.css';
import Dropdown from "./Dropdown";
import { Categories, getTaskById, TaskData, ValidCategories } from "../api/tasks";

interface AddEditTaskState {
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
}

interface AddEditTaskProps {
    taskId: string;
    handleClose: () => void;
    handleConfirmation: () => void;
}

class AddEditTaskModal extends Component<AddEditTaskProps, AddEditTaskState> {
    constructor(props: AddEditTaskProps) {
        super(props);
        this.state = {};

        this.handleGetTask = this.handleGetTask.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleCatSelection = this.handleCatSelection.bind(this);
        this.handleCompSelection = this.handleCompSelection.bind(this);
    }

    componentDidMount(): void {
        if (this.props.taskId) {
            this.setState({loading: true});
            getTaskById(this.props.taskId, this.handleGetTask);
        }
        else {
            this.setState({loading: false});
        }
    }

    handleGetTask(task?: TaskData, err?: any) {
        if (task) {
            this.setState({
                title: task.title,
                description: task.description,
                category: task.category,
                completed: task.completed ? 'Completed' : 'Incomplete',
                loading: false
            });
        }
        else if (err) {
            this.setState({
                loading: false,
                loadingError: "An error occurred when fetching Task."
            });
        }
        else {
            this.setState({
                loading: false,
                loadingError: "An unexpected error was encountered."
            });
        }
    }

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
        if (sel in ValidCategories) {
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

    render() {
        return (
            <div className='Modal-overlay'>
                <div className='Modal'>
                    <div className='Modal-header'>
                        <span className='Modal-title'>
                            {this.props.taskId ? 'Edit Task' : 'Add Task'}
                        </span>
                        <span className='Modal-header-close' onClick={this.props.handleClose}>
                            &times;
                        </span>
                    </div>
                    <div className='Modal-body'>
                        <table className='Modal-table'>
                            <tr>
                                <td className='Modal-left-cell'>Title</td>
                                <td className='Modal-right-cell'>
                                    <input
                                        style={{width: '165px'}}
                                        type='text'
                                        name='title'
                                        value={this.state.title}
                                        onChange={this.handleTitleChange}
                                        placeholder='Enter Title'
                                    />
                                    { this.state.titleError ?
                                        <span className='Modal-warning'>{this.state.titleError}</span> : undefined
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
                                            maxHeight: '165px'
                                        }}
                                        name='description'
                                        value={this.state.description}
                                        onChange={this.handleDescChange}
                                        placeholder='Enter Description (optional)'
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className='Modal-left-cell'>Category</td>
                                <td className='Modal-right-cell'>
                                    <Dropdown
                                        style={{width: '173px'}}
                                        options={['', ...ValidCategories]}
                                        onSelection={this.handleCatSelection}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className='Modal-left-cell' style={{border: '0'}}>Completion</td>
                                <td className='Modal-right-cell' style={{border: '0'}}>
                                    <Dropdown
                                        style={{width: '173px'}}
                                        options={['', 'Yes', 'No']}
                                        onSelection={this.handleCompSelection}
                                    />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className='Modal-footer'>
                        <button className='Modal-confirm-button' disabled={this.disableConfirm()}>Confirm</button>
                        <button className='Modal-close-button' onClick={this.props.handleClose}>Close</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddEditTaskModal;