import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBadge,
  cilCalendar,
  cilGroup,
  cilInbox,
  cilNotes,
  cilPaperclip,
  cilSpeedometer,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [

  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/app/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />
  },

  {
    component: CNavTitle,
    name: 'Utilisateur',
  },
  {
    component: CNavItem,
    name: 'Utilisateurs',
    to: '/app/users',
    icon: <CIcon customClassName="nav-icon" icon = { cilGroup }  />,
  },
  
  {
    component: CNavTitle,
    name: 'Période',
  },
  {
    component: CNavItem,
    name: 'Période',
    to: '/app/periode',
    icon: <CIcon customClassName="nav-icon" icon = { cilCalendar }  />,
  },

  {
    component: CNavTitle,
    name: "Unité d'enseignement",
  },
  {
    component: CNavItem,
    name: 'Enseignant',
    to: '/app/professor',
    icon: <CIcon customClassName="nav-icon" icon = { cilBadge }  />,
  },
  {
    component: CNavItem,
    name: 'Matière',
    to: '/app/subject',
    icon: <CIcon customClassName="nav-icon" icon = { cilInbox }  />,
  },
  
  {
    component: CNavTitle,
    name: "Examen",
  },
  {
    component: CNavItem,
    name: 'Examen',
    to: '/app/exam',
    icon: <CIcon customClassName="nav-icon" icon = { cilPaperclip }  />,
  },
]

export default _nav
