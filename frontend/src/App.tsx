import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import CommonLayout from "components/layouts/CommonLayout";
import Home from "components/pages/Home"
import ChatRooms from "components/pages/ChatRooms"
import ChatRoom from "components/pages/ChatRoom"
import Users from "components/pages/Users"
import SignUp from "components/pages/SignUp"
import NotFound from "components/pages/NotFound"

//Googleログインテスト
import socialAuth from "components/socialAuth/SocialAuth";
// import Callback from "components/pages/Callback";

import { getCurrentUser } from "lib/api/auth";
import {User} from "interfaces/index";
import SocialUserUpdate from "components/pages/SocialUserUpdate";

import { useLocation } from "react-router";
import { useHistory} from "react-router-dom";
import Cookies from "js-cookie";


export const AuthContext = createContext({} as {
  loading: boolean
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: User | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
})

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | undefined>()

  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser()
      console.log(res)
    
      if (res?.status === 200) {
        setIsSignedIn(true)
        setCurrentUser(res?.data.data)
      } else {
        console.log("No current user")
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    handleGetCurrentUser()
  }, [setCurrentUser])

  //ユーザーが未承認済みかどうかでルーティングを決定
  //未承認だった場合は「/social」(ソーシャルログイン)ページに促す
  const Private = ({children}: {children: React.ReactElement}) => {
    const history = useHistory()
    const location =useLocation()

    useEffect(() => {
      if(location.search) {
        const param = location.search
        const urlParams = new URLSearchParams(param)
        const auth_token = urlParams.getAll('auth_token')
        const client_id = urlParams.getAll('client_id')
        const uid = urlParams.getAll('uid')

        Cookies.set("_access_token", auth_token)
        Cookies.set("_client", client_id)
        Cookies.set("_uid", uid)

        history.push("/home")
      }
    }, [setIsSignedIn])
    if(!loading) {
      if(isSignedIn) {
        return children
      } else {
        return <Redirect to="/social" />
      }
    } else {
      return <></>
    }
  }

  return (
    <Router>
      <AuthContext.Provider value={{loading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser}}>
        <CommonLayout>
          <Switch>
            <Route exact path="/signup" component={SignUp} />
            {/* 使用しないためコメントアウト */}
            {/* <Route exact path="/signin" component={SignIn} /> */}
            <Route exact path="/social" component={socialAuth} />
            {/* <Route exact path="/callback" component={Callback} /> */}
            <Route exact path="/social-user-update" component={SocialUserUpdate} />
            <Private>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/home" component={Home} />
                <Route exact path="/users" component={Users} />
                <Route exact path="/chat_rooms" component={ChatRooms} />
                <Route exact path="/chatroom/:id" component={ChatRoom} />
                <Route component={NotFound} />
              </Switch>
            </Private>
          </Switch>
        </CommonLayout>
      </AuthContext.Provider>
    </Router>
  )
}

export default App