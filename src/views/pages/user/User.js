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
import NewUser from './NewUser'
import axios from '../../../api/axios'

export default function User(){

    const {
        getUsers,
        users
    } = useCustomContext()

    useEffect( () => {
        getUsers()
    }, [])

    const [ search, setSearch ] = useState('')

    const searchedData = users.filter( user =>
        user.userName?.toString()?.toLowerCase().includes(search.toString().toLowerCase()) ||
        user.userEmail?.toString()?.toLowerCase().includes(search.toString().toLowerCase()) ||
        user.userRole?.toString()?.toLowerCase().includes(search.toString().toLowerCase()) ||
        user.userStatus?.toString()?.toLowerCase().includes(search.toString().toLowerCase())
    )

    const handleDisable = async userId => {
        Swal.fire({
            title: "Utilisateur",
            text: "Voulez-vous continuer?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Continuer",
            cancelButtonText: 'Annuler'
        }).then(async result => {
            if (result.isConfirmed) {
                await axios.put(`/user/update/${userId}`, { userStatus: 'disabled' })
                .then( response => {
                    Swal.fire({
                        title: "Utilisateur",
                        text: response.data?.message,
                        icon: "success"
                    });
                    getUsers()
                })
                .catch( error => {
                    if( error?.response?.data?.message ){
                        Swal.fire({
                            title: "Utilisateur",
                            text: error?.response?.data?.message,
                            icon: "error"
                        });
                    }
                    else{
                        Swal.fire({
                            title: "Utilisateur",
                            text: error.message,
                            icon: "error"
                        });
                    }
                })
            }
        });
    }
    const handleDelete = async userId => {
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
                await axios.delete(`/user/delete/${userId}`)
                .then( response => {
                    Swal.fire({
                        title: "Utilisateur",
                        text: response.data?.message,
                        icon: "success"
                    });
                    getUsers()
                })
                .catch( error => {
                    if( error?.response?.data?.message ){
                        Swal.fire({
                            title: "Utilisateur",
                            text: error?.response?.data?.message,
                            icon: "error"
                        });
                    }
                    else{
                        Swal.fire({
                            title: "Utilisateur",
                            text: error.message,
                            icon: "error"
                        });
                    }
                })
            }
        });
    }

    return(
        <CContainer>
            <CRow className='d-flex flex-row align-items-center justify-content-between mb-3'>
                <CCol md = { 3 }>
                    <CFormInput
                        placeholder='Recherche ...'
                        onChange = { e => setSearch( e.target.value ) }
                    />
                </CCol>
                <CCol md = { 1 } className=''>
                    <NewUser />
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

                                <CTableHeaderCell className="bg-body-tertiary text-center width-100">Nom d'utilisateur</CTableHeaderCell>

                                <CTableHeaderCell className="bg-body-tertiary text-center"> Adresse e-mail </CTableHeaderCell>

                                <CTableHeaderCell className="bg-body-tertiary text-center">Rôle</CTableHeaderCell>

                                <CTableHeaderCell className="bg-body-tertiary text-center"> Statut </CTableHeaderCell>

                                <CTableHeaderCell className="bg-body-tertiary text-center"> Action </CTableHeaderCell>

                            </CTableRow>

                        </CTableHead>

                        <CTableBody>

                            {
                                searchedData.map((user, index) => (
                                    <CTableRow v-for="user in tableItems" key={index}>

                                        <CTableDataCell className="text-center">
                                            <CAvatar size="md" src={user.userImageUrl} />
                                        </CTableDataCell>

                                        <CTableDataCell className='text-center'>
                                            <span> { user.userName } </span>
                                        </CTableDataCell>

                                        <CTableDataCell className='text-center'>
                                            <span> { user.userEmail } </span>
                                        </CTableDataCell>

                                        <CTableDataCell className='text-center'>
                                            <span> { user.userRole } </span>
                                        </CTableDataCell>

                                        <CTableDataCell className='text-center'>
                                            <span> { user.userStatus } </span>
                                        </CTableDataCell>

                                        <CTableDataCell className='text-center'>
                                            <CButton size='sm' className='me-2 text-white' color='danger' onClick = { () => handleDelete( user.userId ) }> Supprimer </CButton>
                                            <CButton size='sm' className='text-white' color='warning' onClick = { () => handleDisable( user.userId ) }> Desactiver </CButton>
                                        </CTableDataCell>

                                    </CTableRow>
                                ))
                            }
                        </CTableBody>
                    </CTable>
                </CCol>
            </CRow>
        </CContainer>
    )
}