import React from 'react';
import * as dateFns from 'date-fns';
import Appointment from './createAppointment';


class Calendar extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            currentMonth: new Date(),
            selectedDate: new Date(),
            appointments: [],
            isModalOpen: false
        };

        this.modalAction = this.modalAction.bind(this);
        this.cancelAppt = this.cancelAppt.bind(this);
        this.editAppt = this.editAppt.bind(this);
        this.downloadJSON = this.downloadJSON.bind(this);
    }

    header() {
        const dateFormat = "MMMM yyyy";

        return (
            <div className="month-select">
                <div className="head-left">
                    <div className="icon" onClick={this.prevMonth}>
                        <h1>{"<"}</h1>
                    </div>
                </div>

                <div className="head-center"> 
                    <span>
                        {dateFns.format(this.state.currentMonth, dateFormat)}
                    </span>
                </div>

                <div className="head-right" onClick={this.nextMonth}>
                    <h1 className="icon">{">"}</h1>
                </div>
            </div>
        )
    }

   
    nextMonth = () => {
        this.setState({
            currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
        });
    };

    prevMonth = () => {
        this.setState({
            currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
        });
    };

    days() {
        const dateFormat = "EEEE";

        const days = [];

        let startDate = dateFns.startOfWeek(this.state.currentMonth);

        for( let i = 0; i < 7; i++){
            days.push(
                <div className="day-of-week" key={i}>
                    {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
                </div>
            );
        };

        return <div className="days-row">{days}</div>
    };

    tableCells() {
        const { currentMonth, selectedDate } = this.state;


        const monthStart = dateFns.startOfMonth(currentMonth);
        const monthEnd = dateFns.endOfMonth(monthStart);

        const startDate = dateFns.startOfWeek(monthStart);
        const endDate = dateFns.endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];

        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = dateFns.format(day, dateFormat);

                const cloneDay = day;
                days.push(
                    <div id={formattedDate} className={`col ${
                        !dateFns.isSameMonth(day, monthStart) ? "disabled" : 
                        dateFns.isSameDay(day, selectedDate) ? "selected" : "" }`}
                        key={day}
                        onClick={() => this.onDateClick(cloneDay)}>
                        <span className="number">{formattedDate}</span>
                    </div>
                );

                day = dateFns.addDays(day, 1);
            }
            rows.push(
                <div className="row" key={day}>
                    {days}
                </div>
            );
            days = [];
        };

        return <div className="grid-body">{rows}</div>;
    };

    onDateClick = (day) => {
        this.setState({
            selectedDate: day,
        });

        this.modalAction(true)
    };

    modalAction = (binary) => {
        this.setState({
            isModalOpen: binary
        });
    };

 
    renderModal = () => {
        if (this.state.isModalOpen === true) {
                return (
                    <div className="modal">
                        <Appointment
                            selectedDate={this.state.selectedDate}
                            appointments={this.state.appointments}
                            modalAction={this.modalAction} />
                    </div>
                );
            };  
    };

    cancelAppt = (id) => {

        document.getElementById(id).classList.remove('booked');

        const appointments = this.state.appointments.filter( appt => appt.id !== id);
        this.setState({appointments})

    };

    editAppt = (id) => {
        this.modalAction(true);
        this.cancelAppt(id);
        this.renderModal(id)
    }


    downloadJSON = (elementId) => {
        let jsonData = this.state.appointments;
        
        let ele = document.getElementById(elementId);
        let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData));

        ele.setAttribute("href", "data:" + data);
        ele.setAttribute("download", "appointments.json");    
    }

    render(){
        let listings;

        if( this.state.appointments.length > 0){
                listings = this.state.appointments.map(appt => {
                document.getElementById(appt.id).classList.add('booked');
                
                let apptDate = dateFns.format(appt.date, "M")
                
                return (
                    <li key={appt.id} >
                        <span>Date: {apptDate}/{appt.id}</span>
                            <br/>
                        <span>Name: {appt.name}</span>
                            <br/>
                        <span>Email:  {appt.email}</span>
                            <br/>
                        <span>Time:  {appt.time}</span>
                            <br/>
                        <button onClick={() => {this.editAppt(appt.id)}}>Edit</button>
                            <br/>
                        <button onClick={() => this.cancelAppt(appt.id)}>Cancel</button>
                    </li>
                )
            })
        }


        return (
            <>
            <div className="modal-container">
                    {this.renderModal()}
            </div>
            <section>
            <h1 className="calendar">Calendar</h1>
                {this.header()}
            <div className="container">
                {this.days()}
                {this.tableCells()}
            </div>
            </section>
            <a id="json" href="data:" onClick={() => this.downloadJSON("json")}>Download JSON</a>
            <ul className="appt-list">
                {listings}
            </ul>
            </>
        );
    };
};

export default Calendar;