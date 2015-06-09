require 'json'

# Outgoing Caller ID previously validated with Twilio
CALLER_ID = '617-858-6093';

class ServiceController < ApplicationController
  def get_messages
        the_restaurant_code = session[:restaurant_code]
        if(the_restaurant_code == nil)
          flash[:notice] = "ServiceController.get_messages got a session with no session_id in it."
          redirect_to :action => "error" and return
        else
          update_polling()
          process_instructions(params[:instructions_string])
          messages =  Message.find(:all, :conditions =>
                        {:status => 'active', :restaurant_code => the_restaurant_code})
          if(messages.length == 0)
            render :json => messages and return
          else
            messages.each do |message|
             message.age = (Time.now.utc.to_i - message.created_at.to_i)/60
            end
            render :json => messages and return
          end
        end
  end

  def get_messages_from_table
      messages = Message.all(:order => "created_at DESC", :limit => 15, :conditions => {:table_code => params[:table], :restaurant_code => session[:restaurant_code]})
        ret_val=[]
        messages.each do |message|
         # ret_val << Array[message.text, message.created_at.getlocal.strftime("%b %d %I:%M%p %Z"), message.status]
          ret_val << Array[message.created_at.getlocal.strftime("%b %d %I:%M%p %Z"), message.status, message.table_code, message.guest_phone, message.text]
        end
      render :json => ret_val
  end

  def get_messages_from_phone
      messages = Message.all(:order => "created_at DESC", :limit => 15, :conditions => {:guest_phone => params[:guest_phone], :restaurant_code => session[:restaurant_code]})
        ret_val=[]
        messages.each do |message|
         # ret_val << Array[message.text, message.created_at.getlocal.strftime("%b %d %I:%M%p %Z"), message.status]
          ret_val << Array[message.created_at.getlocal.strftime("%b %d %I:%M%p %Z"), message.status, message.table_code, message.guest_phone, message.text]
        end
      render :json => ret_val
  end

  def get_recent_messages
      messages = Message.all(:order => "created_at DESC", :limit => params[:count], :conditions => {:restaurant_code => session[:restaurant_code]})
        ret_val=[]
        messages.each do |message|
        #  ret_val << Array[message.text, message.created_at.getlocal.strftime("%b %d %I:%M%p %Z"), message.status, message.guest_phone]
         ret_val << Array[message.created_at.getlocal.strftime("%b %d %I:%M%p %Z"), message.status, message.table_code, message.guest_phone, message.text, message.id]
        end
      render :json => ret_val
  end

  def get_reopen_message
     mess = Message.find(:first, :conditions => {:id => params[:message_id]})
     mess.status = 'active'
     mess.save
     get_recent_messages
  end

  def get_blocked_phones
        blocked_phones =  BlockedPhone.find(:all, :conditions =>
          {:status => ['blocked','autoblocked'], :restaurant_code => session[:restaurant_code]})
        ret_val=[]
        blocked_phones.each do |blocked_phone|
          ret_val << Array[blocked_phone.updated_at.getlocal.strftime("%b %d %I:%M%p %Z"), blocked_phone.status, blocked_phone.guest_phone]
        end
        render :json => ret_val
  end

  def unblock_phone
      phone_to_unblock = BlockedPhone.find(:all, :conditions => {:guest_phone => params[:guest_phone], :restaurant_code => session[:restaurant_code], :status => ['blocked','autoblocked']})
      if (phone_to_unblock != [])
	phone_to_unblock[0].status = 'unblocked'
        phone_to_unblock[0].save
      end
      get_blocked_phones
  end

  def receive_twilio
    ServiceHelper.receive_twilio(params[:To], params[:From], params[:Body])
  end

  def get_server_status
    render :text => "true"
  end

  def get_clients_down
        messages = "messages: "
        all_clients = Client.find(:all)
        current_time = Time.now.utc
        all_clients.each do |a_client|
          if ((current_time.to_i - a_client.last_polled.to_i) > 60)
            if (a_client.status == 'up')
              if (a_client.restaurant_phone != '6178586093') # the first demo phone number
                ServiceHelper.send_message('6178586093','5084151966', 'client down with restaurant_phone:' + a_client.restaurant_phone +
                             " and client_code: " + a_client.client_code)
              end
              a_client.status = "down"
              a_client.save
              messages += "client down: " + a_client.restaurant_code
            end
          end
        end
    render :text => messages
  end

  protected

  def update_polling()
        the_session_id = request.session_options[:id]
        if(the_session_id == nil)
          flash[:notice] = "ServiceController.update_polling could not find a session_id in the request."
          redirect_to :action => "error" and return
        end
        the_client = Client.find(:first, :conditions => {:session_id => the_session_id})
        if (the_client != nil)
          the_client.last_polled = Time.now.utc
          if (a_client.status == 'down')
            if (a_client.restaurant_phone != '6178586093') 
              ServiceHelper.send_message('6178586093', '6173086579', 'client up with restaurant_phone:' + a_client.restaurant_phone +
                           " and client_code: " + a_client.client_code)
            end
            a_client.status = "up"
            a_client.save
          end
        end
  end

  def process_instructions(instructions_string)
      if(instructions_string != '[]')
	puts "instructions_string not empty:" + instructions_string
        parsed_instructions = JSON.parse(instructions_string)
        parsed_instructions.each do |item|
          if(item['type']=='close_message')
            message = Message.find(item['id'])
            message.status = 'closed'
            message.save
          elsif(item['type']=='send_reply')
            message = Message.find(item['id'])
            reply_mess = Message.new(:restaurant_code => message.restaurant_code,
                                     :status          => 'reply',
                                     :table_code      => message.table_code,
                                     :table_name      => message.table_code,
                                     :text            => item['text'], :guest_phone => message.guest_phone)
            reply_mess.save
            if(item['text']=~/You have been blocked(.*)/)
              ServiceHelper.block_phone(session[:restaurant_code],message.guest_phone)
              ServiceHelper.send_message(session[:restaurant_phone], message.guest_phone,item['text'])
            else
              ServiceHelper.send_message(session[:restaurant_phone], message.guest_phone,item['text'])
            end
          end
        end
      end
  end

  def close_message(message_id)
  end

  def authorize
  end
end
