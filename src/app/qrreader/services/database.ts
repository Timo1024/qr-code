// Import SQLite
import SQLite from 'react-native-sqlite-storage';

// Enable debug mode for SQLite
// TODO remove when everything with db works fine
SQLite.DEBUG(true);
SQLite.enablePromise(true);

interface Codes {
    id: number;
    date: string;
    topic: string;
    title: string;
    subtitle: string;
    description: string;
    additional: string;
}

// Function to initialize the database
const initializeDatabase = async () => {
    try {
        // Open the database
        const db = await SQLite.openDatabase({ name: 'myDatabase.db', location: 'default' });
        
        // Check if a table exists (example: 'users' table)
        const tableExists = await new Promise((resolve, reject) => {
            // console.log("Checking table existence");
            db.transaction(tx => {
                // console.log("Transaction started");
                tx.executeSql(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name='codes';",
                    [],
                    (tx, result) => {
                        // console.log("Table existence check result:", result);
                        resolve(result.rows.length > 0);
                    },
                    error => {
                        // console.error("Error checking table existence:", error);
                        reject(error);
                    }
                );
            }, (transactionError) => {
                // console.error("Transaction error:", transactionError);
                reject(transactionError);
            }, () => {
                // console.log("Transaction complete");
            });
        });

        // console.log("Table exists:", tableExists);
        
        if (!tableExists) {
            // Create tables if they do not exist
            await new Promise<void>((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql(
                        'CREATE TABLE IF NOT EXISTS codes (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, topic TEXT, title TEXT, subtitle TEXT, description TEXT NOT NULL, additional TEXT);',
                        [],
                        () => {
                            resolve();
                        },
                        error => {
                            reject(error);
                        }
                    );
                });
            });
        }
        
        return db;
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};

const addEntry = async (
    db: SQLite.SQLiteDatabase, 
    topic : string | null = null, 
    title : string | null = null, 
    subtitle : string | null = null, 
    description : string = "no description", 
    additional : string | null = null) => {
    var date = new Date().toISOString();
    if(!date){
        date = "no date";
    }

    logTableColumns(db, 'codes');
    
    await new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO codes (date, topic, title, subtitle, description, additional) VALUES (?, ?, ?, ?, ?, ?);',
                [date, topic, title, subtitle, description, additional],
                () => resolve(),
                error => reject(error)
            );
        });
    });
};

const removeAllEntries = async (db: SQLite.SQLiteDatabase) => {
    await new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM codes;',
                [],
                () => resolve(),
                error => reject(error)
            );
        });
    });
};

const getAllEntries = async (db: SQLite.SQLiteDatabase) => {
    return new Promise<Codes[]>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM codes;',
                [],
                (tx, results) => {
                    const rows : Codes[] = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        rows.push(results.rows.item(i));
                    }
                    resolve(rows);
                },
                error => reject(error)
            );
        });
    });
};

// Function to close the database
const closeDatabase = async (db: SQLite.SQLiteDatabase | undefined) => {
    if (db) {
        try {
            await db.close();
            console.log("Database closed.");
        } catch (error) {
            console.error("Error closing database:", error);
        }
    }
};

// TODO remove when finished logging
const logTableColumns = async (db: SQLite.SQLiteDatabase, tableName: string) => {
    await new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `PRAGMA table_info(${tableName});`,
                [],
                (_, result) => {
                    console.log(`Columns in ${tableName}:`);
                    let rows = result.rows;
                    for (let i = 0; i < rows.length; i++) {
                        console.log(rows.item(i));
                    }
                    resolve();
                },
                error => {
                    console.error(`Error fetching columns for table ${tableName}:`, error);
                    reject(error);
                }
            );
        });
    });
};

export { initializeDatabase, closeDatabase, addEntry, removeAllEntries, getAllEntries };