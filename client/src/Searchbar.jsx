import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Searchbar = () => {
    const [coursesOptions, setCoursesOptions] = useState([]);
    const [semestersOptions, setSemestersOptions] = useState([]);
    const [codes, setCodes] = useState({});

    const fetchCourses = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/courses");
            setCoursesOptions(Object.entries(response.data).map(([key, value]) => ({ value: key, label: value })));
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const fetchSemesters = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/semesters");
            setSemestersOptions(Object.entries(response.data).map(([key, value]) => ({ value: key, label: value })));
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const fetchCodes = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/codes");
            setCodes(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const [instructors, setInstructors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [plotPath, setPlotPath] = useState("");

    const fetchInstructors = async (api) => {
        try {
            const response = await axios.get(api);
            setInstructors(response.data.instructors);
            setErrorMessage(response.data.message);
        } catch(error) {
            console.error("Error fetching data: ", error);
        }
    }

    const [subject, setSubject] = useState('');
    const [classNumber, setClassNumber] = useState('');
    const [semester, setSemester] = useState('');

    const handleSearch = () => {
        const selectedCourseOption = coursesOptions.find(option => option.value === subject);
        const selectedSemesterOption = semestersOptions.find(option => option.value === semester);

        if (selectedSemesterOption && selectedCourseOption && classNumber) 
        {
            const api_arguments = (
                `${codes[selectedSemesterOption.label]}/` +
                `${selectedCourseOption.label}/` +
                classNumber
            )
            console.log(api_arguments);

            fetchInstructors('http://localhost:8080/api/instructors/' + api_arguments);

            if (errorMessage == '') {
                setPlotPath('http://localhost:8080/api/plot/' + api_arguments);
                console.log(plotPath);
            } 
        } else
        {
            setErrorMessage("Error: All options must be filled in.");
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchSemesters();
        fetchCodes();
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
                            {coursesOptions && coursesOptions.map(option => (
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
                            {semestersOptions && semestersOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select> 

                        <button type="submit" onClick={handleSearch}>Search</button>
                        {errorMessage && <div> {errorMessage} </div>}
                    </div>
                </div>
                
                <div>
                    {plotPath && Object.entries(instructors).map(([instructor, png]) => (
                        <div key={instructor}>
                            <h2>{instructor}</h2>
                            <img src={`${plotPath}/${png}`} alt={instructor} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Searchbar;
