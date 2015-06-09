class CreateRestaurants < ActiveRecord::Migration
  def self.up
    create_table :restaurants do |t|
      t.string :restaurant_code
      t.string :restaurant_name

      t.timestamps
    end
  end

  def self.down
    drop_table :restaurants
  end
end
