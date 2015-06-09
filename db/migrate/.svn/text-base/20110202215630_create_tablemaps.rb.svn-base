class CreateTablemaps < ActiveRecord::Migration
  def self.up
    create_table :tablemaps do |t|
      t.string :restaurant_phone
      t.string :table_code
      t.string :restaurant_code
      t.integer :seats

      t.timestamps
    end
  end

  def self.down
    drop_table :tablemaps
  end
end
