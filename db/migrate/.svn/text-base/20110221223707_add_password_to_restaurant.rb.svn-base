class AddPasswordToRestaurant < ActiveRecord::Migration
  def self.up
    add_column :restaurants, :username, :string
    add_column :restaurants, :password, :string
  end

  def self.down
    remove_column :restaurants, :password
    remove_column :restaurants, :username
  end
end
