class Api::V1::ChatRoomsController < ApplicationController
  before_action :set_chat_room, only: %i[show]

  def index
    chat_rooms = []

    current_api_v1_user.chat_rooms.order("created_at DESC").each do |chat_room|
      chat_rooms << {
        chat_room: chat_room,
        other_user: chat_room.users.where.not(id: current_api_v1_user.id)[0],
        last_message: chat_room.messages[-1]
      }
    end

    render json: {status: :ok, chat_rooms: chat_rooms}
  end

  def show
    other_user = @chat_room.users.where.not(id: current_api_v1_user.id)[0]
    messages = @chat_room.messages.order("created_at ASC")

    render json: {status: :ok, other_user: other_user, messages: messages}
  end

  private

  def set_chat_room
    @chat_room = ChatRoom.find(params[:id])
  end
end
