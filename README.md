Food analyzer app
Quick start:

1. Install deps: npm install
2. Run server/frontend: npm run dev:all

FOR AI USE:
1. Create a Google Cloud project, making an account if necessary. Visit https://developers.google.com/workspace/guides/create-project for help

2. Enable billing for the project (for help, go to same link as (1.) and scroll down to "Enable billing for your cloud project").
3. Enable Cloud Vision API.
    a. Search for "Cloud Vision" on search bar
    b. Select "Cloud Vision API"
    c. Select "Enable"
4. Create a Service Account
    a. Go to IAM & Admin section on sidebar
    b. Select Service Accounts
    c. Select Create Service Account
5. Add JSON Key
    a. Select the service account you just created.
    b. Select Keys -> Add Key -> Key Type: JSON
6. Move the downloaded JSON to `server/vision-key.json` in the project. (This will require you to rename the file to vision-key.json)
7. Ensure `server/vision-key.json` is listed in `.gitignore`.
8. From /server: `npm install` and then `npm run dev:all`.
9. Test AI on app!

