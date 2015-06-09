require 'twiliolib'

# Twilio REST API version
API_VERSION = '2010-04-01' #this may be wrong, should use old API_VERSION?

# Twilio AccountSid and AuthToken
ACCOUNT_SID = 'AC057f861acf7dce3ccf895bcb61cf5c0c'
ACCOUNT_TOKEN = '30a478ddc012f582211e4e1e4cd11be9'


# Outgoing Caller ID previously validated with Twilio
CALLER_ID = '617-858-6093';

module ServiceHelper
  def ServiceHelper.send_message(restaurant_code, phone, message)
    account = Twilio::RestAccount.new(ACCOUNT_SID, ACCOUNT_TOKEN)
    d = {
      'From' => restaurant_code, #CALLER_ID,
      'To' => phone,
      'Body' => message
    }
    resp = account.request("/#{API_VERSION}/Accounts/#{ACCOUNT_SID}/SMS/Messages", 'POST', d)
    resp.error! unless resp.kind_of? Net::HTTPSuccess
    puts "code: %s\nbody: %s" % [resp.code, resp.body]
    resp
  end

  def ServiceHelper.receive_twilio(restaurant_phone, guest_phone, message_body)
    #"FromState"=>"MA", "ToState"=>"MA", "AccountSid"=>"AC057f861acf7dce3ccf895bcb61cf5c0c", "Body"=>"test1", "SmsMessageSid"=>"SM61dee9215ab6145bbc693c513e96f503", "FromCity"=>"CAMBRIDGE", "From"=>"6173086579", "SmsStatus"=>"received", "To"=>"6178586093", "FromCountry"=>"US", "FromZip"=>"02113", "ToCity"=>"CAMBRIDGE", "ToZip"=>"02163", "ToCountry"=>"US", "SmsSid"=>"SM61dee9215ab6145bbc693c513e96f503", "ApiVersion"=>"2008-08-01"}
    puts "____________recieive_twilio rest_phone: " + restaurant_phone
    puts "     guest_phone: "  + guest_phone
    puts "     message_body: " + message_body
    restaurant = Restaurant.find(:first, :conditions => {:restaurant_phone => restaurant_phone})
    if(restaurant == nil) # shouldn't happen because such a message shouldn't get thru twilio
      flash[:notice] = "AdminController.login recieved a request that was not a 'get'."
      redirect_to :action => "error" and return
    end
    #"^\s*[[:punct:][:alpha:]](\d{1,})\s*(.*)" the original regexp by mark but :alpha: doesn't work,
    #("^\s*[@tT]([0-9]{1,3})\\D+([\s\S]*)$")
     # it just matches the chars a, l, p, etc, not a-zA-Z
    default_regexp = "^\\s*[@tTbB]([0-9]{1,3})(\\D[\\s\\S]*)"
    # note: where regexp doc usually has a single backslash, in a literal string I need 2 since the
    # parsing of a string literal in Ruby uses backslash as an escape char so you need two
    # to include a backslash char in the literal string BUT when puttign the string in the db, only
     # have one backslash as you don't need the escape.
    # ^ means begining of expr, followed by ...
    # 0 or more whitespace
    # @, t, T, b, or B as table code prefix (NOT to be included in the table code)
    # 1 to 3 digits of table code
    # followed by a non digit  (thus 4 digits of table code will cause whole expression not to match)
    # any number of whitespace or non-whitespace (in other words any number of any char.)
    # note that I didn't use dot for this since that doesn't match newline chars.
    regexp = get_custom_value(restaurant_phone, "message_regexp")
    puts "got regexp from db" + regexp
    puts "length of regexp from db: " + regexp.length.to_s
    if(regexp == nil) 
       regexp = default_regexp 
    end
    table_code_and_text = message_body.match(regexp)
    if (table_code_and_text == nil)
      puts("text not valid: " + message_body)
      ServiceHelper.send_message(restaurant_phone, guest_phone, "Sorry, we cannot understand your message.\nPlease use:\n[location number] [message]\nExample: t12 more water")
      return
    end
    table_code = ""
    text = ""
    table_code = table_code_and_text[1] 
    text = table_code_and_text[2]
    text.strip!  #cut leading whitespace
    text.rstrip! #cut trailing whjitespace
    if(text.start_with?(","))
      text.slice!(0) #remove the first char
    end
    if(text.start_with?(":"))
      text.slice!(0) #remove the first vchar
    end
    puts "______________________"
    puts "table_code: "   + table_code
    puts "text: " + text
    puts "tcat length: "   + table_code_and_text.length.to_s
    restaurant_code =
    ServiceHelper.get_restaurant_code_from_guest_phone(restaurant_phone, guest_phone, table_code)
    puts "RC: " + restaurant_code
    if (restaurant_code == nil)
        ServiceHelper.send_message(restaurant_phone, guest_phone, "Sorry, we don't recognize the facility phone number: " + restaurant_phone +
                                   " Please speak to your server directly.")
        return
    end
    is_blocked =
        BlockedPhone.find(:first, :conditions => {
                            :guest_phone => guest_phone,
                            :restaurant_code => restaurant_code,
                            :status => 'blocked'
                          })
    puts "is_blocked " + is_blocked.to_s
    if (is_blocked == nil)
        if (ServiceHelper.is_banned_message(table_code_and_text[2]))
          message = Message.new(:restaurant_code => restaurant_code,
                                :status => 'autoblocked',
                                :table_code => table_code,
                                :table_name => table_code,
                                :text => text,
                                :guest_phone => guest_phone)
          message.save
          ServiceHelper.send_message(restaurant_phone, guest_phone, "Your message was inappropriate and you have been blocked from sending further messages.")
          ServiceHelper.block_phone(restaurant_code, guest_phone)
        else
          message = Message.new(:restaurant_code => restaurant_code,
                                :status      => 'active',
                                :table_code  => table_code,
                                :table_name  => table_code,
                                :text        => text,
                                :guest_phone => guest_phone)
          message.save
          a_restaurant = Restaurant.find_all_by_restaurant_phone(restaurant_phone)
          puts "a_restaurant len: " + a_restaurant.length.to_s
          if a_restaurant != []
            ServiceHelper.send_message(restaurant_phone, guest_phone,
                                       "Thank you for using TextMyFood at " +
                                       a_restaurant[0].restaurant_name +
                                       ". Your message has been received by the system.")
          else
            # error condition: phone number from Twilio is not in restaurant table
            ServiceHelper.send_message(restaurant_phone, guest_phone,
                                       "Sorry, we don't have a record of the facility phone: " +
                                       restaurant_phone +
                                       " Please talk to your server directly. 2")
          end
        end
    else
        message = Message.new(:restaurant_code => restaurant_code,
                              :status => 'blocked',
                              :table_code => table_code,
                              :table_name => table_code,
                              :text => text,
                              :guest_phone => guest_phone)
        message.save
    end
  end
  
  #does inheritance in the restaurant_customization table
  def ServiceHelper.get_custom_value(restaurant_phone, column_name)
    rest_cust = RestaurantCustomization.find(:first, :conditions => {
                                              :restaurant_phone => restaurant_phone})
    if(rest_cust == nil)
      return nil
    end
    result_maybe = rest_cust[column_name]
    if(result_maybe != nil)
      return result_maybe
    elsif (rest_cust.parent_restaurant_phone == nil)
      return nil
    else
      return ServiceHelper.get_custom_value(rest_cust.parent_restaurant_phone, column_name)
    end 
  end
  
  

  protected

  def ServiceHelper.get_restaurant_code_from_guest_phone(restaurant_phone, guest_phone, table_code) # returns restaurant_code or nil if none
    rest = Phonemap.find( :first, :conditions =>
                          { :restaurant_phone => restaurant_phone,
                            :guest_phone => guest_phone})
    if(rest != nil) then return rest.restaurant_code
    else
      rest = Tablemap.find(:first, :conditions =>
                           {:restaurant_phone => restaurant_phone, :table_code => table_code})
      if(rest != nil) then return rest.restaurant_code
      else
        rest = Client.find(:first, :conditions =>
                           {:restaurant_phone => restaurant_phone})
        if(rest != nil) then return rest.restaurant_code
        else
          puts "Warning: get_restaurant_code_from_guest_phone passed: restaurant_phone: " + restaurant_phone +
            " and guest_phone: " + guest_phone +
            " and table_code: "  + table_code +
            " but could not find a corresponding restaurant_code."
          return nil
        end
      end
    end
  end

  def ServiceHelper.is_banned_message(message)
    message =~ /(.*)(bitch|blowjob|blow job|cocksucker|cunt|fuck|piss|shit|tits|\=\=\=D)(.*)/i
  end

  def ServiceHelper.block_phone(restaurant_code, guest_phone)
    phone_to_block = BlockedPhone.new(:guest_phone => guest_phone, :restaurant_code => restaurant_code, :status => 'blocked')
    phone_to_block.save
  end

end
