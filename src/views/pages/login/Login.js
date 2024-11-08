import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import logo from '../../../assets/brand/eni.png'
import Swal from 'sweetalert2'
import axios from '../../../api/axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [ user, setUser ] = useState({
    userEmail: '',
    userPassword: ''
  })

  const navigate = useNavigate()
  
  const handleLogin = async _ => {
    if( !user.userEmail ){
      Swal.fire({
        icon: 'warning',
        title: 'Authentification',
        text: 'Merci de bien vouloir saisir votre adresse e-mail'
      })
    }
    else if( !user.userPassword ){
      Swal.fire({
        icon: 'warning',
        title: 'Authentification',
        text: 'Merci de bien vouloir saisir votre mot de passe'
      })
    }
    else{
      await axios.post('/user/authenticate', user)
      .then( response => {
        navigate('/app/dashboard')

        let userFullData = response?.data?.data
        let userDataWithoutPass = Object.entries(userFullData).reduce((accumulateur, [key, value]) => {
          if( key != 'userPassword' ) accumulateur[key] = value
          return accumulateur
        }, {})

        localStorage.setItem('user', JSON.stringify(userDataWithoutPass))
      })
      .catch( error => {
        if( error?.response?.data?.message ){
          Swal.fire({
            icon: 'warning',
            title: 'Authentification',
            text: error?.response?.data?.message
          })
        }
        else{
          Swal.fire({
            icon: 'warning',
            title: 'Authentification',
            text: error?.message
          })
        }
        console.log( error )
      })}
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={ 4 }>
              <CCard className="p-4">
                <CCardBody className='text-center'>

                  <CImage src = { logo } width = { 100 } className='mb-4'/>

                  <CForm>

                    <h3 className='text-center mb-4'>Authentification</h3>

                    <CInputGroup className="my-4">

                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>

                      <CFormInput
                        placeholder="Adresse e-mail"
                        autoComplete="userEmail"
                        value = { user.userEmail }
                        onChange = { e => setUser({ ...user, userEmail: e.target.value }) }
                      />

                    </CInputGroup>

                    <CInputGroup className="my-4">

                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>

                      <CFormInput
                        type="password"
                        placeholder="Mot de passe"
                        autoComplete="current-password"
                        value = { user.userPassword }
                        onChange = { e => setUser({ ...user, userPassword: e.target.value }) }
                      />

                    </CInputGroup>

                    <CRow>
                      <CCol className='d-grid'>
                        <CButton size = 'sm' color="primary" className="px-4 mt-2" onClick = { handleLogin }>
                          Se connecter
                        </CButton>
                      </CCol>
                    </CRow>

                  </CForm>
                </CCardBody>
              </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
