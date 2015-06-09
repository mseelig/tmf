class AddTimeZoneToRestaurant < ActiveRecord::Migration
  def self.up
    add_column :restaurants, :time_zone, :string
  end

  def self.down
    remove_column :restaurants, :time_zone
  end
end
