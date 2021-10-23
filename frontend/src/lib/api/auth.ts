import client from "lib/api/client"
import Cookies from "js-cookie"

import { SignUpFormData, SignInData } from "interfaces/index"

// サインアップ（新規アカウント作成）
export const signUp = (data: SignUpFormData) => {
  return client.post("auth", data)
}

// サインイン（ログイン）
export const signIn = (data: SignInData)  => {
  return client.post("auth/sign_in", data)
}

// サインアウト（ログアウト）
export const signOut = () => {
  return client.delete("auth/sign_out", { headers: {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid")
  }})  
}

// 認証済みのユーザーを取得
export const getCurrentUser = () => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return
  return client.get("auth/users/currentuser", { headers: {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid")
  }})
}

//ソーシャルログイン
export const googleLogin = async () => {
  await fetch("http://localhost:3001/api/v1/auth/google_oauth2")
  .then(res => console.log(res))
}

export const githubLogin = () => {
  return client.get("auth/github")
}

export const socialLogin = () => {
  return client.get('/auth/validate_token', {headers: {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid")
  }})
}