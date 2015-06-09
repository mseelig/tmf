class CnslController < ApplicationController

  before_filter :authenticate

  def client
    @clients =
      Client.find_by_sql("SELECT * FROM clients JOIN restaurants ON clients.restaurant_phone = restaurants.restaurant_phone ORDER BY clients.last_polled DESC")
  end

  def list
    @msortby = params[:sortby] || 'created_at'
    @msortord = if not params[:sortord]; -1; else params[:sortord].to_i; end
    # @messages = Message.find(:all, :order => "table_code, guest_phone")
    # @messages = Message.find_by_sql("SELECT * FROM messages ORDER BY messages.table_code, messages.guest_phone")
    @messages = Message.paginate(:all,
                                 :page => params[:page] || 1, :per_page => 15,
                                 :order => @msortby.to_s+
                                 (if @msortord > 0
                                    " ASC"
                                  else " DESC"
                                  end))
  end

  def sendmsg
    flash[:guest_phone] = params[:guest_phone]
    flash[:restaurant_phone] = params[:restaurant_phone]
    flash[:text_message] = params[:text_message]
    # @sendmsg.save =
    ServiceHelper.send_message(params[:restaurant_phone],
                               params[:guest_phone],
                               params[:text_message])
    # if @sendmsg.save
      redirect_to :action => 'list'
    # else
    #   @subjects = Subject.find(:all)
    #   render :action => 'new'
    # end
  end

  def recvmsg
    flash[:guest_phone] = params[:From]
    flash[:restaurant_phone] = params[:To]
    flash[:text_message] = params[:Body]
    ServiceHelper.receive_twilio(params[:To], params[:From], params[:Body])
    redirect_to :action => 'list'
  end

  private

  USER_ID, PASSWORD = "water", "rules!"

  def authenticate
    authenticate_or_request_with_http_basic do |id, password| 
      id == USER_ID && password == PASSWORD
    end
  end

end
