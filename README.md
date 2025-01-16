# CTIS - Crypto Trading Information System

A web-based cryptocurrency trading simulation platform that allows users to practice trading with historical crypto price data.

## Features

- **Multi-user System**: Create and manage multiple user profiles
- **Real-time Trading Simulation**: Buy and sell various cryptocurrencies
- **Interactive Charts**: View historical price data with candlestick charts
- **Portfolio Management**: Track your holdings and overall balance
- **Time Controls**: Step through trading days one by one or use auto-play
- **Multiple Cryptocurrencies**: Trade popular coins including:
  - Bitcoin (BTC)
  - Ethereum (ETH)
  - Cardano (ADA)
  - Dogecoin (DOGE)
  - Polygon (POL)
  - Synthetix (SNX)
  - TRON (TRX)
  - Ripple (XRP)
  - Avalanche (AVAX)

## Technologies Used

- HTML5
- CSS3
- JavaScript
- jQuery 3.5.1
- Font Awesome 6.5.0
- Local Storage for data persistence

## Setup

1. Clone the repository:


2. Open the project directory:


3. Open `index.html` in your web browser to start using the application.

## Usage

1. Create a new user profile from the main menu
2. Each new user starts with $1,000 in their wallet
3. Select different cryptocurrencies to view their price charts
4. Use the trading panel to:
   - Buy cryptocurrencies using available funds
   - Sell cryptocurrencies from your portfolio
   - Track your total balance and holdings
5. Navigate through trading days using:
   - "Next Day" button for step-by-step progression
   - "Play" button for automatic progression

## Project Structure

- `index.html` - Main entry page with user management
- `nextDayPart.html` - Trading interface
- CSS Files:
  - `indexstyle.css` - Styles for the main page
  - `project.css` - Styles for the trading interface
- JavaScript Files:
  - `menu.js` - User management functionality
  - `main.js` - Trading and chart functionality
  - `db.js` - Historical price data (not included in repository)

## Data Storage

The application uses Local Storage to persist:
- User profiles
- Wallet balances
- Trading history
- Current session information

## Contributors

- Emir Yaman Gazaz
- Furkan Efe Semerci
- Samet Karsandı
- Efe Tanöz
- Bora Yıldırım

## Notes

- This is a simulation platform using historical data
- No real cryptocurrency transactions are performed
- The simulation runs for 365 trading days

## Requirements

- Modern web browser with JavaScript enabled
- Local storage access
- Internet connection (for loading external libraries)

## License

This project is open source.
