import React, {useContext, useEffect, useState, useCallback } from "react";
import {useHistory} from "react-router-dom"
import "date-fns"
import DateFnsUtils from "@date-io/date-fns"

import Cookies from "js-cookie"

import { makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, Typography } from "@material-ui/core"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"
import IconButton from "@material-ui/core/IconButton"
import SettingsIcon from "@material-ui/icons/Settings"
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers"

import TextField from "@material-ui/core/TextField"

import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"

import PhotoCamera from "@material-ui/icons/PhotoCamera"
import Box from "@material-ui/core/Box"
import CancelIcon from "@material-ui/icons/Cancel"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import Button from "@material-ui/core/Button"

import Avatar from "@material-ui/core/Avatar"
import Divider from "@material-ui/core/Divider"

import { AuthContext } from "App";
import { prefectures } from "data/prefectures";
import { genders } from "data/geders";


import { signOut } from "lib/api/auth";
import {getUser, updateUser} from "lib/api/users"
import { UpdateUserFormData } from "interfaces/index";


const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  },
  header: {
    textAlign: "center"
  },
  card: {
    width: 340
  },
  imageUploadBtn: {
    textAlign: "right"
  },
  input: {
    display: "none"
  },
  box: {
    marginBottom: "1.5rem"
  },
  preview: {
    width: "100%"
  }
}))

const SocialUserUpdate :React.FC = () => {
  const {isSignedIn, setIsSignedIn, currentUser, setCurrentUser} = useContext(AuthContext)
  
  const classes = useStyles()
  const history = useHistory()

  const [editFormOpen, setEditFormOpen] = useState<boolean>(false)
  const [name, setName] = useState<string | undefined>(currentUser?.name)
  const [gender, setGender] = useState<number>()
  const [prefecture, setPrefecture] = useState<number | undefined>(currentUser?.prefecture)
  const [birthday, setBirthday] = useState<Date | null>(new Date("2000-01-01T00:00:00"))
  const [profile, setProfile] = useState<string | undefined>(currentUser?.profile)
  const [image, setImage] = useState<string>("")
  const [preview, setPreview] = useState<string>("")

  //アップロードした画像の情報を取得
  const uploadImage = useCallback((e) => {
    const file = e.target.files[0]
    setImage(file)
  }, [])

  //画像プレビュー
  const previewImage = useCallback(
    (e) => {
      const file = e.target.files[0]
      setPreview(window.URL.createObjectURL(file))
    },
    [],
  )

  //生年月日から年齢を計算する　年齢 = floor((今日 - 誕生日) / 10000)
  const currentUserAge = (): number | void => {
    const birthday = currentUser?.birthday.toString().replace(/-/g, "") || ""
    if (birthday.length !== 8) return

    const date = new Date()
    const today = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2)

    return Math.floor((parseInt(today) - parseInt(birthday)) / 10000)
  }

  const createFormData = (): UpdateUserFormData => {
    const formData = new FormData()

    formData.append("name", name || "")
    formData.append("gender", String(gender))
    formData.append("prefecture", String(prefecture))
    formData.append("profile", profile || "")
    formData.append("birthday", String(birthday))
    formData.append("image", image)

    return formData
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const data = createFormData()

    try {
      const res = await updateUser(currentUser?.id, data)
      console.log(res)

      if (res.status === 200) {
        setEditFormOpen(false)
        setCurrentUser(res.data.user)

        console.log("Update user successfully!")
        history.push("/home")
      } else {
        console.log(res.data.message)
      }
    } catch (err) {
      console.log(err)
      console.log("Failed in updateing user!")
    }
  }

  return (
    <form noValidate autoComplete="off">
      <Card className={classes.card}>
          <CardHeader lassName={classes.header} title="ユーザー情報登録" />
          <CardContent>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="名前"
            value={name}
            margin="dense"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          />
          <FormControl
              variant="outlined"
              margin="dense"
              fullWidth
            >
              <InputLabel id="demo-simple-select-outlined-label">性別</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={gender}
                onChange={(e: React.ChangeEvent<{value: unknown}>) => setGender(e.target.value as number)}
              >
                {
                  genders.map((gender: string, index: number) =>
                    <MenuItem value={index}>{gender}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
          <FormControl
            variant="outlined"
            margin="dense"
            fullWidth
          >
            <InputLabel id="demo-simple-select-outlined-label">都道府県</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="domo-simple-select-outlined"
              value={prefecture}
              onChange={(e: React.ChangeEvent<{value: unknown}>) => setPrefecture(e.target.value as number)}
            >
              {
                prefectures.map((prefecture, index) =>
                  <MenuItem key={index + 1} value={index + 1}>{prefecture}</MenuItem>
                )
              }
            </Select>
          </FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid justify="space-around">
                <KeyboardDatePicker
                  fullWidth
                  inputVariant="outlined"
                  margin="dense"
                  id="date-picker-dialog"
                  label="誕生日"
                  format="MM/dd/yyyy"
                  value={birthday}
                  onChange={(date: Date | null) => {
                    setBirthday(date)
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date"
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          <TextField
            placeholder="1000文字以内で書いてください"
            variant="outlined"
            multiline
            fullWidth
            label="自己紹介"
            rows="8"
            value={profile}
            margin="dense"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setProfile(e.target.value)
            }}
          />
          <div className={classes.imageUploadBtn}>
            <input
              accept="image/*"
              className={classes.input}
              id="icon-button-file"
              type="file"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                uploadImage(e)
                previewImage(e)
              }}
            />
            <label htmlFor="icon-button-file">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </div>
          {
            preview ? (
              <Box className={classes.box}>
                <IconButton
                  color="inherit"
                  onClick={() => setPreview("")}
                >
                  <CancelIcon />
                </IconButton>
                <img src={preview} alt="preview img" className={classes.preview} />
              </Box>
            ) : null
          }
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={!name || !profile ? true : false}
            >
            送信
          </Button>
          </CardContent>
      </Card>
  </form>
  )
}

export default SocialUserUpdate