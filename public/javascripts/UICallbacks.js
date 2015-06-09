var UICallbacks = {
	/*THis hairy method handles "undo" nad the rebinding of the close button function,
	 but we dicided all this hair wasn't worth it esp including server interaction so below
	 is a much simpler implementation.
	 closeButton : function() { // called when the close button is clicked
                //this is the "a" tag that the user clicked on.
		//closeParent is a UL tag.
		var closeButton = $(this), closeParent = $(this.parentNode.parentNode), maxWidth;
        // fit the close button with the word 'undo'
		maxWidth = parseFloat($(this).css("max-width").pxToEm({ 'scope' : this }), 10) * 2 + "em";
		closeButton.css({"font-size" : ".5em", "max-width" : maxWidth, "height" : "70%", "padding" : "20% 0"}).text("undo");

		closeParent.children("li:not(.close)").css("color" , "#888").children("a").css("color" , "#888");

		closeButton.bind('click', function() {

			closeParent.clearQueue().stop(true, true); // stop the animation from happening
			closeButton.text("X").attr("style",""); // change the button back to a close button

			// reset the color of the row to white
			closeParent.children("li").css("color","#fff").children("a").css("color","#fff");

			closeButton.bind('click', UICallbacks.closeButton); // rebind closeButton function
			return false;

		});

		closeParent.bind('click', function() {

			closeButton.bind('click', UICallbacks.closeButton); // rebind closebutton

		}).delay(5000).hide(2000, function() {
			console.log("top of remove button this: ", this);
			closeParent.remove(); // remove the entire row from the DOM
			
			var message_id=$(this).first().data("message_id");
			add_to_unsent_instructions('{"type":"close_message", "id":' +
						   message_id + '}');
                       
		});

		return false;
	},*/
    message_center_to_system_menu : function(){
       $("#message_center").fadeOut(600, function(){$("#main").fadeIn(600);});     
    },
    system_menu_to_message_center : function(){
        $("#main").fadeOut(600, function(){$("#message_center").fadeIn(600)});   
    },
    other_replies_to_message_center : function(){
        $("#other_replies").fadeOut(600, function(){$("#message_center").fadeIn(600)});   
    },
    system_menu_to_blocked_phones : function(){
        $("#main").fadeOut(0, function(){$("#blocked_phones").fadeIn(0)});
        window.get_blocked_phones();
    },
    blocked_phones_to_message_center : function(){
        $("#blocked_phones").fadeOut(0, function(){$("#message_center").fadeTo(600, 1)});   
    },
    messages_from_table_to_message_center : function(){
        $("#messages_from_table").fadeOut(600, function(){$("#message_center").fadeIn(600)});   
    },
    messages_from_phone_to_message_center : function(){
        $("#messages_from_phone").fadeOut(600, function(){$("#message_center").fadeIn(600)});   
    },
    system_menu_to_recent_messages : function(){
        $("#main").fadeOut(0, function(){$("#recent_messages").fadeIn(0)});
        window.get_recent_messages();
    },
    recent_messages_to_message_center : function(){
        $("#recent_messages").fadeOut(0, function(){$("#message_center").fadeTo(600,1)});   
    },
	closeButton : function(){  //this is an "a" tag.
	  //console.log("in cb with this: ", this);
	  var closeButton = $(this);
	  //console.log("in cb with cbutton: ", closeButton, closeButton.data("message_id"));
	  var closeParent = $(this.parentNode.parentNode);
	  //var message_id=closeButton.data("message_id"); //must se this var here and close over it , see below
	  var message_id=$(this).closest('[id]').attr("id");
      var instruction='{"type":"close_message", "id":' + message_id +'}';
        //put before the slideUp so that it will be more likely to be in the next poll instructions.
	  window.add_to_unsent_instructions(instruction);					      
	  closeParent.slideUp(500, function() { closeParent.remove()});
      window.localStorage.last_id_sum=window.localStorage.last_id_sum - parseInt(message_id);
	  /*closeParent.slideUp(500, function(){
	      closeParent.remove(); // remove the entire row from the DOM
	      //var message_id=closeButton.data("message_id"); fails really badly, ie even though I can close over
	      //closeParent and it works fine and I can close ove closeButton and I get the jq wrapper ob BUT calling data("message_id"( yield sundefined.
	      //so I have to clowse over message_id instead. THis is a really subtler bad bad bug in jquery data
	      //console.log("in cb callback with Closebutton: ", closeButton);
	      window.add_to_unsent_instructions('{"type":"close_message", "message_id":' +
					           message_id +
					        '}');
	  });*/
	},
    get_messages_from_table : function(table){
        window.current_table=table;
        $("#message_center").fadeOut(600, function(){$("#messages_from_table").fadeIn(600)});
        $.ajax({
		type: 'POST',
		url: '/service/get_messages_from_table',
        data: {'table': table},
		dataType: 'json',
		success: UICallbacks.got_messages_from_table,
	  	error: window.show_network_down
        });
    },
    got_messages_from_table : function(messages){
        window.hide_network_down();
        $('#messages_from_table_table').text(window.current_table);
        $("#messages_from_table_tbody > tr").remove();
        var a_tbody = $("#messages_from_table_tbody");
        var a_tr=$(document.createElement("tr"));
        a_tr.append('<td class="messages_from_table_header_items">Time</td>');
        a_tr.append('<td class="messages_from_table_header_items">Status</td>');
        a_tr.append('<td class="messages_from_table_header_items">Table</td>');
        a_tr.append('<td class="messages_from_table_header_items">Phone</td>');
        a_tr.append('<td class="messages_from_table_header_items">Message</td>');
        a_tbody.append(a_tr);
        for (i=0; i < messages.length; i++) {  
            var message=messages[i];
            var a_tr=$(document.createElement("tr"));
            a_tr.append('<td class="messages_from_table_items" style="white-space:nowrap;">' + window.format_time(message[0])  + '</td>');
            a_tr.append('<td class="messages_from_table_items" style="white-space:nowrap;">' + message[1]                      + '</td>');
            a_tr.append('<td class="messages_from_table_items" style="white-space:nowrap;">' + message[2]                      + '</td>');
            a_tr.append('<td class="messages_from_table_items" style="white-space:nowrap;">' + window.format_phone(message[3]) + '</td>');
            a_tr.append('<td class="messages_from_table_items" style="white-space:normal;">' + message[4]                      + '</td>'); 
            a_tbody.append(a_tr); 
            }
    },
    get_messages_from_phone : function(guest_phone){
        window.current_guest_phone=guest_phone;
        $("#message_center").fadeOut(600, function(){$("#messages_from_phone").fadeIn(600)});
        $.ajax({
		type: 'POST',
		url: '/service/get_messages_from_phone',
        data: {'guest_phone': guest_phone},
		dataType: 'json',
		success: UICallbacks.got_messages_from_phone,
	  	error: window.show_network_down
        });
    },
    got_messages_from_phone : function(messages){
        window.hide_network_down();
        $('#messages_from_phone_phone').text(window.format_phone(window.current_guest_phone));
        $("#messages_from_phone_tbody > tr").remove();
        var a_tbody = $("#messages_from_phone_tbody");
        var a_tr=$(document.createElement("tr"));
        a_tr.append('<td class="messages_from_phone_header_items">Time</td>');
        a_tr.append('<td class="messages_from_phone_header_items">Status</td>');
        a_tr.append('<td class="messages_from_phone_header_items">Table</td>');
        a_tr.append('<td class="messages_from_phone_header_items">Phone</td>');
        a_tr.append('<td class="messages_from_phone_header_items">Message</td>');
        a_tbody.append(a_tr);
        for (var i=0; i < messages.length; i++) {  
            var message=messages[i];
            a_tr=$(document.createElement("tr"));
            a_tr.append('<td class="messages_from_phone_items" style="white-space:nowrap;">' + window.format_time(message[0])  + '</td>');
            a_tr.append('<td class="messages_from_phone_items" style="white-space:nowrap;">' + message[1]                      + '</td>');
            a_tr.append('<td class="messages_from_phone_items" style="white-space:nowrap;">' + message[2]                      + '</td>');
            a_tr.append('<td class="messages_from_phone_items" style="white-space:nowrap;">' + window.format_phone(message[3]) + '</td>');
            a_tr.append('<td class="messages_from_phone_items" style="white-space:normal;">' + message[4]                      + '</td>'); 
            a_tbody.append(a_tr); 
            }
    },
    
	firstResponse  : function() {
		var message_id=$(this).data("message_id");
		var instruction='{"type":"send_reply", "id":' +
					           message_id +
				', "text":"' + "We received your message and will be right with you." +
				'"}'
		window.add_to_unsent_instructions(instruction);
        window.add_sent_stamp_to_first_response(message_id);
		//onsole.log(this);
        var mess_elt = document.getElementById(message_id);
        var mess_elt_response_jq = $(mess_elt).find('.response');
        UICallbacks.appendSentStamp(mess_elt_response_jq);
        //UICallbacks.appendSentStamp($(("#" + message_id) .response));
		//UICallbacks.appendSentStamp( $("header > ul > li:eq("+respondingToID+") > ul > li.response > a").get(0) );	
	    //UICallbacks.appendSentStamp( this);
	},
	otherResponses : function() { // called when the other responses button is clicked
		//this is an a tag with data of message_id
		//console.log("otherReponsises this", this);
        
		window.current_message_id= $(this).data("message_id");
        //alert("other responses got messID: " + window.current_message_id);
        if((typeof window.current_message_id) === "undefined") {
            window.current_message_id= $(this).prev().data("message_id");
            //alert("other responses modified messid " + window.current_message_id);   
        }
		//arguments.callee.other_replies = (!arguments.callee.other_replies) ? $('#other_replies') : arguments.callee.other_replies;
		//arguments.callee.other_replies.data("index", $(this.parentNode.parentNode.parentNode).index());
		//var other_reps = arguments.callee.other_replies;
        //$("#message_center").fadeOut(600, function(){$(other_reps).fadeIn(600)});
        $("#message_center").fadeOut(600, function(){$('#other_replies').fadeIn(600)}); 
        //arguments.callee.other_replies.show();
		return false;

	},
	/*close_other_replies : function() { // called to hide the other_replies

		arguments.callee.other_replies = (!arguments.callee.other_replies) ? $('#other_replies') : arguments.callee.other_replies;
		arguments.callee.other_replies.hide();
		return false;

	},*/
	chooseResponse : function(event) { // called when one of the other responses is chosen
                //this is way up the tree and basically useless.
		// the index of the message that we are responding to
		//console.log("in chooseReponse: ", event.target);
		//console.log("top of chooseReponse with closest id: ", $(event.target).closest('[id]').attr('id'));
		var respondingToID = $(this.parentNode.parentNode.parentNode.parentNode).data("index"),
			target = event.target, // the element being clicked
			column = $(target.parentNode.parentNode.parentNode.parentNode).index(), // which column was clicked
			row = $(target.parentNode.parentNode).index(), // which row was clicked
			respondingTo = $("header > ul > li:eq(" + respondingToID  + ") > ul"),
			respondingText = respondingTo.children('li.message').text(); //this is the text of the message that the geust sent
		//console.log("this", this);
		//console.log("target", target); //either the li that has text of the short reply label or
		                               //the li whose text is the full label
		var li_node_of_reply = $(target).parent().children()[1];
		var reply_text = $(li_node_of_reply).text();
		reply_text=reply_text.replace('"the msg"', respondingText);
		var message_id=window.current_message_id;
		var instruction='{"type":"send_reply", "id":' +
					           message_id +
				', "text":"' + reply_text +
				'"}'
		window.add_to_unsent_instructions(instruction);	
		//UICallbacks.close_other_replies(); // hide the other_replies
        window.add_sent_stamp_to_other_response(message_id);
        UICallbacks.other_replies_to_message_center();
        
		// append the SENT stamp over response button
        UICallbacks.appendSentStamp($(document.getElementById(message_id)).find('.other_responses'));
        //UICallbacks.appendSentStamp($(("#" + message_id) .other_responses));
		//UICallbacks.appendSentStamp( $("header > ul > li:eq(" +
		//			      respondingToID +
		//			      ") > ul > li.other_responses > a").get(0) );
		return false;
	},
	appendSentStamp : function(response_jq) { // called to append the SENT stamp to a button
        //alert("top of appendSentStamp");
        var last_child=response_jq.children().slice(-1);
        //alert("last child: " + last_child);
        //alert("has sent: " + last_child.hasClass("sent"));
        if(last_child.hasClass("sent") === false) {
           var new_sent = $("#message_center .sent").clone();
           new_sent.data("message_id", last_child.data("message_id"));
           response_jq.append(new_sent.css('display', 'block')); //show fails because stupidly, show is designed to 'restore the previous state', and if that's 'none' then the result is display:none. 
		  //new_sent.attr("onclick", "UICallbacks.otherResponses()"); //doesn't work
        }
        return false;
	},
	FALSE : function() { // used to prevent url change when a link is clicked
		return false;
	},
	quit : function() {
		window.close(); // close the window
		return false;
	},
    resizeWindows : function() {
       UICallbacks.resizeWindowMain();
       UICallbacks.resizeWindowMessageCenter();
    },
	resizeWindowMain : function() { // resize body font size to fit any window	
		arguments.callee.body = (!arguments.callee.body) ? $('body') : arguments.callee.body;
		// set the body font based on window dimensions
		arguments.callee.body.css({ "font-size" : parseFloat(arguments.callee.body.css("font-size").pxToEm({ scope : $("body").get(0) }), 10) * ( parseFloat(arguments.callee.body.width(), 10) / 1280 ) + "em" });
	},
	resizeWindowMessageCenter : function() {
        $("#message_center_content").css("height", $(window).height() -
                                           $("#message_center > header").height() -
                                           ($("#footer_center_button").height() * 3)
                                           - 10); //the 10 is bottom border
		// set the height of all lists rows to fix CSS Gradients
		$("#message_center_content > li > ul > li").each(function(index, value) {
			$(value).css("height", $(value).children(".message").css("height"));
		});
	},
	startFlashing : function() {
        if ( window.FlashInterval ) { clearInterval( window.FlashInterval ); }
		window.FlashInterval = setInterval(function() {
			/*if ( $("#new_message_alert").css("display") === "none" ) {
				$("#new_message_alert").fadeIn(600);
				//$("#new_message_alert").css("display", "block");
			} else {$("#new_message_alert").fadeOut(600);
				//$("#new_message_alert").css("display", "none");
			}*/
            //$("#new_message_alert").css("display", "block");
			$("#new_message_alert").fadeTo(600, 1.0);
			$("#new_message_alert").fadeTo(600, 0.3);			
		}, 1200);
	},
	stopFlashing : function() {
		clearInterval( window.FlashInterval );
		$("#new_message_alert").css("display", "none");
		$(document).unbind('mousedown');
	}
};

