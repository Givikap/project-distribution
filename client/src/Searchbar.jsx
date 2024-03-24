import { useState, useEffect } from "react";
import axios from "axios";

const Searchbar = () => {
    const [schoolsOptions, setSchoolsOptions] = useState([]);
    const [coursesOptions, setCoursesOptions] = useState([]);
    const [semestersOptions, setSemestersOptions] = useState([]);

    const fetchSchools = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/schools");
            setSchoolsOptions(Object.entries(response.data).map(([key, value]) => ({ value: key, label: value })));
        } catch (error) {
            console.error("Error fetching schools: ", error);
        }
    };

    const fetchCourses = async (school) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/courses/${school}`);
            setCoursesOptions(Object.entries(response.data).map(([key, value]) => ({ value: key, label: value })));
        } catch (error) {
            console.error("Error fetching courses: ", error);
        }
    };

    const fetchSemesters = async (school) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/semesters/${school}`);
            setSemestersOptions(Object.entries(response.data).map(([key, value]) => ({ value: key, label: value })));
        } catch (error) {
            console.error("Error fetching semesters: ", error);
        }
    };

    const [schoolsCodes, setSchoolsCodes] = useState({});
    const [semestersCodes, setSemestersCodes] = useState({});

    const fetchCodes = async () => {
        try {
            const schooolsCodesResponse = await axios.get("http://localhost:8080/api/schools_codes");
            setSchoolsCodes(schooolsCodesResponse.data);

            const semestersCodesResponse = await axios.get("http://localhost:8080/api/semesters_codes");
            setSemestersCodes(semestersCodesResponse.data);
        } catch (error) {
            console.error("Error fetching codes: ", error);
        }
    };

    const [instructors, setInstructors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const fetchInstructors = async (api_arguments) => {
        try {
            const response = await axios.get("http://localhost:8080/api/instructors/" + api_arguments);
            console.log(response.data.instructors);
            setInstructors(response.data.instructors);
            setErrorMessage(response.data.message);
        } catch(error) {
            console.error("Error fetching instructors: ", error);
        }
    }

    const [school, setSchool] = useState("");
    const [course, setCourse] = useState("");
    const [classNumber, setClassNumber] = useState("");
    const [semester, setSemester] = useState("");

    const handleSearch = () => {
        const selectedSchool = schoolsOptions.find(option => option.value === school);
        const selectedCourseOption = coursesOptions.find(option => option.value === course);
        const selectedSemesterOption = semestersOptions.find(option => option.value === semester);

        if (selectedSchool && selectedSemesterOption && selectedCourseOption && classNumber) 
        {
            const api_arguments = (
                `${schoolsCodes[selectedSchool.label]}/` +
                `${semestersCodes[selectedSemesterOption.label]}/` +
                `${selectedCourseOption.label}/` +
                classNumber
            )
            fetchInstructors(api_arguments);
        } 
        else if (schoolsOptions.length == 0)
            setErrorMessage("Server is down, sorry :з");
        else {
            let missingOptions = [];

            if (!selectedSchool)
                missingOptions.push("school");
            if (!selectedCourseOption)
                missingOptions.push("course");
            if (!classNumber)
                missingOptions.push("course number");
            if (!selectedSemesterOption)
                missingOptions.push("semester");

            if (missingOptions.length > 1) {
                let lastOption = missingOptions.pop();
                setErrorMessage(`Please select ${missingOptions.join(', ')} and ${lastOption} first`);
            }
            else
                setErrorMessage(`Please select ${missingOptions[0]} first`);

            setInstructors({});
        }
    };

    useEffect(() => {
        fetchSchools();
        fetchCodes();
    }, []);

    useEffect(() => {
        const selectedSchool = schoolsOptions.find(option => option.value === school);

        if (selectedSchool) {
            fetchCourses(schoolsCodes[selectedSchool.label]);
            fetchSemesters(schoolsCodes[selectedSchool.label]);
        }
    }, [school]);

    return (
        <div>
            <div>
                <div className="flex justify-between items-center h-24 px-8 align-middle bg-gray-800">   
                    <h1 className="text-6xl font-bold flex items-center justify-left w-1/2 text-slate-100 pb-4">Grade Distribution</h1>
                    <div className="flex items-center justify-between w-2/3 pl-36">
                        <div className="flex items-center">
                            <select
                                className="border-b-4 border-slate-800 rounded-l-lg w-96 p-2"
                                value={school}
                                onChange={(e) => setSchool(e.target.value)}
                            >
                            <option value="">School</option>
                                {schoolsOptions && schoolsOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>

                            <select
                                className="border-b-4 border-slate-800 w-24 p-2"
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                            >
                            <option value="">Course</option>
                                {coursesOptions && coursesOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>

                            <input
                                className="border-b-4 border-slate-800 w-24 p-2"
                                type="number"
                                id="number"
                                placeholder="Number"
                                name="number_inpt"
                                value={classNumber}
                                onChange={(e) => setClassNumber(e.target.value)}
                            />

                            <select
                                className="border-b-4 border-slate-800 rounded-r-lg select-none mx-none w-36 p-2"
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                            >
                            <option value="">Semester</option>
                                {semestersOptions && semestersOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        <button className="mb-2 ml-12 text-slate-100 bg-slate-700 text-gray-800 h-14 w-28 font-medium rounded-lg" type="submit" onClick={handleSearch}>Search</button>
                    </div>
                </div>

                {errorMessage && <div 
                    className="font-bold text-2xl flex items-center justify-center w-full h-16 bg-red-500"
                    > {errorMessage} 
                </div>}

                <div className="p-24 grid grid-cols-[repeat(auto-fit,_40%)] mx-auto w-full justify-center px-4">        
                    {Object.entries(instructors).map(([instructor, png]) => (
                        <div
                            className="bg-gray-800 w-fit my-4 rounded-lg"
                            key={instructor}
                        >
                            <img className="rounded-t-lg" src={"http://localhost:8080/api/plot/" + png} alt={instructor}/>
                            <h2 className="font-bold p-4 text-slate-100">{instructor}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Searchbar;