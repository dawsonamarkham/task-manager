import { Component } from 'react';

interface CardState {}

class TaskCard extends Component<{}, CardState> {
    constructor(props: {}) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className=''></div>
        )
    }
}

export default TaskCard