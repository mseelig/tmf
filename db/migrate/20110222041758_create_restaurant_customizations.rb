class CreateRestaurantCustomizations < ActiveRecord::Migration
  def self.up
    create_table :restaurant_customizations do |t|
      t.string :close_label
      t.string :table_label
      t.string :message_label
      t.string :phone_label
      t.string :reply_label
      t.string :other_replies_label
      t.string :other_replies_html
      t.string :time_label
      t.string :status_label
      t.string :unblock_label
      t.string :time_blocked_label
      t.string :how_blocked_label
      t.string :message_center_label
      t.string :system_menu_label
      t.string :recent_messages_label
      t.string :blocked_phones_label
      t.string :send_promo_label
      t.string :send_reply_label
      t.string :system_menu_text1
      t.string :system_menu_text2
      t.string :be_there_label
      t.string :other_label
      t.string :days_label
      t.string :day_label
      t.string :hours_label
      t.string :hour_label
      t.string :min_label
      t.string :network_down_label

      t.timestamps
    end
  end

  def self.down
    drop_table :restaurant_customizations
  end
end
