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
                <div className="flex justify-between h-24 px-8 align-middle bg-gray-800 p-b-16 py-4">   
                    <h1 className='pb-6 text-6xl font-bold flex items-center justify-left w-1/2 bg-gray-800 text-slate-100'>Grade Distribution</h1>
            
                    {/* This will hold the search boxes */}
                    <div className='flex items-center justify-between w-1/2 px-8'>
                        <div>
                        <select
                            className='border-b-4 border-slate-800 rounded-l-lg'
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        >
                            <option value="">Select Subject</option>
                            {coursesOptions && coursesOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>

                        <input
                            className='border-b-4 border-slate-800'
                            type="number"
                            id="number"
                            placeholder="Class Number"
                            name="number_inpt"
                            value={classNumber}
                            onChange={(e) => setClassNumber(e.target.value)}
                        />

                        <select
                            className='border-b-4 border-slate-800 rounded-r-lg select-none mx-none'
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                        >
                            <option value="">Select Semester</option>
                            {semestersOptions && semestersOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select> 
                        </div>

                        <button className='text-slate-100 bg-slate-700 text-gray-800 h-14 w-28 font-medium rounded-lg' type="submit" onClick={handleSearch}>Search</button>
                        {errorMessage && <div> {errorMessage} </div>}
                    </div>
                </div>
                
                <div className='pl-16 py-6 justify-between grid grid-cols-2'>
                    {plotPath && Object.entries(instructors).map(([instructor, png]) => (
                        <div
                            className='bg-red-500 w-fit my-4' 
                            key={instructor}
                        >
                            <img src={`${plotPath}/${png}`} 
                                alt={instructor}
                            />
                            <h2>{instructor}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Searchbar;
