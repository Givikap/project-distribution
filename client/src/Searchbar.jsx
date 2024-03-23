import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Searchbar = () => {
    const [errorMessage, setErrorMessage] = React.useState("");
    const [subject, setSubject] = useState('');
    const [classNumber, setClassNumber] = useState('');
    const [semester, setSemester] = useState('');
    
    const [searchResults, setSearchResults] = useState([]);

    const [semesterOptions, setSemesterOptions] = useState([]);
    const [subjectOptions, setSubjectOptions] = useState([]);


    const fetchAPI = async () => {
        try {
            const coursesResponse = await axios.get("http://localhost:5050/api/courses");
            const semestersResponse = await axios.get("http://localhost:5050/api/semesters");

            console.log(coursesResponse.data);

            setSubjectOptions(Object.entries(coursesResponse.data).map(([key, value]) => ({ value: key, label: value })));
            setSemesterOptions(Object.entries(semestersResponse.data).map(([key, value]) => ({ value: key, label: value })));
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const handleSearch = () => {
        // Implement your search logic here using the subject, classNumber, and semester state values
        setErrorMessage("");
        const selectedSemesterOption = semesterOptions.find(option => option.value === semester);
        const selectedSubjectOption = subjectOptions.find(option => option.value === subject);
        
        if (selectedSemesterOption && selectedSubjectOption && classNumber) 
        {
            console.log('Searching for:', selectedSubjectOption.label, classNumber, selectedSemesterOption.label);



        }
        else
        {
            setErrorMessage("Error: All options must be filled in.");
        }
    };

    useEffect(() => {
        fetchAPI();
    }, []);

    return (
        <div class='bg-red-500'>
            
            <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
            >
                <option value="">Select Subject</option>
                {subjectOptions && subjectOptions.map(option => (
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
                {semesterOptions && semesterOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select> 

            <button type="submit" onClick={handleSearch}>Search</button>
            {errorMessage && <div> {errorMessage} </div>}
        
        </div>
    );
};

export default Searchbar;
