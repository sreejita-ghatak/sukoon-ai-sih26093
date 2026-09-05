import sqlite3

conn = sqlite3.connect("sih26093.db")

conn.execute("""
ALTER TABLE chat_sessions
ADD COLUMN case_status VARCHAR(20) NOT NULL DEFAULT 'NEW'
""")

conn.commit()
conn.close()

print("case_status migration done")