import sqlite3


conn = sqlite3.connect("sih26093.db")

columns = conn.execute(
    "PRAGMA table_info(chat_sessions)"
).fetchall()

column_names = [
    column[1]
    for column in columns
]

if "downgrade_streak" not in column_names:

    conn.execute(
        """
        ALTER TABLE chat_sessions
        ADD COLUMN downgrade_streak INTEGER NOT NULL DEFAULT 0
        """
    )

    conn.commit()

    print("downgrade_streak column added.")

else:
    print("downgrade_streak column already exists.")

conn.close()