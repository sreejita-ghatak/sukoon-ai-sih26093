import sqlite3

conn = sqlite3.connect("sih26093.db")

conn.execute("""
ALTER TABLE chat_sessions
ADD COLUMN risk_assessment_consent BOOLEAN NOT NULL DEFAULT 0
""")

conn.commit()
conn.close()

print("risk_assessment_consent migration done")