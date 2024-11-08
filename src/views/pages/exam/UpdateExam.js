import { useEffect, useState } from 'react'
import {
    CButton,
    CFormLabel,
} from '@coreui/react'
import useCustomContext from '../../../hooks/useCustomContext'
import axios from '../../../api/axios'
import Swal from 'sweetalert2'
import { DatePicker, Modal, Select, TimePicker } from 'antd'
import dayjs from 'dayjs'

export default function UpdateExam({ visible, setVisible }){

    const {
        getSubjects,
        subjects,
        getAcademicYears,
        currentExam,
        setCurrentExam,
        getExams
    } = useCustomContext()

    const [ currentY, setCurrentY ] = useState({})

    const getCurrentYear = async _ => {
        await axios('year/current')
        .then( res => setCurrentY(res.data.data))
        .catch( error => console.log( error))
    }

    useEffect(() => {
        getAcademicYears()
        getCurrentYear()
        getSubjects()
    }, [])

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
    }
      
    const handleUpdate = async _ => {
        await axios.put(`/exam/update/${ currentExam.examId }`, currentExam )
        .then( response => {

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
        // console.log(currentExam)
    }

    return (
    <>
        <Modal
            title = "Modification"
            open = { visible }
            onOk = { handleUpdate }
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
                onChange = { value => setCurrentExam({ ...currentExam, subjectId: value })}
                options = {
                    subjects.map( subject => ({
                        label: subject.subjectName,
                        value: subject.subjectId
                    }))
                }
                defaultValue = { currentExam.subjectId }
            />

            <CFormLabel aria-required className='text-secondary'> Type </CFormLabel>
            <Select
                style={{
                    width: '100%',
                    marginBottom: 20,
                    height: 50
                }}
                placeholder="Type"
                onChange={ value => setCurrentExam({ ...currentExam, examType: value })}
                options={[
                    { label: 'Examen écrit', value: 'Examen écrit' },
                    { label: 'Examen oral', value: 'Examen oral' },
                    { label: 'Projet', value: 'Projet' }
                ]}
                defaultValue = { currentExam.examType }
            />

            <CFormLabel aria-required className='text-secondary'> Session </CFormLabel>
            <Select
                style={{
                    width: '100%',
                    marginBottom: 20,
                    height: 50
                }}
                placeholder="Session"
                onChange={ value => setCurrentExam({ ...currentExam, examSession: value })}
                options={[
                    { label: 'Normale', value: 'Normale' },
                    { label: 'Rattrapage', value: 'Rattrapage' }
                ]}
                defaultValue = { currentExam.examSession }
            />

            <CFormLabel aria-required className='text-secondary'> Date </CFormLabel>
            <DatePicker
                style = {{
                    width: '100%',
                    marginBottom: 20,
                    height: 50
                }}
                placeholder='Date'
                onChange = { value => setCurrentExam({ ...currentExam, examDate: value }) }
                value = { dayjs(currentExam.examDate) }
            />

            <CFormLabel aria-required className='text-secondary'> Heure début </CFormLabel>
            <TimePicker
                style = {{
                    width: '100%',
                    marginBottom: 20,
                    height: 50
                }}
                onChange = { value => setCurrentExam({ ...currentExam, examStartTime: value.format('HH:mm') }) }
                placeholder = { currentExam.examStartTime }
            />

            <CFormLabel aria-required className='text-secondary'> Heure fin </CFormLabel>
            <TimePicker
                style = {{
                    width: '100%',
                    marginBottom: 20,
                    height: 50
                }}
                onChange = { value => setCurrentExam({ ...currentExam, examFinishTime: value.format('HH:mm') }) }
                placeholder = { currentExam.examFinishTime }
            />

        </Modal>
    </>
    )
}