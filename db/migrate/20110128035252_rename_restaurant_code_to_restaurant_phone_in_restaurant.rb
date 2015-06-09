class RenameRestaurantCodeToRestaurantPhoneInRestaurant < ActiveRecord::Migration  
  def self.up
    rename_column :restaurants, :restaurant_code, :restaurant_phone
  end

  def self.down
     rename_column :restaurants, :restaurant_phone, :restaurant_code
  end
end
