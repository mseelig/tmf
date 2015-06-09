module CnslHelper

  def CnslHelper.change_to(str, sortby, sortord)
    {:sortby => str, :sortord => if str==sortby; - sortord; else -1; end}
  end

  def CnslHelper.html_colorize_status(str)
    if "up"==str
      "<font color=green>"+str+"</font>"
    else if "down"==str
           "<font color=red>"+str+"</font>"
         else
           str
         end
    end
  end

  def CnslHelper.time_in_words_to_now(dt)
    if dt
      interval = Time.now.to_i - dt.to_i
      if interval <= 60
        interval.to_s+" seconds"
      else
        # Why can't I call this here?
        # distance_of_time_in_words_to_now(dt)
        # NoMethodError in Client#list
        # Showing app/views/client/list.html.erb where line #29 raised:
        # undefined method `distance_of_time_in_words_to_now' for CnslHelper:Module
        nil
      end
    else
      "never"
    end
  end

end
