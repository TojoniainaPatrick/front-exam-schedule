import {
    cilPeople
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
    CContainer,
    CRow,
    CCol,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CTableBody,
    CAvatar,
    CFormInput,
    CButton
} from '@coreui/react'
import { useEffect, useState } from 'react'
import useCustomContext from '../../../hooks/useCustomContext'
import Swal from 'sweetalert2'
import axios from '../../../api/axios'
import NewProfessor from './NewProfessor'
import UpdateProfessor from './UpdateProfessor'

export default function Professor(){

    const {
        getProfessors,
        professors,
        setCurrentProfessor
    } = useCustomContext()

    useEffect( () => {
        getProfessors()
    }, [])

    const [ search, setSearch ] = useState('')
    const [ visibleUpdate, setVisibleUpdate ] = useState( false )

    const searchedData = professors.filter( professor =>
        professor.professorName?.toString().toLowerCase().includes(search.toString().toLowerCase()) ||
        professor.professorEmail?.toString().toLowerCase().includes(search.toString().toLowerCase())
    )

    const handleDelete = async professorId => {
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
                await axios.delete(`/professor/delete/${professorId}`)
                .then( response => {
                    Swal.fire({
                        title: "Enseignant",
                        text: response.data?.message,
                        icon: "success"
                    });
                    getProfessors()
                })
                .catch( error => {
                    if( error?.response?.data?.message ){
                        Swal.fire({
                            title: "Enseignant",
                            text: error?.response?.data?.message,
                            icon: "error"
                        });
                    }
                    else{
                        Swal.fire({
                            title: "Enseignant",
                            text: error.message,
                            icon: "error"
                        });
                    }
                })
            }
        });
    }

    const handleUpdate = professor => {
        setCurrentProfessor( professor )
        setVisibleUpdate( true )
    }

    return(
        <>
            <UpdateProfessor visible = { visibleUpdate } setVisible = { setVisibleUpdate } />
            <CContainer>
                <CRow className='d-flex flex-row align-items-center justify-content-between mb-3'>
                    <CCol md = { 3 }>
                        <CFormInput
                            placeholder='Recherche ...'
                            onChange = { e => setSearch( e.target.value ) }
                        />
                    </CCol>
                    <CCol md = { 1 } className=''>
                        <NewProfessor />
                    </CCol>
                </CRow> 
                <CRow>
                    <CCol xs>
                        <CTable align="middle" className="mb-0 border" hover responsive>

                            <CTableHead className="text-nowrap">

                                <CTableRow>

                                    <CTableHeaderCell className="bg-body-tertiary text-center width-100">
                                        <CIcon icon={cilPeople} />
                                    </CTableHeaderCell>

                                    <CTableHeaderCell className="bg-body-tertiary text-center width-100">Nom et prénoms </CTableHeaderCell>

                                    <CTableHeaderCell className="bg-body-tertiary text-center"> Adresse e-mail </CTableHeaderCell>

                                    <CTableHeaderCell className="bg-body-tertiary text-center"> Action </CTableHeaderCell>

                                </CTableRow>

                            </CTableHead>

                            <CTableBody>

                                {
                                    searchedData.map((professor, index) => (
                                        <CTableRow v-for="professor in tableItems" key={index}>

                                            <CTableDataCell className="text-center">
                                                <CAvatar size="md" src={professor.imageUrl} />
                                            </CTableDataCell>

                                            <CTableDataCell className='text-center'>
                                                <span> { professor.professorName } </span>
                                            </CTableDataCell>

                                            <CTableDataCell className='text-center'>
                                                <span> { professor.professorEmail } </span>
                                            </CTableDataCell>

                                            <CTableDataCell className='text-center'>
                                                <CButton size='sm' className='me-2 text-white' color='danger' onClick = { () => handleDelete( professor.professorId ) }> Supprimer </CButton>
                                                <CButton size='sm' className='text-white' color='warning' onClick = { () => handleUpdate( professor ) }> Modifier </CButton>
                                            </CTableDataCell>

                                        </CTableRow>
                                    ))
                                }
                            </CTableBody>
                        </CTable>
                    </CCol>
                </CRow>
            </CContainer>
        </>
    )
}