import { Component } from 'react';
import Dropdown from './Dropdown';
import './TasksForm.css';
import AddEditTaskModal from './TaskModals/AddEditTaskModal';
import { getTasks } from '../api/tasks';
import axios from 'axios';
import TaskCard from './TaskCard';
import ViewTaskModal from './TaskModals/ViewTaskModal';
import DeleteTaskModal from './TaskModals/DeleteTaskModal';
import { Categories, PaginatedTaskData, TaskData, TaskQuery, ValidCategories } from '../models/tasks';

// Serves as options for filter dropdowns
const CategoryOptions = ['All Categories', ... ValidCategories];

const CompletionFilters = ['Completed','Incomplete']
const CompletionOptions = ['Any Completion', ...CompletionFilters]

interface TasksState {
    prevQry?: TaskQuery,
    categoryFilter: string;
    completionFilter: string;
    page: number;
    limit: number;
    total: number;
    tasks: Array<TaskData>;
    showAddEditModal: boolean;
    showDeleteModal: boolean;
    showViewModal: boolean;
    selectedID: string;
    retrieveError?: string;
    loading: boolean;
}

interface TasksProp {
    handleAuthUpdate: () => void
}

// Displays tasks and controls task requests
// Also, serves as the controlling component for task modals
class TasksForm extends Component<TasksProp, TasksState> {
    // Timer used to repeat requests to ensure up to date viewing
    timerId?: NodeJS.Timeout;

    constructor(props: TasksProp) {
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
            selectedID: '',
            loading: true
        }
        this.startCycle = this.startCycle.bind(this);
        this.handleCategorySelection = this.handleCategorySelection.bind(this);
        this.handleCompletionSelection = this.handleCompletionSelection.bind(this);
        this.goToPage = this.goToPage.bind(this);
        this.handleToggleAddModal = this.handleToggleAddModal.bind(this);
        this.handleToggleViewModal = this.handleToggleViewModal.bind(this);
        this.handleToggleEditModal = this.handleToggleEditModal.bind(this);
        this.handleToggleDeleteModal = this.handleToggleDeleteModal.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChangeConfirmation = this.handleChangeConfirmation.bind(this);
        this.updateTasks = this.updateTasks.bind(this);
        this.handleGetTasks = this.handleGetTasks.bind(this);
        this.handleNoTasks = this.handleNoTasks.bind(this);
    }

    componentDidMount(): void {
        this.startCycle()
    }

    // When unmounting, disable the timer
    componentWillUnmount(): void {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
    }

    // Sends request and sets the interval
    startCycle(): void {
        this.updateTasks();
        this.timerId = setInterval(this.updateTasks, 30000);
    }

    // Updates task list with previous or new query
    updateTasks(): void {
        if (this.state.prevQry) {
            getTasks(this.state.prevQry, this.handleGetTasks)
        }
        else {
            const qry: TaskQuery = {
                page: this.state.page,
                limit: this.state.limit,
                categoryFilter: ValidCategories.includes(this.state.categoryFilter) ?
                    this.state.categoryFilter as Categories : undefined,
                completionFilter: CompletionFilters.includes(this.state.completionFilter) ?
                    this.state.completionFilter === CompletionFilters[0] : undefined
            };
            getTasks(qry, this.handleGetTasks);

            // Set prevQry for the timer updates
            this.setState({ prevQry: qry });
        }

    }

    // If successful update task list. Otherwise, display error
    handleGetTasks(paginatedTasks?: PaginatedTaskData, err?: any): void {
        if (paginatedTasks) {
            this.setState({
                tasks: paginatedTasks.data,
                total: paginatedTasks.total,
                retrieveError: undefined,
                loading: false
            }, () => this.handleNoTasks());
        }
        // If unauthorized, send user back to Login form
        else if (err && axios.isAxiosError(err) && err.status === 401) {
            this.props.handleAuthUpdate();
        }
        else {
            this.setState({
                retrieveError: 'Encounterd error when getting tasks.'
            }, () => this.handleNoTasks());
        }
    }

    // Send the user to the nearest page if current page is empty
    handleNoTasks(): void {
        if (this.state.total > 0 && this.state.total < (this.state.page-1)*this.state.limit+1) {
            this.goToPage(Math.floor((this.state.total-1)/this.state.limit)+1);
        }
    }

    // Handle query updates (Reset timer and send new query)
    handleCategorySelection(sel: string): void {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
        this.setState({
            prevQry: undefined,
            categoryFilter: sel
        }, () => this.startCycle());
    }

    handleCompletionSelection(sel: string): void {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
        this.setState({
            prevQry: undefined,
            completionFilter: sel
        }, () => this.startCycle());
    }

    goToPage(pg: number): void {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
        this.setState({
            prevQry: undefined,
            page: pg
        }, () => this.startCycle());
    }

    // Modal control logic
    handleToggleAddModal(): void {
        this.setState({
            showAddEditModal: true,
            showDeleteModal: false,
            showViewModal: false,
            selectedID: ''
        });
    }

    handleToggleViewModal(id: string): void {
        this.setState({
            showAddEditModal: false,
            showDeleteModal: false,
            showViewModal: true,
            selectedID: id
        });
    }

    handleToggleEditModal(id: string): void {
        this.setState({
            showAddEditModal: true,
            showDeleteModal: false,
            showViewModal: false,
            selectedID: id
        });
    }

    handleToggleDeleteModal(id: string): void {
        this.setState({
            showAddEditModal: false,
            showDeleteModal: true,
            showViewModal: false,
            selectedID: id
        });
    }

    handleClose(): void {
        this.setState({
            showAddEditModal: false,
            showDeleteModal: false,
            showViewModal: false,
            selectedID: ''
        });
    }

    // On modal confirmation, close modal and refresh task list
    handleChangeConfirmation(): void {
        this.handleClose();
        this.updateTasks();
    }

    render() {
        return (
            <div className='Task-form-container'>
                <div className='Task-form-header-container'>
                    <div className='Task-form-header'>
                        <Dropdown
                            style={{
                                margin: '5px',
                                color: '#08F',
                                backgroundColor: 'white',
                                borderColor: '#08F',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                            options={CategoryOptions}
                            onSelection={this.handleCategorySelection}/>
                        <Dropdown
                            style={{
                                margin: '5px',
                                color: '#08F',
                                backgroundColor: 'white',
                                borderColor: '#08F',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                            options={CompletionOptions}
                            onSelection={this.handleCompletionSelection}/>
                        <div style={{ flexGrow: 1 }}></div>
                        <div>
                            <button className='Add-task' onClick={this.handleToggleAddModal}>Add Task</button>
                        </div>
                    </div>
                </div>
                <div className='Task-form-body-container'>
                    <div className='Task-form-body'>
                        { this.state.loading ? <div>Loading...</div> : undefined }
                        { !this.state.loading && !this.state.tasks.length ?
                            <div>No task found. Use the 'Add Task' button to create a task.</div> : undefined
                        }
                        { !this.state.loading && this.state.tasks.length ?
                            <div className='Task-form-grid'>
                                {
                                    this.state.tasks.map((task) => (
                                        <TaskCard
                                            task={task}
                                            onView={this.handleToggleViewModal}
                                            onEdit={this.handleToggleEditModal}
                                            onDelete={this.handleToggleDeleteModal}/>
                                    ))
                                }
                            </div> : undefined
                        }
                    </div>
                </div>
                <div className='Task-form-footer-container'>
                    <div className='Task-form-footer'>
                        <div>
                            <button
                                className='Page-button'
                                disabled={this.state.page === 1}
                                onClick={() => this.goToPage(1)}
                            >{'|<'}</button>
                            <button
                                className='Page-button'
                                disabled={this.state.page === 1}
                                onClick={() => this.goToPage(this.state.page-1)}
                            >{'<'}</button>
                        </div>
                        <div>
                            { this.state.total ?
                                <div className='Task-form-footer-disp'>{
                                    'Showing ' + 
                                    ((this.state.page-1)*this.state.limit+1) + 
                                    '-' +
                                    (Math.min(this.state.page*this.state.limit, this.state.total)) +
                                    ' of ' + this.state.total
                                }</div> :
                                <div className='Task-form-footer-disp'>No Tasks Found</div>
                            }
                        </div>
                        <div>
                            <button
                                className='Page-button'
                                disabled={
                                    this.state.total === 0 ||
                                    this.state.page === Math.floor((this.state.total-1)/this.state.limit)+1
                                }
                                onClick={() => this.goToPage(this.state.page+1)}
                            >{'>'}</button>
                            <button
                                className='Page-button'
                                disabled={
                                    this.state.total === 0 ||
                                    this.state.page === Math.floor((this.state.total-1)/this.state.limit)+1
                                }
                                onClick={() => this.goToPage(Math.floor((this.state.total-1)/this.state.limit)+1)}
                            >{'>|'}</button>
                        </div>
                    </div>
                </div>
                { this.state.showAddEditModal ?
                    <AddEditTaskModal
                        taskId={this.state.selectedID}
                        handleClose={this.handleClose}
                        handleConfirmation={this.handleChangeConfirmation}
                        handleAuthUpdate={this.props.handleAuthUpdate}/> : undefined}
                { this.state.showViewModal ?
                    <ViewTaskModal
                        taskId={this.state.selectedID}
                        handleClose={this.handleClose}
                        handleAuthUpdate={this.props.handleAuthUpdate}/> : undefined}
                { this.state.showDeleteModal ?
                    <DeleteTaskModal
                        taskId={this.state.selectedID}
                        handleClose={this.handleClose}
                        handleConfirmation={this.handleChangeConfirmation}
                        handleAuthUpdate={this.props.handleAuthUpdate}/> : undefined}
            </div>
        )
    }
}

export default TasksForm