import React, { useState } from 'react';
import './App.css';

const Searchbar = () => {
    const [subject, setSubject] = useState('');
    const [classNumber, setClassNumber] = useState('');
    const [semester, setSemester] = useState('');

    const handleSearch = () => {
        // Implement your search logic here using the subject, classNumber, and semester state values
        console.log('Searching for:', subject, classNumber, semester);
    };

    return (
        <div>
            <input
                type="text"
                id="subject"
                placeholder="Subject"
                name="subject_inpt"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
            />

            <input
                type="text"
                id="number"
                placeholder="Class Number"
                name="number_inpt"
                value={classNumber}
                onChange={(e) => setClassNumber(e.target.value)}
            />

            <input
                type="text"
                id="semester"
                placeholder="Semester"
                name="semester_inpt"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
            />

            <button type="submit" onClick={handleSearch}>Search</button>
        </div>
    );
};

export default Searchbar;
