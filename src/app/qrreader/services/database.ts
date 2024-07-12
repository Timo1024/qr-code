// Import SQLite
import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

// Enable debug mode for SQLite
// TODO remove when everything with db works fine
SQLite.DEBUG(true);
SQLite.enablePromise(true);

interface Codes {
    id: number;
    reference: string;
    date: string;
    topic: string;
    title: string;
    subtitle: string;
    description: string;
    additional: string;
    tags: string;
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
                        'CREATE TABLE IF NOT EXISTS codes (id INTEGER PRIMARY KEY AUTOINCREMENT, reference TEXT, date TEXT NOT NULL, topic TEXT, title TEXT, subtitle TEXT, description TEXT NOT NULL, additional TEXT, tags TEXT);',
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
    reference : string | null = null,
    topic : string | null = null, 
    title : string | null = null, 
    subtitle : string | null = null, 
    description : string = "no description", 
    additional : string | null = null,
    tags : string | null = null) => {
    var date = new Date().toISOString();
    if(!date){
        date = "no date";
    }
    
    logTableColumns(db, 'codes');
    
    await new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO codes (reference, date, topic, title, subtitle, description, additional, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
                [reference, date, topic, title, subtitle, description, additional, tags],
                () => resolve(),
                error => reject(error)
            );
        });
    });
};

const deleteEntry = async (db: SQLite.SQLiteDatabase, id: number) => {
    await new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM codes WHERE id = ?;',
                [id],
                () => resolve(),
                error => reject(error)
            );
        });
    });
}

const updateDB = async (
    db: SQLite.SQLiteDatabase, 
    id: number, 
    reference : string | null = null, 
    topic : string | null = null, 
    title : string | null = null, 
    subtitle : string | null = null, 
    description : string = "no description", 
    additional : string | null = null, 
    tags : string | null = null) => {
    await new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE codes SET reference = ?, topic = ?, title = ?, subtitle = ?, description = ?, additional = ?, tags = ? WHERE id = ?;',
                [reference, topic, title, subtitle, description, additional, tags, id],
                () => resolve(),
                error => reject(error)
            );
        });
    });
}

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

const getFilteredEntries = async (db: SQLite.SQLiteDatabase, search:string, option:string) => {


    option = option.toLowerCase();

    if(!option){
        option = "all";
    }
    if(!search){
        search = "";
    }

    // if option == "All" then search for column topic, title, subtitle, description, additional, tags
    if(option == "all") {
        return new Promise<Codes[]>((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM codes WHERE topic LIKE '%${search}%' OR title LIKE '%${search}%' OR subtitle LIKE '%${search}%' OR description LIKE '%${search}%' OR additional LIKE '%${search}%' OR tags LIKE '%${search}%';`,
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
    } else {

        var list: { [key: string]: string } = {
            "topic": "topic",
            "title": "title",
            "subtitle": "subtitle",
            "content": "description",
            "tags": "tags"
        };

        var column = list[option];

        console.log({option});
        

        return new Promise<Codes[]>((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM codes WHERE ${column} LIKE '%${search}%';`,
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
    }
}

const getExistingTags = async (db: SQLite.SQLiteDatabase) => {
    return new Promise<string[]>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT tags FROM codes;',
                [],
                (tx, results) => {
                    const rows : string[] = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        rows.push(results.rows.item(i).tags);
                    }
                    resolve(rows);
                },
                error => reject(error)
            );
        });
    });
};

const getEntryByReference = async (db: SQLite.SQLiteDatabase, reference: string) => {
    return new Promise<Codes | null>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM codes WHERE reference = ?;',
                [reference],
                (tx, results) => {
                    if (results.rows.length > 0) {
                        resolve(results.rows.item(0));
                    } else {
                        resolve(null);
                    }
                },
                error => reject(error)
            );
        });
    });
}

export { initializeDatabase, closeDatabase, addEntry, removeAllEntries, getAllEntries, getFilteredEntries, getExistingTags, updateDB, deleteEntry, getEntryByReference};