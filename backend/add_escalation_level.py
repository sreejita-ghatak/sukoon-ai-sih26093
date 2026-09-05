import sqlite3

conn = sqlite3.connect("sih26093.db")

conn.execute("""
ALTER TABLE chat_sessions
ADD COLUMN escalation_level VARCHAR(20) NOT NULL DEFAULT 'MONITOR'
""")

conn.commit()
conn.close()

print("escalation_level migration done")