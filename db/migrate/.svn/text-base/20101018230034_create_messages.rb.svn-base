class CreateMessages < ActiveRecord::Migration
  def self.up
    create_table :messages do |t|
      t.string :restaurant_code
      t.string :status
      t.integer :age
      t.integer :table_code
      t.string :text
      t.string :guest_phone

      t.timestamps
    end
  end

  def self.down
    drop_table :messages
  end
end
