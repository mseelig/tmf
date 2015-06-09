class CreateClients < ActiveRecord::Migration
  def self.up
    create_table :clients do |t|
      t.string :client_name
      t.string :client_code
      t.string :restaurant_phone
      t.string :restaurant_code

      t.timestamps
    end
  end

  def self.down
    drop_table :clients
  end
end
