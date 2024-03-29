import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { SiteFooter, SiteHeader } from '../components'

function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <h1>Home</h1>
        <p>Welcome to Slumo</p>
        <p>
          Create a free account. <Link to="/register" children="Register" />
        </p>
        <p>
          Already a user? <Link to="/login" children="Login" />
        </p>
        <p>
          Dashboard <Link to="/dashboard" children="dashboard" />
        </p>
      </main>
      <SiteFooter />
    </>
  )
}

export default withRouter(Home)
