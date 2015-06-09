module ConsoleHelper

  def ConsoleHelper.change_to(str, sortby, sortord)
    {:sortby => str, :sortord => if str==sortby; - sortord; else -1; end}
  end

  def ConsoleHelper.local_time_string(tm, tz)
    twz = Time.at(tm.utc+Time.zone_offset(tz))
    twz.strftime("%a %b %d %H:%M:%S ")+tz+twz.strftime(" %Y")
  end

  def ConsoleHelper.local_iso_time_string(tm, tz)
    Time.at(tm.utc+Time.zone_offset(tz)).strftime("%Y-%m-%d %H:%M")
  end

  def ConsoleHelper.time_in_words_to_now(dt)
    if dt
      interval = Time.now.to_i - dt.to_i
      if interval <= 60
        interval.to_s+" seconds"
      else
        # Why can't I call this here?
        # distance_of_time_in_words_to_now(dt)
        # NoMethodError in Client#list
        # Showing app/views/client/list.html.erb where line #29 raised:
        # undefined method `distance_of_time_in_words_to_now' for ConsoleHelper:Module
        nil
      end
    else
      "never"
    end
  end

end
