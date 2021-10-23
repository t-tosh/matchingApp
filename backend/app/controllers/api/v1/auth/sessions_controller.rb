class Api::V1::Auth::SessionsController < ApplicationController
  before_action :authenticate_api_v1_user!

  def currentuser
    @user = current_api_v1_user
    reder json: {status :ok, data: @user}
  end
end