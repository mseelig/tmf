class CreatePollingHistories < ActiveRecord::Migration
  def self.up
    create_table :polling_histories do |t|
      t.string :session_id
      t.string :restaurant_code
      t.string :status
      t.datetime :last_polled

      t.timestamps
    end
  end

  def self.down
    drop_table :polling_histories
  end
end
