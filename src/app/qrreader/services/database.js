// Import SQLite
import SQLite from 'react-native-sqlite-storage';

// Enable debug mode for SQLite
// TODO remove when everything with db works fine
SQLite.DEBUG(true);
SQLite.enablePromise(true);

// Function to initialize the database
const initializeDatabase = async () => {
    try {
        // Open the database
        const db = await SQLite.openDatabase({ name: 'myDatabase.db', location: 'default' });
        
        // Check if a table exists (example: 'users' table)
        const tableExists = await new Promise((resolve, reject) => {
            console.log("Checking table existence");
            db.transaction(tx => {
                console.log("Transaction started");
                tx.executeSql(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name='users';",
                    [],
                    (tx, result) => {
                        console.log("Table existence check result:", result);
                        resolve(result.rows.length > 0);
                    },
                    error => {
                        console.error("Error checking table existence:", error);
                        reject(error);
                    }
                );
            }, (transactionError) => {
                console.error("Transaction error:", transactionError);
                reject(transactionError);
            }, () => {
                console.log("Transaction complete");
            });
        });

        console.log("Table exists:", tableExists);
        
        if (!tableExists) {
            // Create tables if they do not exist
            await new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql(
                        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER);',
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

const addRandomEntry = async (db) => {
    const randomName = `User${Math.floor(Math.random() * 1000)}`;
    const randomAge = Math.floor(Math.random() * 100);
    
    await new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO users (name, age) VALUES (?, ?);',
                [randomName, randomAge],
                () => resolve(),
                error => reject(error)
            );
        });
    });
};

const removeAllEntries = async (db) => {
    await new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM users;',
                [],
                () => resolve(),
                error => reject(error)
            );
        });
    });
};

const getAllEntries = async (db) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM users;',
                [],
                (tx, results) => {
                    const rows = [];
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
const closeDatabase = async (db) => {
    if (db) {
        try {
            await db.close();
            console.log("Database closed.");
        } catch (error) {
            console.error("Error closing database:", error);
        }
    }
};

export { initializeDatabase, closeDatabase, addRandomEntry, removeAllEntries, getAllEntries };