import React from "react";
import Button from "@material-ui/core/Button"


const socialAuth :React.FC = () => {
  const handleGithubSubmit = async () => {
    window.location.href = "http://localhost:3001/api/v1/auth/github?auth_origin_url=http://localhost:3000/"
  }
  const handleGoogleSubmit = async () => {
    window.location.href = "http://localhost:3001/api/v1/auth/google_oauth2?auth_origin_url=http://localhost:3000/"
  }

  return (
    <>
      <Button
        type="submit"
        variant="outlined"
        color="primary"
        onClick={handleGithubSubmit}
      >
        GithubLogin
      </Button>
      <Button
        type="submit"
        variant="outlined"
        color="primary"
        onClick={handleGoogleSubmit}
      >
        GoogleLogin
      </Button>
    </>
  )
}

export default socialAuth