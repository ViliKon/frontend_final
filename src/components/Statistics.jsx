import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import _ from 'lodash';

function Statistics() {
    const [activityStatistics, setActivityStatistics] = useState([]);

    useEffect(() => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings')
            .then(response => response.json())
            .then(data => {
                const groupedData = _.groupBy(data, 'activity');
                const statistics = _.map(groupedData, (activities, activity) => ({
                    activity,
                    totalMinutes: _.sumBy(activities, 'duration')
                }));
                setActivityStatistics(statistics);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>Activity Statistics</h2>
            <BarChart width={600} height={300} data={activityStatistics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="activity" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalMinutes" fill="#8884d8" />
            </BarChart>
        </div>
    );
}

export default Statistics;
