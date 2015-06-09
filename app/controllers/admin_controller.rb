MASTER_KEY = "_clear";

class AdminController < ApplicationController
  def login
        debugger
        request_session_id = nil  # needed to establish the scope
        the_client = nil  # needed to establish the scope.
        restaurant_phone = params[:restaurant_phone]
        client_code      = params[:client_code]
        has_master_key   = false
        if (request.get? == false)
               flash[:notice] = "AdminController.login recieved a request that was not a 'get'."
               redirect_to :action => "error" and return
        elsif (restaurant_phone == nil)
               flash[:notice] = "AdminController.login recieved a request that did not contain: restaurant_phone."
               redirect_to :action => "error" and return
        elsif (client_code == nil)
               flash[:notice] = "AdminController.login recieved a request that did not contain: client_code."
               redirect_to :action => "error" and return
        else
          has_master_key = client_code.end_with? MASTER_KEY;
          if(has_master_key)
            client_code_end_pos = ((- MASTER_KEY.length) - 1)
            client_code = client_code[0 .. client_code_end_pos]
          end
          a_restaurant = Restaurant.find(:first, :conditions => {:restaurant_phone => restaurant_phone})
          if (a_restaurant == nil)
             flash[:notice] = "AdminController.login could not find a restaurant" +
                              "<br/>with restaurant_phone: " + restaurant_phone
             redirect_to :action => "error" and return
          end
          request_session_id = session[:session_id]
          the_client = Client.find(:first, :conditions => {:session_id => request_session_id})
          if((the_client != nil) && !((the_client.restaurant_phone == restaurant_phone) && (the_client.client_code == client_code)))
            the_client = nil  #ie don't use the request session_id, its bad. maybe we're developing and testing different restaurant
          end
          if (the_client == nil)
              puts "the client is nil, first time"
              the_client = Client.find(:first,
                                    :conditions => {:restaurant_phone => restaurant_phone,
                                                    :client_code      => client_code})
              if(the_client == nil)
                   puts "the client is nil 2nd time"
                   flash[:notice] = "AdminController.login couldn't find the_client" +
                                    "<br/>from the request_session_id: "  + request_session_id  +
                                    "<br/> OR restaurant_phone: " + restaurant_phone +
                                    " and client_code: " +  client_code;
                   redirect_to :action => "error" and return
              elsif (has_master_key)
                    nil #allow this "master" client, let it through
              elsif (the_client.session_id == nil)  #no stored session so use the request session id.
                    the_client.session_id = request_session_id
              elsif (the_client.session_id == request_session_id) #we're good to go
                     nil
              else #stored session id is different than the request session id
                 if ((the_client.status == "down") || (the_client.last_polled == nil))
                    the_client.session_id = request_session_id
                 elsif (((Time.now.utc.to_i - the_client.last_polled.to_i) / 60.0) > 1.0) # consider the session in the db is dead
                    the_client.session_id = request_session_id       
                 else #the_client has a session_id that's different from this request session_id and its still "up"
                      #so don't allow this new one in as maybe its trying to spoof us.
                   if(the_client.client_name == nil)
                       the_client.client_name = ""
                   end
                   flash[:notice] = "AdminController.login already has a session" +
                                    "<br/>with session_id: " + the_client.session_id +
                                    "<br/>with restaurant_phone: " + restaurant_phone +
                                    "<br/>for client: " + the_client.client_name +
                                    "<br/>and status: up" +
                                    "<br/>but was requested with a different session_id of: " + request_session_id;
                   redirect_to :action => "error" and return
                 end
              end
          else #we've got a valid retaurant and a vaild associated session, but just do an extra check to ensure that the client_code is correct
            client_check = Client.find(:first,
                                    :conditions => {:restaurant_phone => restaurant_phone,
                                                    :client_code      => client_code})
            if(client_check == nil)
               flash[:notice] = "AdminController.login already has a session" +
                                "<br/>with session_id: " + the_client.session_id +
                                "<br/>with restaurant_phone: " + restaurant_phone +
                                "<br/> but the client code in the url of: " + client_code +
                                " is not valid."
               redirect_to :action => "error" and return
            end
          end
          restaurant_code = the_client.restaurant_code;
              #get_restaurant_code_from_client_computer(restaurant_phone, client_code)
          if(restaurant_code == nil)
             flash[:notice] = "AdminController.login could not find a restaurant_code" +
                              "<br/>for restaurant_phone: " + restaurant_phone +
                              "<br/>and client_code: "      + client_code
             redirect_to :action => "error" and return  
          else
             session[:restaurant_code]  = restaurant_code
             session[:restaurant_name]  = a_restaurant.restaurant_name
             session[:restaurant_phone] = restaurant_phone
             session[:client_code]      = client_code
             if(the_client.client_name == nil)
                the_client.client_name = ""
             end
             session[:client_name]      = the_client.client_name
             if(!has_master_key)
               the_client.status = "up"
               the_client.last_polled = Time.now.utc
               the_client.save
             end
             redirect_to :controller => "waitstation"  and return
          end
        end   
  end

  def logout
  end

  def index
  end

  def error
  end

  def simulate_twilio
  end
  protected
  def get_restaurant_code_from_client_computer (restaurant_phone, client_code)
    #rest_code = Client.find(:first, :select => "restaurnt_code", :conditions => 
    #     {:restaurant_phone => restaurant_phone, :client_code => client_code})
    return restaurant_phone
  end
end
