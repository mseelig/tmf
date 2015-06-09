class AddTableNameToMessage < ActiveRecord::Migration
  def self.up
    add_column :messages, :table_name, :string
  end

  def self.down
    remove_column :messages, :table_name
  end
end
