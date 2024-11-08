import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer,
    CFormInput,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow
} from '@coreui/react'
import useCustomContext from '../../../hooks/useCustomContext'
import { useEffect, useState } from 'react'
import NewCourseUnit from '../course-unit/NewCourseUnit'
import { Button } from 'antd'
import { MdDelete } from "react-icons/md"
import { FaEdit } from "react-icons/fa"
import NewSubject from './NewSubject'
import UpdateSubject from './UpdateSubject'
import Swal from 'sweetalert2'
import axios from '../../../api/axios'

export default function Subject(){

    const {
        getCourseUnits,
        courseUnits,
        getSubjects,
        subjects,
        currentSubject,
        setCurrentSubject
    } = useCustomContext()

    const [ currentCU, setCurrentCU ] = useState({})
    const [ visibleUpdate, setVisibleUpdate ] = useState( false )

    useEffect( () => {
        getCourseUnits()
        getSubjects()
    }, [])

    
    const handleDelete = async subjectId => {
        Swal.fire({
            title: "Suppression",
            text: "Voulez-vous continuer?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Continuer",
            cancelButtonText: 'Annuler'
        }).then(async result => {
            if (result.isConfirmed) {
                await axios.delete(`/subject/delete/${subjectId}`)
                .then( response => {
                    Swal.fire({
                        title: "Matière",
                        text: response.data?.message,
                        icon: "success"
                    });
                    getSubjects()
                    getCourseUnits()
                })
                .catch( error => {
                    if( error?.response?.data?.message ){
                        Swal.fire({
                            title: "Matière",
                            text: error?.response?.data?.message,
                            icon: "error"
                        });
                    }
                    else{
                        Swal.fire({
                            title: "Matière",
                            text: error.message,
                            icon: "error"
                        });
                    }
                })
            }
        });
    }

    const handleUpdate = ( subject ) => {
        setCurrentSubject(subject)
        setVisibleUpdate( true )
    }

    return(
        <>
            <UpdateSubject visible = { visibleUpdate } setVisible = { setVisibleUpdate } />

            <CContainer>
                <CRow className='d-flex justify-content-between'>

                    <CCol md = { 8 }>
                        <CCard className='p-3'>

                            <CCardHeader>Eléments constitutifs </CCardHeader>

                            <CCardBody>

                                <CRow className='d-flex justify-content-between align-items-center mb-3'>

                                    <CCol md = { 10 } className='text-start'>
                                        <CFormInput placeholder='Recherche ...' />
                                    </CCol>

                                    <CCol md = { 2 } className='text-end'>
                                        <NewSubject />
                                    </CCol>
                                </CRow>

                                <CRow>
                                    <CCol>
                                        <CTable align="middle" className="mb-0 border" hover responsive>

                                            <CTableHead className="text-nowrap">

                                                <CTableRow>

                                                    <CTableHeaderCell className="bg-body-tertiary text-center width-100">Désignation</CTableHeaderCell>

                                                    <CTableHeaderCell className="bg-body-tertiary text-center"> Parcours </CTableHeaderCell>

                                                    <CTableHeaderCell className="bg-body-tertiary text-center"> Semestre </CTableHeaderCell>

                                                    <CTableHeaderCell className="bg-body-tertiary text-center"> U E </CTableHeaderCell>

                                                    <CTableHeaderCell className="bg-body-tertiary text-center"> Action </CTableHeaderCell>

                                                </CTableRow>

                                            </CTableHead>

                                            <CTableBody>

                                                {
                                                    subjects.map((subject, index) => (
                                                        <CTableRow v-for="subject in tableItems" key={index}>

                                                            <CTableDataCell className='text-center'>
                                                                <span> { subject.subjectName } </span>
                                                            </CTableDataCell>

                                                            <CTableDataCell className='text-center'>
                                                                {
                                                                    subject?.studyTrack?.map(( track, key ) =>
                                                                        <span key = { key } style={{
                                                                            padding: '3px 5px',
                                                                            borderRadius: 5,
                                                                            background: 'grey',
                                                                            margin: 2
                                                                        }}> { track } </span>
                                                                    )
                                                                }
                                                            </CTableDataCell>

                                                            <CTableDataCell className='text-center'>
                                                                <span> { subject.Semester?.semesterName } </span>
                                                            </CTableDataCell>

                                                            <CTableDataCell className='text-center'>
                                                                <span style = {{ width: 100, display: 'inline-block' }}> { subject?.CourseUnit?.courseUnitName } </span>
                                                            </CTableDataCell>

                                                            <CTableDataCell className='text-center'>
                                                                <CButton size='sm' className='me-2 text-white' color='danger' onClick = { () => handleDelete( subject.subjectId ) }> Supprimer </CButton>
                                                                <CButton size='sm' className='text-white' color='warning' onClick = { () => handleUpdate( subject ) }> Modifier </CButton>
                                                            </CTableDataCell>

                                                        </CTableRow>
                                                    ))
                                                }
                                            </CTableBody>
                                        </CTable>
                                    </CCol>
                                </CRow>

                            </CCardBody>
                        </CCard>
                    </CCol>

                    <CCol md = { 4 }>
                        <CCard className='p-3'>

                            <CCardHeader>Unité d'enseignement </CCardHeader>

                            <CCardBody>

                                <CRow className='d-flex justify-content-center align-items-center mb-3'>
                                    <CCol md = { 8 } className='text-start'>
                                        <CFormInput placeholder='Recherche ...' />
                                    </CCol>
                                    <CCol md = { 2 } className='text-end'> <NewCourseUnit /> </CCol>
                                </CRow>

                                <CRow>
                                    {
                                        courseUnits.map(( courseUnit, key ) =>
                                            <CCol md = { 12 } key = { key } className='mb-3'>
                                                <CCard style={{ cursor: 'pointer'}}>
                                                    <CCardBody>
                                                        <CRow className='d-flex flex-row align-items-center justify-content-between'>
                                                            <CCol md = { 8 }> <span> { courseUnit?.courseUnitName } </span> </CCol>
                                                            <CCol md = { 4 } className='d-flex flex-row align-items-center justify-content-center'>
                                                                <Button className='me-2' type='primary' icon = { <FaEdit />} />
                                                                <Button type='primary' danger icon = { <MdDelete />} />
                                                            </CCol>
                                                        </CRow> 
                                                    </CCardBody>
                                                </CCard>
                                            </CCol>
                                        )
                                    }
                                </CRow>

                            </CCardBody>

                        </CCard>
                    </CCol>

                </CRow>
            </CContainer>
        </>
    )
}