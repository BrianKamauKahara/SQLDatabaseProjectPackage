# Records Fetching Form

## Overview

**Records Fetching Form** is a heartfelt project that demonstrates the ability to link to a Microsoft SQL Server backend and query it. It is meant to be a demo since right now I cannot host my on SQL server online somewhere, which sucks, but its okay. The form is simple, just select the table and the attributes you want to see, submit this, and click download to get a csv of the data

## Features

- **Select from Available Tables**: When the form loads, it first fetches basic data about the tables present in the database
- **Custom Column Selection**: After selecting a table, you then choose the columns you want in the table
- **CSV Export**: After finalising your selection, a 'Download as CSV' button appears. When you press this button, you will get the queried data in a csv file

## How It Works
(AI cooked this one for me)
1. **Fetch Available Tables**:
   - When the form loads, a request is made to the backend to retrieve a list of all available tables from the Microsoft SQL Server database.

2. **Select a Table**:
   - Users can choose a table from the list of available options. Once selected, the form dynamically updates to allow the user to choose which columns to view.

3. **Choose Columns**:
   - For the selected table, users can choose the specific columns they want to include in the data export.

4. **Download Data**:
   - Upon submission, the data for the selected table and columns is fetched from the database and exported to a CSV file for download.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript 
- **Backend**: Node.js with Express.js 
- **Database**: Microsoft SQL Server for data storage


## How to Install
This project is meant to work on a local machine. You can clone this project and run it on your local machine
Make sure your Microsoft SQL Server is configured to allow you to connect to it. You can use AI to help you, because this procedure may vary from person to person


1. Clone the project from GitHub and run:

   ```bash
   npm install

2. Add a .env file in the root directory and specify the following items:
   ```bash
    SERVER_PORT= // whichever you wish
    USER= // a user with SELECT rights in your MSSQL server
    PASSWORD= // the user's password
    SERVER=localhost
    DATABASE= // the database's name
    PORT=1433 // the default port for TCP/IP connection to MS SQL database

4. In the terminal, run:
    ```bash
   npm run 
   ```

   or

   ```bash
   npm start
   ```
- Success! Provided the details you supplied are correct, and your SQL Server is configured for both Windows authentication and SQL Server authentication, you should now be able to select data from any tables in your database.





