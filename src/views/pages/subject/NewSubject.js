import { useEffect, useState } from 'react'
import {
    CButton,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle
} from '@coreui/react'
import useCustomContext from '../../../hooks/useCustomContext'
import axios from '../../../api/axios'
import Swal from 'sweetalert2'
import { Input, Modal, Select } from 'antd'

export default function NewSubject(){

    const {
        getSubjects,
        getCourseUnits,
        getAcademicYears,
        courseUnits,
        academicYears,
        getProfessors,
        professors
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
    }, [])

    const semesters = currentY?.Periodes?.reduce(( accumulateur, periode ) => {
        return accumulateur.concat(periode?.Semesters)
    }, [])

    const [ subject, setSubject ] = useState({
        subjectName: '',
        courseUnitId: '',
        semesterId: '',
        studyTrack: []
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

        setSubject({
            subjectName: '',
            courseUnitId: '',
            studyTrack: []
        })
    }
      

    const handleAdd = async _ => {
        await axios.post('/subject/add', subject )
        .then( response => {

            getSubjects()
            getCourseUnits()
            closeModal()

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
        // console.log(subject)
    }

    return (
    <>
        <CButton color="primary" size = 'sm' onClick={() => setVisible(!visible)}>Ajouter</CButton>

        <Modal
            title = "Nouvelle matière"
            open = { visible }
            onOk = { handleAdd }
            onCancel = { closeModal }
            centered
            zIndex = { 1050 }
        >
            

            <CFormLabel aria-required className='text-secondary'> Désignation </CFormLabel>
            <Input
                placeholder="Désignation"
                className='mb-4'
                size='large'
                value = { subject.subjectName }
                onChange = { e => setSubject({ ...subject, subjectName: e.target.value })}
            />

            <CFormLabel aria-required className='text-secondary'> Enseignant </CFormLabel>
            <Select
                style = {{
                    width: '100%',
                    marginBottom: 20,
                    height: 50
                }}
                showSearch
                placeholder = "Enseignant"
                onChange = { value => setSubject({ ...subject, professorId: value })}
                options = {
                    professors.map( professor => ({
                        label: professor.professorName,
                        value: professor.professorId
                    }))
                }
            />

            <CFormLabel aria-required className='text-secondary'> Parcours </CFormLabel>
            <Select
                mode="multiple"
                allowClear
                style={{
                    width: '100%',
                    marginBottom: 20,
                    height: 50
                }}
                placeholder="Parcours"
                onChange={ value => setSubject({ ...subject, studyTrack: value })}
                options={[
                    { label: 'GB', value: 'GB' },
                    { label: 'IG', value: 'IG' },
                    { label: 'SR', value: 'SR' }
                ]}
            />

            <CFormLabel aria-required className='text-secondary'> Semestre </CFormLabel>
            <Select
                style={{
                    width: '100%',
                    marginBottom: 20,
                    height: 50
                }}
                placeholder="Semestre"
                onChange = { value => setSubject({ ...subject, semesterId: value }) }
                options = {
                    semesters?.map( item =>({
                        label: item.semesterName,
                        value: item.semesterId
                    }))
                }
            />

            <CFormLabel aria-required className='text-secondary'> Unité d'enseignement </CFormLabel>
            <Select
                style={{
                    width: '100%',
                    marginBottom: 20,
                    height: 50
                }}
                showSearch
                placeholder="Unité d'enseignement"
                onChange = { value => setSubject({ ...subject, courseUnitId: value }) }
                options = {
                    courseUnits?.map( item =>({
                        label: item.courseUnitName,
                        value: item.courseUnitId
                    }))
                }
            />
        </Modal>
    </>
    )
}