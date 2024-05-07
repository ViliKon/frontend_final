import { useState, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import DatePicker from 'react-datepicker';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import dayjs from 'dayjs';
import { Delete as DeleteIcon } from '@mui/icons-material';
import AddTraining from "./AddTraining";


function Traininglist() {
    const [searchText, setSearchText] = useState("");
    const [training, setTraining] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [columns, setColumns] = useState([
        { field: 'activity' },
        { field: 'duration' },
        { field: 'date' },
        { field: 'customer' }
    ]);

    const url = 'https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings';
    const fetchData = () => {
        const formattedDate = dayjs(selectedDate).format('DD-MM-YYYY');

        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings')
            .then(response => response.json())
            .then(data => setTraining(data.map(trainings =>
            ({
                activity: trainings.activity,
                duration: trainings.duration,
                date: trainings.date,
                customer: `${trainings.customer.firstname} ${trainings.customer.lastname}`

            }))));
    };

    const handleSearch = () => {
        const filteredTraining = training.filter(trainings => {
            return trainings.activity.toLowerCase().includes(searchText.toLowerCase()) ||
                trainings.duration.toString().includes(searchText.toLowerCase()) ||
                trainings.date.toString().includes(searchText.toLowerCase()) ||
                trainings.customer.toLowerCase().includes(searchText.toLowerCase());
        });

        setTraining(filteredTraining);
    };

    const handleClearSearch = () => {
        setSearchText("");
        fetchData();
    };


    useEffect(() => fetchData(), []);
    const gridRef = useRef()

    const [colDef] = useState([
        { field: 'activity', headerName: 'Activity', flex: 1, sortable: true, filter: true },
        { field: 'duration', headerName: 'Duration', flex: 1, sortable: true, filter: true },
        {
            field: 'date', headerName: 'Date', flex: 1, sortable: true, filter: true,
            valueFormatter: (params) => dayjs(params.value).format('DD-MM-YYYY HH:mm')
        },
        { field: 'customer', headerName: 'Customer', flex: 1, sortable: true, filter: true },

        {
            headerName: 'Actions',
            cellRenderer: params => (
                <DeleteIcon
                    onClick={() => deleteTraining(params.data.id)}
                    style={{ cursor: 'pointer' }}
                />
            ),
            width: 100
        }

    ]);

    const addTraining = (newTraining) => {
        const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');

        fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ ...newTraining, date: formattedDate })
        })
            .then(response => {
                if (!response.ok)
                    throw new Error("Error when adding training");

                return response.json();
            })
            .then(() => fetchData())
            .catch(err => console.error(err));
    };

    const deleteTraining = (url) => {
        if (window.confirm("Are you sure?")) {
            fetch(url, { method: 'DELETE' })
                .then(response => {
                    if (!response.ok)
                        throw new Error("Error in deletion: " + response.statusText);

                    return response.json();
                })
                .then(() => fetchData())
                .catch(err => console.error(err))
        }
    }

    return (
        <>
            <div>
                <input
                    type="text"
                    placeholder="Search activity"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                <button onClick={handleClearSearch}>Clear Search</button>
                <AddTraining addTraining={addTraining} />
            </div>
            <div className="ag-theme-material" style={{ width: 1000, height: 500 }}>

                <AgGridReact
                    ref={gridRef}
                    onGridReady={params => gridRef.current = params.api}
                    rowData={training}
                    columnDefs={colDef}
                    rowSelection="single"

                />
            </div>
        </>
    );

}

export default Traininglist;