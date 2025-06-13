import React, { Component } from 'react';

interface DropdownProps {
    selectedValue?: string
    style?: React.CSSProperties;
    options: Array<string>;
    onSelection: (val: string) => void;
}

interface DropdownState {
    selection: string;
}

// Dropdown allows for editable style and option preselection
class Dropdown extends Component<DropdownProps, DropdownState> {
    constructor(props: DropdownProps) {
        super(props);
        this.state = {
            selection: this.props.selectedValue && this.props.options.includes(this.props.selectedValue) ?
                this.props.selectedValue : this.props.options[0]            
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        this.setState({ selection: event.target.value});
        this.props.onSelection(event.target.value);
    }

    render() {
        return (
            <div>
                <select style={this.props.style} value={this.state.selection} onChange={this.handleChange}>
                    {this.props.options.map((opt, ind) => (
                        <option key={ind} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
}

export default Dropdown;