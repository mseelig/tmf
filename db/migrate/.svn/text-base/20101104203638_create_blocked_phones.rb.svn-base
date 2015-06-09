class CreateBlockedPhones < ActiveRecord::Migration
  def self.up
    create_table :blocked_phones do |t|
      t.string :guest_phone
      t.string :restaurant_code
      t.string :status

      t.timestamps
    end
  end

  def self.down
    drop_table :blocked_phones
  end
end
