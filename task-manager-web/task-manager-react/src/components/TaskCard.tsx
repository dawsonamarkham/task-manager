import { Component } from 'react';
import './TaskCard.css';
import { TaskData } from '../models/tasks';

interface CardProps {
    task: TaskData;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

// Map for coloring categories
const CategoryColors = {
    'Work': '#edc87d',
    'Personal': '#24d5ff',
    'Hobby': '#ecf820',
    'Other': '#06fed7'
}

// Serves as a quick way to view the most important Task info
class TaskCard extends Component<CardProps, {}> {
    constructor(props: CardProps) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div
                className='Task-card'
                style={{backgroundColor: CategoryColors[this.props.task.category]}}>
                <div
                    className='Task-card-header'
                    style={{backgroundColor: CategoryColors[this.props.task.category]}}>
                    <div className='Task-card-category'>
                        {this.props.task.category}
                    </div>
                    { this.props.task.completed ?
                        <div className='Task-card-complete'>Complete</div> :
                        <div className='Task-card-incomplete'>Incomplete</div>
                    }
                </div>
                <div className='Task-card-body'>
                    <div className='Task-card-title'>{this.props.task.title}</div>
                    {
                        this.props.task.description ?
                        <div className='Task-card-description'>{this.props.task.description}</div> :
                        <div className='Task-card-no-description'>No Description</div>
                    }
                </div>
                <div className='Task-card-footer'>
                    <button
                        className='Task-card-button'
                        onClick={() => this.props.onView(this.props.task.id)}
                    >View</button>
                    <button
                        className='Task-card-button'
                        onClick={() => this.props.onEdit(this.props.task.id)}
                    >Edit</button>
                    <button
                        className='Task-card-button'
                        style={{borderColor: '#F03', color: '#F03'}}
                        onClick={() => this.props.onDelete(this.props.task.id)}
                    >Delete</button>
                </div>
            </div>
        )
    }
}

export default TaskCard