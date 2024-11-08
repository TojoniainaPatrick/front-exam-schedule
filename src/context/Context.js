import { createContext, useState } from 'react'
import axios from '../api/axios'

const Context = createContext()

export const ContextProvider = ({ children }) => {

    const userAuth = JSON.parse( localStorage.getItem('user') )
    const [ user, setUser ] = useState(userAuth)

    const [ users, setUsers ] = useState([])
    const [ currentUser, setCurrentUser ] = useState({})

    const getUsers = async _ => {
        await axios('/user/list')
        .then( response => setUsers( response.data.data ))
        .catch( error => console.log( error ))
    }

    const [ professors, setProfessors ] = useState([])
    const [ currentProfessor, setCurrentProfessor ] = useState({})

    const getProfessors = async _ => {
        await axios('/professor/list')
        .then( response => setProfessors( response.data.data ))
        .catch( error => console.log( error ))
    }

    const [ subjects, setSubjects ] = useState([])
    const [ currentSubject, setCurrentSubject ] = useState({})

    const getSubjects = async _ => {
        await axios('/subject/list')
        .then( response => setSubjects( response.data.data ))
        .catch( error => console.log( error ))
    }

    const [ courseUnits, setCourseUnits ] = useState([])
    const [ currentCourseUnit, setCurrentCourseUnit ] = useState({})

    const getCourseUnits = async _ => {
        await axios('/course-unit/list')
        .then( response => setCourseUnits( response.data.data ))
        .catch( error => console.log( error ))
    }

    const [ exams, setExams ] = useState([])
    const [ currentExam, setCurrentExam ] = useState({})

    const getExams = async _ => {
        await axios('/exam/list')
        .then( response => setExams( response.data.data ))
        .catch( error => console.log( error ))
    }

    const [ academicYears, setAcademicYears ] = useState([])
    const [ currentAcademicYears, setCurrentAcademicYear ] = useState({})

    const getAcademicYears = async _ => {
        await axios('/year/list')
        .then( response => setAcademicYears( response.data.data ))
        .catch( error => console.log( error ))
    }

    return(
        <Context.Provider value = {{

            // user
            user,
            setUser,
            
            // users
            users,
            getUsers,
            currentUser,
            setCurrentUser,

            // professors
            professors,
            getProfessors,
            currentProfessor,
            setCurrentProfessor,

            // subjects
            subjects,
            getSubjects,
            currentSubject,
            setCurrentSubject,

            // course units
            courseUnits,
            getCourseUnits,
            currentCourseUnit,
            setCurrentCourseUnit,

            // exams
            exams,
            getExams,
            currentExam,
            setCurrentExam,

            // academic years
            academicYears,
            getAcademicYears,
            currentAcademicYears,
            setCurrentAcademicYear,
        }}>
            { children }
        </Context.Provider>
    )
}

export default Context