class CreatePhonemaps < ActiveRecord::Migration
  def self.up
    create_table :phonemaps do |t|
      t.string :guest_phone
      t.string :restaurant_code

      t.timestamps
    end
  end

  def self.down
    drop_table :phonemaps
  end
end
