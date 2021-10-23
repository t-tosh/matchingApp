class Api::V1::Auth::UsersController < ApplicationController
  before_action :authenticate_api_v1_user!

  def currentuser
    @user = current_api_v1_user
    render json: { status: 200, data: @user }
  end
end