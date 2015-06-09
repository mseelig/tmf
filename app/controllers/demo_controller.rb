class DemoController < ApplicationController
  def index
      redirect_to("/admin/login?restaurant_phone=6178586093&client_code=1")
  end
end
