# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_tmf_session',
  :secret      => '53ce44801ed6006810ff8d1768a47054e359e70b66e1eefbb7ac6934364b901b2fc4489d6a541691383bee8faa53e53b9e10dad26a84b82442220f59c625ed1d',
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
#ActionController::Base.session_store = :active_record_store
