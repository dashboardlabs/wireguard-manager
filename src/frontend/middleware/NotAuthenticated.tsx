//eslint-disable-next-line
const globalAny: any = global

import React, { ReactElement } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

const NotAuthenticated = ({ children }: { children: ReactElement | ReactElement[] }): ReactElement => {
  const router = useRouter()
  const accesstoken = Cookies.get('accessToken')

  React.useEffect(() => {
    if (accesstoken) {
      globalAny.setNotification('success', 'Welcome Back!')
      router.push('/')
    }
  }, [accesstoken])

  return (
    <>
      {React.Children.map(children, (child) => {
        return child
      })}
    </>
  )
}

export default NotAuthenticated
