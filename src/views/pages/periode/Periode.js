import {
    CBadge,
    CButton,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CContainer,
    CFormInput,
    CRow
} from '@coreui/react'
import useCustomContext from '../../../hooks/useCustomContext'
import { useEffect, useState } from 'react'
import NewPeriode from './NewPeriode'
import dayjs from 'dayjs'
import axios from '../../../api/axios'

export default function Periode(){

    const {
        getAcademicYears,
        academicYears,
        getExams,
        exams
    } = useCustomContext()

    const [ currentYear, setCurrentYear ] = useState( null )
    const [ currentSemester, setCurrentSemester ] = useState( null )
    const [ search, setSearch ] = useState('')

    const getCurrentYear = async _ => {
        await axios('year/current')
        .then( res => setCurrentYear(res.data.data))
        .catch( error => console.log( error))
    }

    useEffect( () => {
        getAcademicYears()
        getCurrentYear()
        getExams()
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

    const filteredExams = currentSemester
    ? exams.filter( exam => exam.Subject?.Semester?.semesterId == currentSemester?.semesterId )
    : exams

    const searchedExams = filteredExams.filter( exam =>
        exam.Subject?.subjectName?.toString().toLowerCase().includes(search.toString().toLowerCase()) ||
        exam.examType.toString().toLowerCase().includes(search.toString().toLowerCase()) ||
        exam.examSession.toString().toLowerCase().includes(search.toString().toLowerCase())
    )

    return(
        <CContainer>
            <CRow className='d-flex justify-content-between'>

                <CCol md = { 9 }>
                    <CRow>
                        <CCol md = { 12 }>
                            <CCard className='p-3 mb-4'>

                                <CCardHeader> Semestre </CCardHeader>

                                <CCardBody>
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

                                <CCardBody>
                                    <CRow className='d-flex justify-content-between align-items-center my-3'>
                                        <CCol md = { 12 } className='text-start'>
                                            <CFormInput
                                                placeholder='Recherche ...'
                                                onChange = { e => setSearch( e.target.value ) }
                                            />
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        {
                                            searchedExams.map(( exam, key ) =>
                                                <CCol key = { key } md = { 4 }>
                                                    <CCard>

                                                        <CCardHeader className='d-flex align-items-center justify-content-between'>
                                                            { exam?.Subject?.subjectName }
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
                                </CCardBody>
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
                                    <NewPeriode getCurrentYear = { getCurrentYear} />
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