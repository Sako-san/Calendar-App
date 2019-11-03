import React from 'react';
import * as dateFns from 'date-fns';

class Appointment extends React.Component {
    constructor(props){
        super(props);

        let id = dateFns.format(props.selectedDate, 'd');

        this.state = {
            name: '',
            email: '',
            time: '',
            date: props.selectedDate,
            id: id
        };
 


        console.log(this.state)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    update(field){
        return (e) => {
            this.setState({[field]: e.target.value });
        };
    };

    handleSubmit(e) {
        e.preventDefault();
        
        const appt = this.state;

        this.props.appointments.push(appt);
        this.props.modalAction(false);
    };

    render() {
        return (
            <form className="appointment-form" onSubmit={this.handleSubmit}>
                <h1>Schedule an Appointment!</h1>
                <label className="input-field">Name
                    <input 
                        type="text"
                        value={this.state.name}
                        onChange={this.update('name')}/>
                </label>

                <label className="input-field">Email
                    <input 
                        type="email" 
                        value={this.state.email} 
                        onChange={this.update('email')}/>
                </label>

                <label className="input-field">Appointment Time
                    <input 
                        type="time" 
                        value={this.state.time} 
                        onChange={this.update('time')}/>
                </label>

                <label className="submit">
                    <input type="submit" />
                </label> 
            </form>
        );
    };
};

export default Appointment;