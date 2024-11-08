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

export default function NewProfessor(){

    const {
        getProfessors
    } = useCustomContext()

    const [visible, setVisible] = useState(false)

    const [ professor, setProfessor ] = useState({
        professorName: '',
        professorEmail: '',
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
        await axios.post('/professor/add', professor )
        .then( response => {

            getProfessors()

            Toast.fire({
                icon: "success",
                title: response.data.message
            });

            setVisible(false)

            setProfessor({
                professorName: '',
                professorEmail: '',
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
                <CModalTitle id="LiveDemoExampleLabel"> Nouvel enseignant </CModalTitle>
            </CModalHeader>
            
            <CModalBody>

                <CFormLabel aria-required className='text-secondary'> Nom et prénoms </CFormLabel>
                <CFormInput
                    placeholder="Nom et prénoms"
                    className='mb-4'
                    value = { professor.userName }
                    onChange = { e => setProfessor({ ...professor, professorName: e.target.value })}
                />

                <CFormLabel aria-required className='text-secondary'> Adresse e-mail </CFormLabel>
                <CFormInput
                    placeholder="Adresse e-mail"
                    className='mb-4'
                    value = { professor.userEmail }
                    onChange = { e => setProfessor({ ...professor, professorEmail: e.target.value })}
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