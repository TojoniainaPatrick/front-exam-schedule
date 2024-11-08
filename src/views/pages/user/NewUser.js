import { useState } from 'react'
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

export default function NewUser(){

    const {
        getUsers
    } = useCustomContext()

    const [visible, setVisible] = useState(false)

    const [ user, setUser ] = useState({
        userName: '',
        userEmail: '',
        userPassword: '',
        userRole: ''
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
      

    const handleAdd = async _ => {
        await axios.post('/user/add', user )
        .then( response => {

            getUsers()

            Toast.fire({
                icon: "success",
                title: response.data.message
            });

            setVisible(false)

            setUser({
                userName: '',
                userEmail: '',
                userPassword: '',
                userRole: ''
            })
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

    return (
    <>
        <CButton color="primary" size = 'sm' onClick={() => setVisible(!visible)}>Ajouter</CButton>

        <CModal
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="LiveDemoExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="LiveDemoExampleLabel"> Nouvel utilisateur </CModalTitle>
            </CModalHeader>
            
            <CModalBody>

                <CFormLabel aria-required className='text-secondary'> Nom d'utilisateur </CFormLabel>
                <CFormInput
                    placeholder="Nom d'utilisateur"
                    className='mb-4'
                    value = { user.userName }
                    onChange = { e => setUser({ ...user, userName: e.target.value })}
                />

                <CFormLabel aria-required className='text-secondary'> Adresse e-mail </CFormLabel>
                <CFormInput
                    placeholder="Adresse e-mail"
                    className='mb-4'
                    value = { user.userEmail }
                    onChange = { e => setUser({ ...user, userEmail: e.target.value })}
                />

                <CFormLabel aria-required className='text-secondary'> Rôle </CFormLabel>
                <CFormSelect
                    className='mb-4'
                    value = { user.userRole }
                    onChange = { e => setUser({ ...user, userRole: e.target.value })}
                >
                    <option>Choisissez un rôle</option>
                    <option value = 'rm'>Responsable de mention</option>
                    <option value = 'cs'>Scolarité</option>
                </CFormSelect>

                <CFormLabel aria-required className='text-secondary'> Mot de passe </CFormLabel>
                <CFormInput
                    placeholder="Mot de passe"
                    type='password'
                    className='mb-4'
                    value = { user.userPassword }
                    onChange = { e => setUser({ ...user, userPassword: e.target.value })}
                />

            </CModalBody>

            <CModalFooter>
                <CButton size = 'sm' color="secondary" onClick={() => setVisible(false)}> Annuler </CButton>
                <CButton size = 'sm' color="primary" onClick = { handleAdd }>Ajouter</CButton>
            </CModalFooter>

        </CModal>
    </>
    )
}