import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Searchbar = () => {
    const [codes, setCodes] = useState({});
    const [instructors, setInstructors] = useState({});
    const [display, setDisplay] = useState({});
    let str = '';
    let getData = '';

    const [errorMessage, setErrorMessage] = React.useState("");
    const [subject, setSubject] = useState('');
    const [classNumber, setClassNumber] = useState('');
    const [semester, setSemester] = useState('');
    
    const [searchResults, setSearchResults] = useState([]);

    const [semesterOptions, setSemesterOptions] = useState([]);
    const [subjectOptions, setSubjectOptions] = useState([]);

    const fetchInstruct = async () => {
        
        try {
            const instructorRegisters = await axios.get(str);
            setInstructors(instructorRegisters.data.instructors);

            console.log(instructorRegisters.data);

        } catch(error)
        {
            console.error("Error fetching data: ", error);
        }
    }

    const fetchAPI = async () => {
        try {
            const coursesResponse = await axios.get("http://localhost:8080/api/courses");
            const semestersResponse = await axios.get("http://localhost:8080/api/semesters");
            const codeResponse = await axios.get("http://localhost:8080/api/codes");

            setSubjectOptions(Object.entries(coursesResponse.data).map(([key, value]) => ({ value: key, label: value })));
            setSemesterOptions(Object.entries(semestersResponse.data).map(([key, value]) => ({ value: key, label: value })));
            setCodes(codeResponse.data);

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
            console.log(codes);

            str = "http://localhost:8080/api/plot/"+codes[selectedSemesterOption.label] + "/" + selectedSubjectOption.label + "/" + classNumber;
            getData = "http://localhost:8080/api/get_plot/"+ codes[selectedSemesterOption.label] + "/" + selectedSubjectOption.label + "/" + classNumber + "/";
            console.log(getData);
            fetchInstruct();
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
        <div>
            <div>
                <div className="flex justify-between h-1/3 px-8">   
                    <h1 className='text-6xl font-bold'>[Website name]</h1>
            
                    {/* This will hold the search boxes */}
                    <div className='bg-red-500'>
                        
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
                </div>
                
                <div>
                    {Object.entries(instructors).map(([instructor, png]) => (
                        <div key={instructor}>
                            <h2>{instructor}</h2>
                            <img src={`${getData}${png}`} alt={instructor} />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Searchbar;
