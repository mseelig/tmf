class AddFieldsToClient < ActiveRecord::Migration
  def self.up
    add_column :clients, :status, :string
    add_column :clients, :last_polled, :datetime
    add_column :clients, :session_id, :string
  end

  def self.down
    remove_column :clients, :session_id
    remove_column :clients, :last_polled
    remove_column :clients, :status
  end
end
