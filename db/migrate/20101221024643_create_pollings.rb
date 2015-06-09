class CreatePollings < ActiveRecord::Migration
  def self.up
    create_table :pollings do |t|
      t.string :session_id
      t.string :restaurant_code
      t.string :status
      t.datetime :last_polled

      t.timestamps
    end
  end

  def self.down
    drop_table :pollings
  end
end
