class AddPhoneNumberToRestaurantCustomizations < ActiveRecord::Migration
  def self.up
    add_column :restaurant_customizations, :restaurant_phone, :string
  end

  def self.down
    remove_column :restaurant_customizations, :restaurant_phone
  end
end
