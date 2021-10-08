class Api::V1::MessagesController < ApplicationController
  def create
    message = Message.new(message_params)

    if message.save
      render json: {status: :ok, message: message}
    else
      render json: {status: :internal_server_error, message: "作成に失敗しました"}
    end
  end

  private
  
    def message_params
      params.permit(:chat_room_id, :user_id, :content)
    end
end
