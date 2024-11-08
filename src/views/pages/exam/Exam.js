
import {
    CContainer,
    CRow,
    CCol,
    CFormInput,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CBadge,
    CFormLabel
} from '@coreui/react'
import { useEffect, useState } from 'react'
import useCustomContext from '../../../hooks/useCustomContext'
import Swal from 'sweetalert2'
import axios from '../../../api/axios'
import NewExam from './NewExam'
import dayjs from 'dayjs'
import CIcon from '@coreui/icons-react'
import { cilOptions } from '@coreui/icons'
import UpdateExam from './UpdateExam'
import { Badge, Modal, Select } from 'antd'

export default function Exam(){

    const {
        getProfessors,
        exams,
        getExams,
        setCurrentExam
    } = useCustomContext()

    useEffect( () => {
        getProfessors()
        getExams()
    }, [])

    const [ search, setSearch ] = useState('')
    const [ visibleUpdate, setVisibleUpdate ] = useState( false )

    // const searchedData = professors.filter( professor =>
    //     professor.professorName?.toString().toLowerCase().includes(search.toString().toLowerCase()) ||
    //     professor.professorEmail?.toString().toLowerCase().includes(search.toString().toLowerCase())
    // )

    const handleDelete = async examId => {
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
                await axios.delete(`/exam/delete/${examId}`)
                .then( response => {
                    Swal.fire({
                        title: "Examen",
                        text: response.data?.message,
                        icon: "success"
                    });
                    getExams()
                })
                .catch( error => {
                    if( error?.response?.data?.message ){
                        Swal.fire({
                            title: "Examen",
                            text: error?.response?.data?.message,
                            icon: "error"
                        });
                    }
                    else{
                        Swal.fire({
                            title: "Examen",
                            text: error.message,
                            icon: "error"
                        });
                    }
                })
            }
        });
    }

    const handleUpdate = exam => {
        setCurrentExam( exam )
        setVisibleUpdate( true )
    }

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
    })

    const handleCollectPaper = async examId => {
        await axios.put(`/exam/update/${ examId }`, { paperCollectionDate: new Date() } )
        .then( response => {

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
    }

    const [ unSealed, setUnsealed ] = useState( null )
    const [ show, setShow ] = useState( false )
    const [ exam, setExam ] = useState(null)

    const handleOpenReturnPaper = exam => {
        setExam( exam )
        setShow( true )
    }

    const closeModal = () => {
        setShow( false )
        setUnsealed( null )
        setExam( null )
    }

    const handleReturnPaper = async _ => {
        await axios.put(`/exam/update/${ exam.examId }`, { paperReturnDate: new Date(), unSealed } )
        .then( response => {

            getExams()
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
    }

    const handlePublish = async examId => {
        await axios.put(`/exam/update/${ examId }`, { publishingDate: new Date(), published: true } )
        .then( response => {

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
    }
    
    return(
        <>
            <Modal
                title = "Modification"
                open = { show }
                onOk = { handleReturnPaper }
                onCancel = { closeModal }
                centered
                zIndex = { 1050 }
            >

                <CFormLabel aria-required className='text-secondary'> Feuilles de copie dépouillées ? </CFormLabel>
                <Select
                    style = {{
                        width: '100%',
                        marginBottom: 20,
                        height: 50
                    }}
                    showSearch
                    placeholder = "Feuilles de copie dépouillées ?"
                    onChange = { value => setUnsealed( value )}
                    options = {[
                        { label: 'Oui', value: true },
                        { label: 'Non', value: false }
                    ]}
                />

            </Modal>

            <UpdateExam visible = { visibleUpdate } setVisible = { setVisibleUpdate } />
            <CContainer>
                <CRow className='d-flex flex-row align-items-center justify-content-between mb-3'>
                    <CCol md = { 3 }>
                        <CFormInput
                            placeholder='Recherche ...'
                            onChange = { e => setSearch( e.target.value ) }
                        />
                    </CCol>
                    <CCol md = { 1 } className=''>
                        <NewExam />
                    </CCol>
                </CRow> 
                <CRow>
                    {
                        exams.map(( exam, key ) =>
                            <CCol key = { key } md = { 3 }>
                                <CCard>
                                    <CCardHeader className='d-flex align-items-center justify-content-between'>
                                        { exam?.Subject?.subjectName }

                                        <CDropdown alignment="end">
                                            <CDropdownToggle color="transparent" caret={false} className="text-secondary p-0">
                                                <CIcon icon={cilOptions} />
                                            </CDropdownToggle>
                                            <CDropdownMenu>
                                                <CDropdownItem onClick={() => handleDelete( exam.examId )} style = {{ cursor: 'pointer' }}>
                                                    Supprimer
                                                </CDropdownItem>
                                                <CDropdownItem style = {{ cursor: 'pointer' }} onClick = { () => handleUpdate( exam ) }>
                                                    Modifier
                                                </CDropdownItem>

                                                {
                                                    !exam.paperCollectionDate &&
                                                    <CDropdownItem style = {{ cursor: 'pointer' }} onClick = { () => handleCollectPaper( exam.examId ) }>
                                                        Feuilles de copie récupérées
                                                    </CDropdownItem>
                                                }

                                                {
                                                    !exam.paperReturnDate &&
                                                    <CDropdownItem style = {{ cursor: 'pointer' }} onClick = { () => handleOpenReturnPaper( exam ) }>
                                                        Feuilles de copie remises
                                                    </CDropdownItem>
                                                }

                                                {
                                                    !exam.published &&
                                                    <CDropdownItem style = {{ cursor: 'pointer' }} onClick = { () => handlePublish( exam.examId ) }>
                                                        Résultat affiché
                                                    </CDropdownItem>
                                                }

                                                <CDropdownItem style = {{ cursor: 'pointer' }}>Signaler l'enseignant</CDropdownItem>
                                            </CDropdownMenu>
                                        </CDropdown>

                                    </CCardHeader>
                                    <CCardBody>
                                        <CRow>

                                            <CCol md = { 6 } className='text-center my-1 p-0'>
                                                <span> De   <CBadge color='primary'> { exam.examStartTime } </CBadge> </span>
                                            </CCol>

                                            <CCol md = { 5 } className='text-center my-1 p-0'>
                                                <span> à   <CBadge color='success'> { exam.examFinishTime } </CBadge> </span>
                                            </CCol>

                                            <CCol md = { 6 } className='text-center my-1 p-0'>
                                                <CBadge color='secondary'> { exam.examType } </CBadge>
                                            </CCol>

                                            <CCol md = { 5 } className='text-center my-1 p-0' >
                                                <CBadge color = { exam.examSession?.toString().toLowerCase() == 'normale' ? 'primary' : 'danger' }> Session { exam.examSession } </CBadge>
                                            </CCol>

                                            <CCol md = { 12 } className='text-center my-3 p-0' >
                                                {
                                                    exam.paperCollectionDate &&
                                                    <>
                                                        <span> Récupération des feuilles de copie &nbsp;</span>
                                                        <CBadge color = 'secondary'>
                                                            {
                                                                new Intl.DateTimeFormat( 'fr-FR', { dateStyle: 'long' })
                                                                .format(new Date(dayjs(exam.paperCollectionDate).format('YYYY-MM-DD')))
                                                            }
                                                        </CBadge>
                                                    </>
                                                }
                                            </CCol>

                                            <CCol md = { 12 } className='text-center my-3 p-0' >
                                                {
                                                    exam.paperReturnDate &&
                                                    <>
                                                        <span> Remise des feuilles de copie &nbsp;</span>
                                                        <CBadge color = 'secondary'>
                                                            {
                                                                new Intl.DateTimeFormat( 'fr-FR', { dateStyle: 'long' })
                                                                .format(new Date(dayjs(exam.paperReturnDate).format('YYYY-MM-DD')))
                                                            }
                                                        </CBadge>
                                                    </>
                                                }
                                            </CCol>

                                            {
                                                exam.publishingDate &&
                                                <CCol md = { 12 } className='text-center my-1 p-0' >
                                                    <CBadge color = 'primary' className='me-3'> Affiché </CBadge>
                                                    <CBadge color = 'secondary'>
                                                        {
                                                            new Intl.DateTimeFormat( 'fr-FR', { dateStyle: 'long' })
                                                            .format(new Date(dayjs(exam.publishingDate).format('YYYY-MM-DD')))
                                                        }
                                                    </CBadge>
                                                </CCol>
                                            }

                                            {
                                                exam.unSealed != null &&
                                                <CCol md = { 12 } className='text-center my-1 p-0' >
                                                    <CBadge color = { exam.unSealed ? "success" : "danger"}>
                                                        { exam.unSealed == false  ? "Non dépouillée" : "dépouillée"}
                                                    </CBadge>
                                                </CCol>
                                            }

                                        </CRow>
                                    </CCardBody>

                                    <CCardFooter>
                                        { new Intl.DateTimeFormat( 'fr-FR', { dateStyle: 'long' }).format(new Date(dayjs(exam.examDate).format("YYYY-MM-DD"))) }
                                    </CCardFooter>
                                </CCard>
                            </CCol>
                        )
                    }
                </CRow>
            </CContainer>
        </>
    )
}