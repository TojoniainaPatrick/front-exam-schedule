import { useState } from 'react'
import {
    CButton,
    CFormInput,
    CFormLabel,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle
} from '@coreui/react'
import useCustomContext from '../../../hooks/useCustomContext'
import axios from '../../../api/axios'
import Swal from 'sweetalert2'

export default function UpdateProfessor({ visible, setVisible }){

    const {
        getProfessors,
        currentProfessor,
        setCurrentProfessor
    } = useCustomContext()

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
      

    const handleUpdate = async _ => {
        await axios.put(`/professor/update/${currentProfessor.professorId}`, currentProfessor )
        .then( response => {

            getProfessors()

            Toast.fire({
                icon: "success",
                title: response.data.message
            });

            setVisible(false)
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
        <CModal
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="LiveDemoExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="LiveDemoExampleLabel"> Modification </CModalTitle>
            </CModalHeader>
            
            <CModalBody>

                <CFormLabel aria-required className='text-secondary'> Nom et prénoms </CFormLabel>
                <CFormInput
                    placeholder="Nom et prénoms"
                    className='mb-4'
                    onChange = { e => setCurrentProfessor({ ...currentProfessor, professorName: e.target.value })}
                    value = { currentProfessor.professorName }
                />

                <CFormLabel aria-required className='text-secondary'> Adresse e-mail </CFormLabel>
                <CFormInput
                    placeholder="Adresse e-mail"
                    className='mb-4'
                    value = { currentProfessor.professorEmail }
                    onChange = { e => setCurrentProfessor({ ...currentProfessor, professorEmail: e.target.value })}

                />

            </CModalBody>

            <CModalFooter>
                <CButton size = 'sm' color="secondary" onClick={() => setVisible(false)}> Annuler </CButton>
                <CButton size = 'sm' color="primary" onClick = { handleUpdate }>Modifier</CButton>
            </CModalFooter>

        </CModal>
    </>
    )
}