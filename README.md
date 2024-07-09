# qr-code

In `app/qrreader` run `npx react-native run-android` to start app.

In the `app/qrreader/android` folder run `./gradlew clean` if something doesnt work.

# Get the database

- Run the app.
- run `adb shell`
- run `run-as com.qrreader`
- run `cd /data/user/0/com.qrreader/databases`
- run `cp myDatabase.db /sdcard/Download/`
- In a terminal run `cd D:/programming/qr-code/backup_db/`
- In a terminal run `adb pull /sdcard/Download/myDatabase.db`