import React, { useState } from 'react';
import './App.css';

const Searchbar = () => {
    const [subject, setSubject] = useState('');
    const [classNumber, setClassNumber] = useState('');
    const [semester, setSemester] = useState('');
    
    const [searchResults, setSearchResults] = useState([]);


    // This is a test!!!
    const semesterOptions = [
        { value: 'Fall', label: 'Fall' },
        { value: 'Spring', label: 'Spring' },
        { value: 'Summer', label: 'Summer' },
    ];

    // This is a test!!!
    const subjectOptions = [
        { value: 'CS', label: 'CS' },
        { value: 'ECE', label: 'ECE' },
        { value: 'ART', label: 'ART' },
    ];

    const handleSearch = () => {
        // Implement your search logic here using the subject, classNumber, and semester state values
        console.log('Searching for:', subject, classNumber, semester);
    };

    return (
        <div className='input-options'>

            <div>

                <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                >
                    <option value="">Select Subject</option>
                    {subjectOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>

                <input
                    type="number"
                    id="number"
                    placeholder="Class Number"
                    name="number_inpt"
                    value={classNumber}
                    onChange={(e) => setClassNumber(e.target.value)}
                />

                <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                >
                    <option value="">Select Semester</option>
                    {semesterOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            <button className='search-button' type="submit" onClick={handleSearch}>Search</button>
        </div>
    );
};

export default Searchbar;
