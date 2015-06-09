class ChangeOtherRepliesHtmlInRestaurantCustomizationsToText < ActiveRecord::Migration
  def self.up
    change_table :restaurant_customizations do |t|
      t.change :other_replies_html, :text
    end
  end

  def self.down
    change_table :restaurant_customizations do |t|
      t.change :other_replies_html, :string
    end
  end
end
