class ConsoleController < ApplicationController

  before_filter :authenticate

  def index
    @msortby = params[:sortby] || 'created_at'
    @msortord = if not params[:sortord]; -1; else params[:sortord].to_i; end
    # @messages = Message.find(:all, :order => "table_code, guest_phone")
    # @messages = Message.find_by_sql("SELECT * FROM messages ORDER BY messages.table_code, messages.guest_phone")
    @clients =
      Client.find_by_sql("SELECT * FROM clients JOIN restaurants ON clients.restaurant_phone = restaurants.restaurant_phone WHERE clients.restaurant_phone = '"+
                         @current_user.restaurant_phone+
                         "' ORDER BY clients.last_polled DESC")
    @messages =
      Message.paginate(:joins => "messages INNER JOIN clients ON messages.restaurant_code = clients.restaurant_code",
                       :conditions => ["clients.restaurant_phone = ?", @current_user.restaurant_phone],
                       :group => "messages.id",
                       :page => params[:page] || 1, :per_page => 15,
                       :order => @msortby.to_s+
                       (if @msortord > 0
                          " ASC"
                        else " DESC"
                        end))
  end

  def sendmsg
    ServiceHelper.send_message(params[:restaurant_phone],
                               params[:guest_phone],
                               params[:text_message])
    redirect_to :action => ''
  end

  private

  def authenticate
    authenticate_or_request_with_http_basic do |id, password|
      (@current_user = Restaurant.find_by_restaurant_phone(id)) &&
        @current_user.password == password
    end
  end

end
