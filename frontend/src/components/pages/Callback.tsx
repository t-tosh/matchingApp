import React, {useEffect, useContext}  from "react";
import { useLocation } from "react-router";
import { useHistory} from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "App";
import { socialLogin } from "lib/api/auth"


  
const Callback: React.FC = () => {
  const history = useHistory()

  const {setIsSignedIn, setCurrentUser} = useContext(AuthContext)

  const location =useLocation()
  const param = location.search
  const urlParams = new URLSearchParams(param)
  const auth_token = urlParams.getAll('auth_token')
  const client_id = urlParams.getAll('client_id')
  const uid = urlParams.getAll('uid')

  Cookies.set("_access_token", auth_token)
  Cookies.set("_client", client_id)
  Cookies.set("_uid", uid)

  const data = async () => {
    try {
      const res = await socialLogin()
      console.log(res.data.data)
  
      if(res.status === 200) {
        setIsSignedIn(true)
        setCurrentUser(res.data.data)

        history.push("/social-user-update")

        console.log("Signed in successfully!")
      }
    } catch(err) {
      console.log(err)
    }
  } 

  useEffect(() => {
   data()
  }, [])

  return (
    <>
      <h1>コールバックテスト</h1>
      <ul>  
        <li>パラメータ：{param}</li>
        <li>アクセストークン：{auth_token}</li>
        <li>クライアントID：{client_id}</li>
        <li>UID：{uid}</li>
      </ul>
    </>
  )
}

export default Callback