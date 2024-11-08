import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer,
    CFormInput,
    CRow
} from '@coreui/react'
import useCustomContext from '../../../hooks/useCustomContext'
import { useEffect, useState } from 'react'
import NewPeriode from './NewPeriode'

export default function Periode(){

    const {
        getAcademicYears,
        academicYears
    } = useCustomContext()

    const [ currentYear, setCurrentYear ] = useState( null )
    const [ currentSemester, setCurrentSemester ] = useState( null )

    useEffect( () => {
        getAcademicYears()
    }, [])

    const clickYear = year => {
        if( currentYear?.academicYearId == year.academicYearId ){
            setCurrentYear( null )
            setCurrentSemester( null )
        }
        else setCurrentYear( year )
    }

    const clickSemester = semester => {
        if( currentSemester?.semesterId == semester.semesterId ) setCurrentSemester( null )
        else setCurrentSemester( semester )
    }

    return(
        <CContainer>
            <CRow className='d-flex justify-content-between'>

                <CCol md = { 9 }>
                    <CRow>
                        <CCol md = { 12 }>
                            <CCard className='p-3 mb-4'>

                                <CCardHeader> Semestre </CCardHeader>

                                <CCardBody>

                                    <CRow className='d-flex justify-content-between align-items-center'>
                                        <CCol md = { 12 } className='text-start'>
                                            <CFormInput placeholder='Recherche ...' />
                                        </CCol>
                                    </CRow>

                                    {
                                        currentYear &&
                                        <>
                                            {
                                                currentYear?.Periodes?.map(( periode, key) =>
                                                    <CRow key = { key } className='my-4'>
                                                        <CCol md = { 4 }>
                                                            <CCard> <CCardBody> <span> { periode.periodeName } </span> </CCardBody> </CCard>
                                                        </CCol>
                                                        {
                                                            periode?.Semesters?.map((semester, key) =>
                                                                <CCol md = { 1 } key={ key }>
                                                                    <CCard onClick = { () => clickSemester( semester ) } style = {{ cursor: 'pointer' }}>
                                                                        <CCardBody
                                                                            className = {
                                                                                currentSemester?.semesterId == semester.semesterId
                                                                                ? 'text-center bg-secondary text-white'
                                                                                : 'text-center text-secondary'
                                                                            }
                                                                        >
                                                                            <span className='text-nowrap'>  { semester.semesterName?.toUpperCase() }  </span>
                                                                        </CCardBody>
                                                                    </CCard>
                                                                </CCol>
                                                            )
                                                        }
                                                    </CRow>
                                                )
                                            }
                                        </>
                                    }

                                </CCardBody>

                            </CCard>
                        </CCol>
                        <CCol md = { 12 }>
                            <CCard>
                                <CCardHeader> Liste des examens </CCardHeader>
                            </CCard>
                        </CCol>
                    </CRow>
                </CCol>

                <CCol md = { 3 }>

                    <CCard className='p-3'>
                        <CCardHeader> Année universitaire </CCardHeader>
                        <CCardBody>
                            <CRow className='mb-3'>
                                <CCol md = { 8 } className='text-start'>
                                    <CFormInput placeholder='Recherche ...' />
                                </CCol>
                                <CCol md = { 2 } className='text-end'>
                                    <NewPeriode />
                                </CCol>
                            </CRow>
                            <CRow>
                                {
                                    academicYears
                                    .sort((a, b) => b.academicYearId - a.academicYearId )
                                    .map(( yearItem, key ) =>
                                        <CCol key={ key } md = { 12 } className='my-1' onClick = { () => clickYear(yearItem) }>
                                            <CCard style = {{ cursor: 'pointer' }}>
                                                <CCardBody
                                                    className = {
                                                        currentYear?.academicYearId == yearItem.academicYearId
                                                        ? 'text-center bg-secondary text-white'
                                                        : 'text-center text-secondary'
                                                    }
                                                >
                                                    <span> { `${ yearItem.year1 } - ${ yearItem.year2 } ` } </span>
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
    )
}