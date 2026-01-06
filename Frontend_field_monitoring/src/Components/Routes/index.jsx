import { Routes, Route } from 'react-router-dom'
import CreateUser from '../../Pages/User_management/CreateUser'
import CreatePassword from '../../Pages/Auth/createPassword'
import Login from '../../Pages/Auth/login'

export default function Index() {
  return (
    <Routes>
        <Route path='/' Component={Login}/>
        <Route path='/create-user' Component={CreateUser}/>
        {/* <Route path='/create-password' Component={CreatePassword}/> */}
        <Route
        path="/create-password"
        element={
          <CreatePassword
            mode="create"
            title="Create New Password"
            description="Please create a new password to continue"
          />
        }
      />

      <Route
        path="/forgot-password"
        element={
          <CreatePassword
            mode="reset"
            title="Reset Password"
            description="Enter a new password for your account"
          />
        }
      />
    </Routes>
  )
}
