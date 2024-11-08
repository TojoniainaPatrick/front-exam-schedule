import React from 'react'
import User from './views/pages/user/User'
import Subject from './views/pages/subject/Subject'
import Periode from './views/pages/periode/Periode'
import Professor from './views/pages/Professor/Professor'
import Exam from './views/pages/exam/Exam'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/app/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/app/users', name: 'Utilisateur', element: User },
  { path: '/app/subject', name: 'Matière', element: Subject },
  { path: '/app/periode', name: 'Période', element: Periode },
  { path: '/app/professor', name: 'Enseignant', element: Professor },
  { path: '/app/exam', name: 'Examen', element: Exam }
]

export default routes
