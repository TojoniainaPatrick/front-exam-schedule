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

export default function NewCourseUnit(){

    const {
        getCourseUnits
    } = useCustomContext()

    const [visible, setVisible] = useState(false)

    const [ courseUnit, setCourseUnit ] = useState({
        courseUnitName: '',
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
        await axios.post('/course-unit/add', courseUnit )
        .then( response => {

            getCourseUnits()

            Toast.fire({
                icon: "success",
                title: response.data.message
            });

            setVisible(false)

            setCourseUnit({
                courseUnitName: ''
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
                <CModalTitle id="LiveDemoExampleLabel"> Nouvelle unité d'enseignement </CModalTitle>
            </CModalHeader>
            
            <CModalBody>

                <CFormLabel aria-required className='text-secondary'> Désignation </CFormLabel>
                <CFormInput
                    placeholder="Désignation"
                    className='mb-4'
                    value = { courseUnit.courseUnitName }
                    onChange = { e => setCourseUnit({ ...courseUnit, courseUnitName: e.target.value })}
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