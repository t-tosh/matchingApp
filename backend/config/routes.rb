Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "auth/users/currentuser"
      resources :test,       only: %i[index]
      resources :likes,      only: %i[index create]
      resources :chat_rooms, only: %i[index show]
      resources :messages,   only: %i[create]
      resources :users,      only: %i[index show update]      

      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        registrations: 'api/v1/auth/registrations',
        omniauth_callbacks: 'api/v1/auth/omniauth_callbacks'
      }

      # namespace :auth do
      #   resources :sessions, only: %i[index]
      # end
    end
  end
end