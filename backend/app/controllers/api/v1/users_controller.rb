class Api::V1::UsersController < ApplicationController
  before_action :set_user, only: %i[show update]

  def index
    users = User.where(prefecture: current_api_v1_user.prefecture).where.not(id: current_api_v1_user.id, gender: current_api_v1_user.gender).order("created_at DESC")
    render json: {status: :ok, users: users}
  end

  def show
    render json: {status: :ok, user: @user}
  end

  def update
    @user.name = user_params[:name]
    @user.prefecture = user_params[:prefecture]
    @user.profile = user_params[:profile]
    @user.image = user_params[:image] if user_params[:image] != ""

    if @user.save
      render json: {status: :ok, user: @user}
    else
      render json: {status: :internal_server_error, message: "更新に失敗しました"}
    end
  end

  private

    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.permit(:name, :prefecture, :profile, :image)
    end
end
