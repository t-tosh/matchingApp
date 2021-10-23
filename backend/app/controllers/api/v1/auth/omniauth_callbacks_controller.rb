class Api::V1::Auth::OmniauthCallbacksController < DeviseTokenAuth::OmniauthCallbacksController
  skip_before_action :skip_session

  def redirect_callbacks
    super
  end

  def omniauth_success
    super
    update_auth_header
  end

  def omniauth_failure
    super
  end

  protected

    def assign_provider_attrs(user, auth_hash)
      case auth_hash["provider"]
      when "github"
        user.assign_attributes({
          name: auth_hash["info"]["nickname"],
          email: auth_hash["info"]["email"],
        })
      when "google_oauth2"
        user.assign_attributes({
          name: auth_hash["info"]["name"],
          email: auth_hash["info"]["email"],
        })
      else
        super
      end
    end

    def render_data_or_redirect(message, data, user_data = {})
      if ["inAppBrowser", "newWindow"].include?(omniauth_window_type)
        render_data(message, user_data.merge(data))
      elsif auth_origin_url
        # redirect_to DeviseTokenAuth::Url.generate(auth_origin_url, data.merge(blank: true))
        redirect_to generate_redirect_url(auth_origin_url, data)
      else
        fallback_render data[:error] || "An error occurred"
      end
    end

    def generate_redirect_url(auth_origin_url, data)
      auth_token = data["auth_token"]
      client_id = data["client_id"]
      expiry = data["expiry"]
      uid = data["uid"]

      # ex) http://localhost:8000/?auth_token=XXX&blank=true&client_id=XXXX&config=&expiry=XXXX&uid=XXX
      "#{auth_origin_url}/?auth_token=#{auth_token}&blank=true&client_id=#{client_id}&config=&expiry=#{expiry}&uid=#{uid}"
    end
end