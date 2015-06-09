// when the DOM is ready for manipulation
$(document).ready(function() {
	 // function for when the window is resized
	$(window).bind('resize', UICallbacks.resizeWindows).trigger('resize'); //originally from main.js
    //$("#system_menu_button").bind("click", UICallbacks.systemMenuButton);
	//$('#close_other_replies').bind('click', UICallbacks.close_other_replies); // other_replies hide button clicked

	$('#other_replies_content .send_other_reply_button').bind('click', UICallbacks.chooseResponse); // a response was clicked

	window.status="no"; //turn off the status bar
	window.active_messages=[];
	window.unsent_instructions="";
    //window.sent_instructions="";
    window.XHR = null; //just use one per client, don't keep making a new one in order to avoid memory leak.
    window.requestTimer = null;
    window.sent_stamp_first_response_array = new Array(); //array of message id's that should have the sent stamp on the "be there" button
    window.is_sent_stamp_in_first_response = function(message_id){
       var index = sent_stamp_first_response_array.indexOf(message_id);
       if(index == -1) return false;
       else return true;
    };
    window.add_sent_stamp_to_first_response = function(message_id){
       if(sent_stamp_first_response_array.indexOf(message_id) == -1)
             sent_stamp_first_response_array.push(message_id);
    };
    window.remove_sent_stamp_from_first_response = function(message_id){
       var index = sent_stamp_first_response_array.indexOf(message_id);
       if(index != -1) sent_stamp_first_response_array.splice(index, 1);
    };
    
    
    window.sent_stamp_other_response_array = new Array(); //array of message id's that should have the sent stamp on the "other" button
    window.is_sent_stamp_in_other_response = function(message_id){
       var index = sent_stamp_other_response_array.indexOf(message_id);
       if(index == -1) return false;
       else return true;
    };
    window.add_sent_stamp_to_other_response = function(message_id){
       if(sent_stamp_other_response_array.indexOf(message_id) == -1)
             sent_stamp_other_response_array.push(message_id);
    };
    window.remove_sent_stamp_from_other_response = function(message_id){
       var index = sent_stamp_other_response_array.indexOf(message_id);
       if(index != -1) sent_stamp_other_response_array.splice(index, 1);
    };
	
	test_mess_src=
            '[{"message":{"id":123, "age":2, "table_name":"23", "table_code":1234, "text":"example: hi there", "status":"active",  "phone":"617 541-1234"}}, ' +
             '{"message":{"id":321, "age":3, "table_name":"34", "table_code":2345, "text":"example: hey you ", "status":"active", "phone":"617 234-4567"}}]';

    var my_data='no init';
    window.show_network_down = function(xhr_inst, status, exception_obj) {
                                   $("#network_down").fadeIn();
                               }
    window.hide_network_down = function(xhr_inst, status, exception_obj) {
                                   $("#network_down").fadeOut(100); //make this short as often its already hidden
                               }                           
    window.enable_get_all_messages = true;   //set to false to help debugging  
    function get_all_messages_jquery(){
		//alert("top of get_all _messages");
        //onsole.log(window.localStorage.myint);
        //onsole.log(window.localStorage.myint + 1);
       if(enable_get_all_messages){ 
            sent_instructions='[' + unsent_instructions + ']';
            unsent_instructions="";
            //data: {'restaurant_code': '617-541-1234', 'instructions_string': encodeURIComponent(sent_instructions)},
           $.ajax({
            type: 'POST',
            url: '/service/get_messages',
            data: {'instructions_string': sent_instructions},
            dataType: 'json',
            cache: false,
            success: got_all_messages,
            error: window.show_network_down
              });
           //"[" + sent_instructions + "]";
           //got_all_messages(test_mess_src); //change to a get to server with got_all_messages as its callback
               //alert("bottom of get_all_messages");
       }
	}
    function get_all_messages_timeout() {
                        window.XHR.abort();
                        window.show_network_down();
    }
    function get_all_messages(){
        if(enable_get_all_messages){
            window.requestTimer = setTimeout(get_all_messages_timeout, 6000); //abort if no response after 6 seconds
            if(window.XHR == null) { //hits on first call to get_all_messages  only.
                window.XHR = new XMLHttpRequest();
                window.XHR.onreadystatechange = function (){
                                       //lert("orsc state: " + window.XHR.readyState);
                                       if (window.XHR.readyState != 4) return;
                                       clearTimeout(window.requestTimer);
                                       //lert("orcs got 4, with status: " + window.XHR.status);
                                       if (window.XHR.status != 200) {window.show_network_down();}
                                       var json_string=window.XHR.responseText;
                                       //lert("orsc got status 200 with json string: " + json_string);
                                        var json_obj=jQuery.parseJSON(json_string);
                                       //lert("parsed json is: " + json_obj);
                                       got_all_messages(json_obj);
                                       //window.XHR.onreadystatechange = null; //doesn't stop the memory leak
                                       };
            }
            // the below hair is to minimize string consing for the usual case of no new instructions
            // in that case we still want to do the ajax call because the server might have new messages for us
           var escaped_instructions="/service/get_messages?instructions_string=%5B%5D";  //equivalent to "[]"  //'[' + unsent_instructions + ']';
            if(unsent_instructions != ""){
                escaped_instructions="/service/get_messages?instructions_string=" + escape('[' + unsent_instructions + ']');
                unsent_instructions="";
            }
            window.XHR.open("POST", escaped_instructions, true);
            window.XHR.send(null);
        }
    }
    
	function got_all_messages(mess_objs) {
        window.hide_network_down();
		//alert("got_all_messasges got: " + mess_objs);
		//onsole.log("mess_objs");
		//onsole.log("number of messages from server: ", mess_objs.length);
		//onsole.log("mess objs from server: ", mess_objs);
		//onsole.log(compare(mess_objs, window.active_messages));
		//if(mess_objs.length > 0) //onsole.log("first mess id from server: ", mess_objs[0].message.id);
		sent_instructions="";
        if (did_messages_change(mess_objs)) {
            remove_active_messages();
            for (i=0; i < mess_objs.length; i++) {
		      createMessage(mess_objs[i]);
		    }
            if(!window.before_first_poll){
               UICallbacks.startFlashing();
            }
        }
        else { 
            //remove_deleted_messages(mess_objs);
            update_ages(mess_objs);
        }
        window.before_first_poll = false;
	}
    window.localStorage.last_id_sum="0"; //can only store strings in local storage
    function did_messages_change(mess_objs){
       //return !compare(mess_objs, window.active_messages);
       //onsole.log("did_messages_change got last_id_sum: ", window.localStorage.last_id_sum);
       var id_sum=0;
       for (i=0; i < mess_objs.length; i++){
        mess_obj=mess_objs[i].message; //unwrap the rails json generated extra layer.
        id_sum = id_sum + mess_obj.id;	
       }
       if("" + id_sum == window.localStorage.last_id_sum) return false; //no change
          else { window.localStorage.last_id_sum = "" + id_sum;
                 //onsole.log("did_messages_change changed, nmew last_id_sum: ", window.localStorage.last_id_sum);
                 return true;
          }
    }
	function remove_active_messages(){
		$(".MessageListContainer").remove();
	}
	
	window.add_to_unsent_instructions = function (instruction){
	    if(unsent_instructions === "") { unsent_instructions = instruction; }
	       else { unsent_instructions = unsent_instructions + ", " + instruction; }
	};
        
    window.format_phone = function (phone){
        return phone.substring(0,3) + " " +
               phone.substring(3,6) + " " +
               phone.substring(6, 10);
    };
    
    window.format_time = function (time){
        return time.replace(new RegExp("Eastern Standard Time", "g"), 'EST');
    };
        
     function createMessage(mess_obj) {
        //lert("Top of createmessage");
		mess_obj=mess_obj.message; //unwrap the rails json generated extra layer.
		//onsole.log("in createMessage with mess_obj: ", mess_obj);
		var body=mess_obj.text;
		var tableNum=mess_obj.table_code; //will change to table_name
        //phone number must have spaces after area code adn after exchange to display properly
        var age=mess_obj.age;
        var guest_phone_10_digit=mess_obj.guest_phone;
		var guest_phone=mess_obj.guest_phone.replace(new RegExp("\-", "g"), ' ');
        //lert("phone after dash processing: " + guest_phone + "  " + guest_phone.length == 10);
        if(guest_phone.length == 10) { //means no spaces which means there were no dashes in the original, so add in the spaces
          guest_phone=format_phone(guest_phone);
        }
        var message_id=mess_obj.id;
		//alert("cm  m-id" + message_id);
		var MessageScreen = $("#message_center > ul"),
			MessageListContainer = document.createElement("li"),
			MessageList          = document.createElement("ul"),
			MessageClose         = document.createElement("li"),
			MessageTable         = document.createElement("li"),
            MessageAge           = document.createElement("div"),
			MessageBody          = document.createElement("li"),
			MessagePhone         = document.createElement("li"),
            MessageResponse      = document.createElement("li"),
			MessageOther         = document.createElement("li"),
			MessageCloseLink     = document.createElement("a"),
			MessageTableLink     = document.createElement("a"),
			MessagePhoneLink     = document.createElement("a"),
			MessageResponseLink  = document.createElement("a"),
			MessageOtherLink     = document.createElement("a");
		//alert("mes close: " + MessageClose);		
        $(MessageListContainer).addClass("MessageListContainer"); //used by remove_active_messages
		$(MessageListContainer).attr("id", message_id);
		//$(MessageCloseLink).attr("name", mess_obj.id); //an "a" tag  works but storing as data is cleaner
		$(MessageCloseLink).data("message_id", message_id);
		$(MessageResponseLink).data("message_id", message_id); //for the reply
		$(MessageOtherLink).data("message_id", message_id); //for the reply
		
		//onsole.log("MessageCloseLink", MessageCloseLink);
		$(document).bind('mousedown', UICallbacks.stopFlashing).bind('touchstart', UICallbacks.stopFlashing);

		$(MessageCloseLink).attr("href", "#").text("X").bind('click', UICallbacks.closeButton);
		$(MessageClose).attr("class", "close").append( MessageCloseLink );
                //onsole.log("got from server tablenum: ", tableNum);
		/*var tl = $(MessageTableLink);
		tl.attr("href", "#");
		tl.text( tableNum);
		tl.bind('click', UICallbacks.FALSE);
        */
        $(MessageTableLink).attr("href", "#").text(tableNum).bind('click',
            function() { UICallbacks.get_messages_from_table(tableNum); });
		$(MessageTable).attr("class", "table").append( MessageTableLink );
        age = make_age_string(age);
        $(MessageAge).attr("class", "age").text(age);
        $(MessageTable).append(MessageAge);

		$(MessageResponseLink).attr("href", "#").text("be there").bind('click', UICallbacks.firstResponse);
		$(MessageResponse).attr("class", "response"); 
		$(MessageResponse).append( MessageResponseLink );
        if(window.is_sent_stamp_in_first_response(message_id)){
            $(MessageResponse).append($("#message_center .sent").clone().css('display', 'block')); //can't use "show"
        }

		$(MessageOtherLink).attr("href", "#").text("other").bind('click', UICallbacks.otherResponses);
		$(MessageOther).attr("class", "other_responses").append( MessageOtherLink );
        if(window.is_sent_stamp_in_other_response(message_id)){
            $(MessageOther).append($("#message_center .sent").clone().css('display', 'block')); //can't use "show"
        }

		$(MessageBody).attr("class", "message").text(body);
        $(MessagePhoneLink).attr("href", "#").text(guest_phone);
        $(MessagePhoneLink).attr("onClick", "UICallbacks.get_messages_from_phone('" + guest_phone_10_digit + "');");
		
		$(MessagePhone).attr("class", "phone").append(MessagePhoneLink);
        
        
		$(MessageList).append(MessageClose); 
		$(MessageList).append( MessageTable );
		$(MessageList).append( MessageBody);
		$(MessageList).append( MessagePhone);
		
		$(MessageList).append( MessageResponse );
		$(MessageList).append( MessageOther ); 
		$(MessageListContainer).append( MessageList );
		$(MessageScreen).append( MessageListContainer );
		$(MessageClose).data("message_id", mess_obj.id);
		return true;
	}
    
    function make_age_string(age){
           if      (age >= 10080) return "7+ days";
           else if (age >= 2880)  return (age/1440).toFixed() + " days";
           else if (age >= 1440)  return "1 day";
           else if (age >= 120)   return (age/60).toFixed() + " hours";
           else if (age >= 60)    return "1 hour";
           else if (age >= 1)     return age + " min";
           else                   return ""; 
    }
    
    function remove_deleted_messages(mess_objs){
        $(".MessageListContainer").each(function (mess_lc) {
            var message_id = mess_lc.attr("id");
            if(!(message_in_mess_objs(mess_objs, message_id))){
                mess.lc.remove();
            }
        });
    }
    
    function message_in_mess_objs(mess_objs, message_id){
        for (i=0; i < mess_objs.length; i++) {
		       var obj_message_id=mess_objs[i].id;
               if(message_id == obj_message_id) return true;
		    }
        return false;
    }
    
    function update_ages(mess_objs){
        //alert("top of update_ages with mess length: " + mess_objs.length);
       for (i=0; i < mess_objs.length; i++) {
               var mess_obj = mess_objs[i].message;
               //alert("got mess_obj: " + mess_obj);
		       var obj_message_id = mess_obj.id;
               //alert("got obj mess id: " + obj_message_id);
               var int_age = mess_obj.age;
               //alert("int_age: " + int_age);
               var new_age = make_age_string(int_age);
               //alert("In update_ages with id: " + obj_message_id +
               //      " int age: "               + int_age +
               //      " string_age: "            + new_age);
             $("#" + obj_message_id + " .age").text(new_age);  
		    } 
    }
    
    window.get_blocked_phones = function (){
        $.ajax({
		type: 'POST',
		url: '/service/get_blocked_phones',
		dataType: 'json',
		success: got_blocked_phones,
	  	error: window.show_network_down
        });
    };
    
    function got_blocked_phones(phones){
        //phones = [["6171234567", "12:34pm"], ["6179876543", "4:56pm"]];
        window.hide_network_down();
        $("#blocked_phones_tbody > tr").remove();
        var a_tbody = $("#blocked_phones_tbody");
        var a_tr=$(document.createElement("tr"));
        a_tr.append('<td class="blocked_phones_header_items">Unblock</td>');
        a_tr.append('<td class="blocked_phones_header_items">Time-Blocked</td>');
        a_tr.append('<td class="blocked_phones_header_items">How-Blocked</td>');
        a_tr.append('<td class="blocked_phones_header_items">Phone</td>');
        a_tbody.append(a_tr);
        for (i=0; i < phones.length; i++) {
            var a_phone=phones[i];
            var a_tr=$(document.createElement("tr"));
            a_tr.append('<td class="unblock_phone_button"' +
                            'onclick="unblock_phone(\'' + a_phone[2] +
                            '\');">Unblock</td>');
            a_tr.append('<td class="blocked_phones_items">' + window.format_time(a_phone[0])  + '</td>');
            a_tr.append('<td class="blocked_phones_items">' + ((a_phone[1] == "autoblocked") ? "automatic" : "manual")
                                                               + '</td>');
            a_tr.append('<td class="blocked_phones_items">' + window.format_phone(a_phone[2]) + '</td>');
            
            //alert("before tbody append, length is: " + a_tbody.length);
            a_tbody.append(a_tr); //has no effect
            //alert("bottom of loop with tbody length " + a_tbody.length);
		}
    }
    window.unblock_phone = function(a_phone){
        //alert("top of js window.unblock_phone with: " + a_phone);
        $.ajax({
		type: 'POST',
		url: '/service/unblock_phone',
		dataType: 'json',
        data: {'guest_phone': a_phone},
		success: got_blocked_phones,
	  	error: window.show_network_down
        });
    };
    window.get_recent_messages = function (){
        $.ajax({
		type: 'POST',
		url: '/service/get_recent_messages',
        data: {'count': 15},
		dataType: 'json',
		success: window.got_recent_messages,
	  	error: window.show_network_down
        });
    };
    
    window.got_recent_messages = function (messages){
        window.hide_network_down();
        $("#recent_messages_tbody > tr").remove();
        var a_tbody = $("#recent_messages_tbody");
        var a_tr=$(document.createElement("tr"));
        a_tr.append('<td class="recent_message_header_items"></td>');
        a_tr.append('<td class="recent_message_header_items">Time</td>');
        a_tr.append('<td class="recent_message_header_items">Status</td>');
        a_tr.append('<td class="recent_message_header_items">Table</td>');
        a_tr.append('<td class="recent_message_header_items">Phone</td>');
        a_tr.append('<td class="recent_message_header_items">Message</td>');
        var active_color="color:#99CCFF;"; //light blue
        var reply_color="color:#d6f;";      //purple
        var closed_color="color:#FF6666;"; // red
        var the_color="";
        a_tbody.append(a_tr);
        for (i=0; i < messages.length; i++) {  
            var message=messages[i];
            var a_tr=$(document.createElement("tr"));
            var the_status=message[1];
            var reopen_button = "";
            if     (the_status == "active") { the_color = active_color; }
            else if(the_status == "reply")  { the_color = reply_color;  }
            else                            { the_color = closed_color;
                                              reopen_button =
                    '<button onclick="get_reopen_message(\'' + message[5] + '\');">Reopen</button>';
                                             }                          
            var the_style = "white-space:nowrap; " + the_color;
            a_tr.append('<td>' + reopen_button + '</td>');
            a_tr.append('<td class="recent_messages_items" style="' + the_style + '">' + window.format_time(message[0])  + '</td>');
            a_tr.append('<td class="recent_messages_items" style="' + the_style + '">' + the_status                      + '</td>');
            a_tr.append('<td class="recent_messages_items" style="' + the_style + '">' + message[2]                      + '</td>');
            a_tr.append('<td class="recent_messages_items" style="' + the_style + '">' + window.format_phone(message[3]) + '</td>');
            a_tr.append('<td class="recent_messages_items" style="' + the_color + '">' + message[4]                      + '</td>'); 
            a_tbody.append(a_tr); 
            }
    }
    window.get_reopen_message = function(message_id){
        $.ajax({
		type: 'POST',
		url: '/service/get_reopen_message',
        data: {'message_id': message_id},
		dataType: 'json',
		success: window.got_recent_messages,
	  	error: window.show_network_down
        });
    };
    window.refresh_page = function (){ //because browser haave memory leaks
        location.reload(true);
    };
    window.before_first_poll = true;
    setTimeout(window.refresh_page, (1000 * 60));
    //got_all_messages($.parseJSON(test_mess_src)); //for testing
    get_all_messages(); //do it the first time without delay
    setInterval(get_all_messages,7000); //do it after 7 seconds, and every 7 seconds after that.
    
});
