import { useState } from 'react'
import {
    CButton,
    CFormLabel
} from '@coreui/react'
import useCustomContext from '../../../hooks/useCustomContext'
import axios from '../../../api/axios'
import Swal from 'sweetalert2'
import { DatePicker, Modal} from 'antd'

export default function NewPeriode(){

    const {
        getAcademicYears,
        getSemesters
    } = useCustomContext()

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [ year, setYear ] = useState({
        year1: '',
        year2: ''
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
        await axios.post('/year/add', year )
        .then( response => {

            getAcademicYears()

            Toast.fire({
                icon: "success",
                title: response.data.message
            });

            setIsModalOpen(false)

            setYear({
                year1: '',
                year2: ''
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
            <CButton color="primary" size='sm' onClick={showModal}> Ajouter </CButton>

            <Modal
                title="Nouvelle année universitaire"
                open={isModalOpen}
                onOk={handleAdd}
                onCancel={handleCancel}
                centered
            >
                
                <CFormLabel aria-required className='text-secondary'> Année 1 </CFormLabel>
                <DatePicker
                    style = {{ width: '100%', marginBottom: 20, height: 50, zIndex: 1100 }}
                    picker='year'
                    onChange = { value => setYear({...year, year1: value.year() }) }
                />

                <CFormLabel aria-required className='text-secondary'> Année 2 </CFormLabel>
                <DatePicker
                    style = {{ width: '100%', marginBottom: 20, height: 50 }}
                    picker='year'
                    onChange = { value => setYear({...year, year2: value.year() }) }
                />
            </Modal>
        </>
    )
}