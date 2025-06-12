import { Component } from 'react';
import Dropdown from './Dropdown';
import './TasksForm.css';
import AddEditTaskModal from './AddEditTaskModal';

const CategoryOptions = [
    'All Categories',
    'Work',
    'Personal',
    'Hobby',
    'Other'
]

const CompletionOptions = [
    'Any Completion',
    'Completed',
    'Incomplete'
]

interface TasksState {
    categoryFilter: string;
    completionFilter: string;
    page: number;
    limit: number;
    total: number;
    tasks: Array<{}>;
    showAddEditModal: boolean;
    showDeleteModal: boolean;
    showViewModal: boolean;
    selectedID: string;
}

class TasksForm extends Component<{}, TasksState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            categoryFilter: CategoryOptions[0],
            completionFilter: CompletionOptions[0],
            page: 1,
            limit: 12,
            total: 0,
            tasks: [],
            showAddEditModal: false,
            showDeleteModal: false,
            showViewModal: false,
            selectedID: ""
        }
        this.handleCategorySelection = this.handleCategorySelection.bind(this);
        this.handleCompletionSelection = this.handleCompletionSelection.bind(this);
        this.handleToggleAddTaskModal = this.handleToggleAddTaskModal.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChangeConfirmation = this.handleChangeConfirmation.bind(this);
    }

    handleCategorySelection(sel: string) {
        this.setState({ categoryFilter: sel });
    }

    handleCompletionSelection(sel: string) {
        this.setState({ completionFilter: sel });
    }

    handleToggleAddTaskModal() {
        this.setState({
            showAddEditModal: true,
            showDeleteModal: false,
            showViewModal: false,
            selectedID: ""
        });
    }

    handleClose() {
        this.setState({
            showAddEditModal: false,
            showDeleteModal: false,
            showViewModal: false,
            selectedID: ""
        });
    }

    handleChangeConfirmation() {
        return
    }

    render() {
        return (
            <div className='Task-form-container'>
                <div className='Task-form-header'>
                    <Dropdown
                        style={{
                            margin: '5px',
                            color: "#08F",
                            backgroundColor: "white",
                            borderColor: "#08F",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            cursor: 'pointer'
                        }}
                        options={CategoryOptions}
                        onSelection={this.handleCategorySelection} />
                    <Dropdown
                        style={{
                            margin: '5px',
                            color: "#08F",
                            backgroundColor: "white",
                            borderColor: "#08F",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            cursor: 'pointer'
                        }}
                        options={CompletionOptions}
                        onSelection={this.handleCompletionSelection} />
                    <div style={{ flexGrow: 1 }}></div>
                    <div>
                        <button className='Add-task' onClick={this.handleToggleAddTaskModal}>Add Task</button>
                    </div>
                </div>
                <div className='Task-form-body'>
                    Body Here
                </div>
                <div className='Task-form-footer'>
                    Footer Here
                </div>
                { this.state.showAddEditModal ?
                    <AddEditTaskModal
                        taskId={this.state.selectedID}
                        handleClose={this.handleClose}
                        handleConfirmation={this.handleChangeConfirmation}/> : undefined}
            </div>
        )
    }
}

export default TasksForm