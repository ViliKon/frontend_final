import { useState, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import Button from '@mui/material/Button'
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AddTraining from "./AddTraining";

function Customerlist() {
    const [searchText, setSearchText] = useState("");
    const [customer, setCustomer] = useState([]);

    useEffect(() => fetchData(), []);

    const url = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/customers';

    const fetchData = () => {
        fetch(url)
            .then(response => response.json())
            .then(data => setCustomer(data._embedded.customers.map(customer =>
            ({
                id: customer._links.self.href,
                firstname: customer.firstname,
                lastname: customer.lastname,
                email: customer.email,
                phone: customer.phone,
                address: customer.streetaddress,
                postcode: customer.postcode,
                city: customer.city
            }))));
    };

    const handleSearch = () => {
        const filteredCustomer = customer.filter(customer => {
            return customer.firstname.toLowerCase().includes(searchText.toLowerCase()) ||
                customer.lastname.toLowerCase().includes(searchText.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
                customer.phone.toLowerCase().includes(searchText.toLowerCase()) ||
                customer.address.toLowerCase().includes(searchText.toLowerCase()) ||
                customer.postcode.toLowerCase().includes(searchText.toLowerCase()) ||
                customer.city.toLowerCase().includes(searchText.toLowerCase());
        });
        setCustomer(filteredCustomer);
    };

    const handleClearSearch = () => {
        setSearchText("");
        fetchData();
    };


    const gridRef = useRef()

    const addCustomer = (newCustomer) => {
        fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(newCustomer)
        })
            .then(response => {
                if (!response.ok)
                    throw new Error("Error when adding a customer");

                return response.json();
            })
            .then(() => fetchData())
            .catch(err => console.error(err))
    }

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


    const deleteCustomer = (url) => {
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

    const updateCustomer = (customer, url) => {
        fetch(url, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(customer)
        })
            .then(response => {
                if (!response.ok)
                    throw new Error("Error when updating customer");

                return response.json();
            })
            .then(() => fetchData())
            .catch(err => console.error(err))
    }

    const exportToCSV = () => {
        const csvData = customer.map(c => ({
            "First Name": c.firstname,
            "Last Name": c.lastname,
            "Email": c.email,
            "Phone": c.phone,
            "Address": c.address,
            "Postcode": c.postcode,
            "City": c.city
        }));
    
        const csvContent = "data:text/csv;charset=utf-8," +
            Object.keys(csvData[0]).join(",") + "\n" +
            csvData.map(row => Object.values(row).join(",")).join("\n");
    
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "customers.csv");
        document.body.appendChild(link);
        link.click();
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
                <Button onClick={exportToCSV}>Export to CSV</Button>

            </div>
            <div className="ag-theme-material" style={{ width: 1500, height: 500 }}>
                <AgGridReact
                    ref={gridRef}
                    onGridReady={params => gridRef.current = params.api}
                    rowData={customer}
                    rowSelection="single"
                    suppressCellSelection={true}
                    defaultColDef={{
                        sortable: true,
                        filter: true,
                        flex: 1
                    }}
                    columnDefs={[
                        {headerName: 'Trainings',
                            cellRenderer: params => (
                                <div>
                                     <AddTraining addTraining={addTraining} />
                                </div>
                            )
                        },
                        { field: 'firstname', headerName: 'First Name' },
                        { field: 'lastname', headerName: 'Last Name' },
                        { field: 'email', headerName: 'Email' },
                        { field: 'phone', headerName: 'Phone' },
                        { field: 'address', headerName: 'Street address' },
                        { field: 'postcode', headerName: 'Postcode' },
                        { field: 'city', headerName: 'City' },
                        {
                            headerName: 'Actions',
                            cellRenderer: params => (
                                <div>
                                   
                                    <Button
                                        size="small"
                                        onClick={() => handleEdit(params.data)}
                                    >
                                        <EditIcon />
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={() => deleteCustomer(params.data.id)}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </div>
                            ),
                            width: 500
                        }
                    ]}
                />
            </div>
        </>
    );

}

export default Customerlist;