class WaitstationController < ApplicationController

def index
  @restaurant_phone=session[:restaurant_phone]
  @restaurant_phone=@restaurant_phone[0,3] + " " +
		    @restaurant_phone[3,3] + " " +
   		    @restaurant_phone[6,4]
  @restaurant_image_link="/images/" + session[:restaurant_phone]
  if (File.exist?(RAILS_ROOT + '/public' + @restaurant_image_link))
    @restaurant_name_or_image='<img id="restaurant_image" src="' +  @restaurant_image_link + ' "/>'
  else
    @restaurant_name = session[:restaurant_name] #Restaurant.find_all_by_restaurant_code(session[:restaurant_code])[0].restaurant_name
    @restaurant_name_or_image='<h1 align=center>' + @restaurant_name + '</h1>'
  end
  @client_name = session[:client_name]
  @customizations = RestaurantCustomization.find(:first, :conditions => {:restaurant_phone => session[:restaurant_phone]})
  @customizations_english = RestaurantCustomization.find(:first, :conditions => {:restaurant_phone => 'english'})
  has_cust = (@customizations != nil);
  if (has_cust && (@customizations.other_replies_html != nil))
    @other_replies_html = @customizations.other_replies_html
  else 
    @other_replies_html = @customizations_english.other_replies_html
  end
  if (has_cust && (@customizations.table_label != nil))
     @table_label = @customizations.table_label
  else 
     @table_label = @customizations_english.table_label
  end
  
end

end
