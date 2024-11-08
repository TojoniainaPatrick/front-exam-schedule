import { useEffect, useState } from 'react'
import {
    CButton,
    CFormLabel,
} from '@coreui/react'
import useCustomContext from '../../../hooks/useCustomContext'
import axios from '../../../api/axios'
import Swal from 'sweetalert2'
import { DatePicker, Modal, Select, TimePicker } from 'antd'

export default function NewExam(){

    const {
        getSubjects,
        subjects,
        getCourseUnits,
        getAcademicYears,
        courseUnits,
        academicYears,
        getProfessors,
        professors,
        getExams
    } = useCustomContext()

    const [visible, setVisible] = useState(false)
    const [ currentY, setCurrentY ] = useState({})

    const getCurrentYear = async _ => {
        await axios('year/current')
        .then( res => setCurrentY(res.data.data))
        .catch( error => console.log( error))
    }

    useEffect(() => {
        getAcademicYears()
        getCurrentYear()
        getProfessors()
        getSubjects()
    }, [])

    // const semesters = currentY?.Periodes?.reduce(( accumulateur, periode ) => {
    //     return accumulateur.concat(periode?.Semesters)
    // }, [])

    const [ exam, setExam ] = useState({
        examDate: '',
        examType: '',
        examStartTime: '',
        examFinishTime: '',
        examSession: '',
        subjectId: ''
    })

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
    });

    const closeModal = () => { 
        setVisible(false)

        setExam({
            examDate: '',
            examType: '',
            examStartTime: '',
            examFinishTime: '',
            examSession: '',
            subjectId: ''
        })
    }
      

    const handleAdd = async _ => {
        await axios.post('/exam/add', exam )
        .then( response => {

            getSubjects()
            getCourseUnits()
            closeModal()
            getExams()

            Toast.fire({
                icon: "success",
                title: response.data.message
            });

        })
        .catch( error => {
            if( error?.response?.data?.message){
                Swal.fire({
                    icon: 'error',
                    text: error?.response?.data?.message
                })
            }
            else{
                Swal.fire({
                    icon: 'error',
                    text: error?.message
                })
            }
            console.log(error)
        })
        // console.log(exam)
    }

    return (
    <>
        <CButton color="primary" size = 'sm' onClick={() => setVisible(!visible)}>Ajouter</CButton>

        <Modal
            title = "Nouvel examen"
            open = { visible }
            onOk = { handleAdd }
            onCancel = { closeModal }
            centered
            zIndex = { 1050 }
        >

            <CFormLabel aria-required className='text-secondary'> Matière </CFormLabel>
            <Select
                style = {{
                    width: '100%',
                    marginBottom: 20,
                    height: 50
                }}
                showSearch
                placeholder = "Matière"
                onChange = { value => setExam({ ...exam, subjectId: value })}
                options = {
                    subjects.map( subject => ({
                        label: subject.subjectName,
                        value: subject.subjectId
                    }))
                }
            />

            <CFormLabel aria-required className='text-secondary'> Type </CFormLabel>
            <Select
                style={{
                    width: '100%',
                    marginBottom: 20,
                    height: 50
                }}
                placeholder="Type"
                onChange={ value => setExam({ ...exam, examType: value })}
                options={[
                    { label: 'Examen écrit', value: 'Examen écrit' },
                    { label: 'Examen oral', value: 'Examen oral' },
                    { label: 'Projet', value: 'Projet' }
                ]}
            />

            <CFormLabel aria-required className='text-secondary'> Session </CFormLabel>
            <Select
                style={{
                    width: '100%',
                    marginBottom: 20,
                    height: 50
                }}
                placeholder="Session"
                onChange={ value => setExam({ ...exam, examSession: value })}
                options={[
                    { label: 'Normale', value: 'Normale' },
                    { label: 'Rattrapage', value: 'Rattrapage' }
                ]}
            />

            <CFormLabel aria-required className='text-secondary'> Date </CFormLabel>
            <DatePicker
                style = {{
                    width: '100%',
                    marginBottom: 20,
                    height: 50
                }}
                placeholder='Date'
                onChange = { value => setExam({ ...exam, examDate: value }) }
            />

            <CFormLabel aria-required className='text-secondary'> Heure début </CFormLabel>
            <TimePicker
                style = {{
                    width: '100%',
                    marginBottom: 20,
                    height: 50
                }}
                placeholder='Heure début'
                onChange = { value => setExam({ ...exam, examStartTime: value.format('HH:mm') }) }
            />

            <CFormLabel aria-required className='text-secondary'> Heure fin </CFormLabel>
            <TimePicker
                style = {{
                    width: '100%',
                    marginBottom: 20,
                    height: 50
                }}
                placeholder='Heure fin'
                onChange = { value => setExam({ ...exam, examFinishTime: value.format('HH:mm') }) }
            />

        </Modal>
    </>
    )
}