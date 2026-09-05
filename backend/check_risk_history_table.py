import sqlite3

conn = sqlite3.connect("sih26093.db")

result = conn.execute(
    "SELECT name FROM sqlite_master "
    "WHERE type='table' AND name='risk_assessment_history'"
).fetchone()

print(result)

conn.close()