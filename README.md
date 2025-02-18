Trading Bot for MEXC Futures

This is a Node.js trading bot that interacts with the MEXC Futures API to execute trades based on a strategy. The bot supports market monitoring, risk management (stop-loss and take-profit), and strategy integration for automated buy and sell decisions.

Features
	•	Automated Buy/Sell Orders: Based on strategy or market conditions.
	•	Risk Management: Includes stop-loss and take-profit functionality.
	•	Market Monitoring: Fetches real-time market data to make trading decisions.
	•	Strategy Implementation: Supports simple strategies like moving average crossovers (customizable).
	•	Heroku Deployment: Easily deploy the bot on Heroku.

Getting Started

Prerequisites
	•	Node.js (v14.x or higher)
	•	Heroku Account (for deployment)
	•	MEXC Futures API Key and Secret

1. Clone the Repository

Clone this repository to your local machine:

git clone https://github.com/TEAM-DLK/trading-bot.git
cd trading-bot

2. Install Dependencies

Install the required Node.js dependencies:

npm install

3. Set Up Environment Variables

Create a .env file in the root of the project with your MEXC API credentials:

API_KEY=your_api_key
API_SECRET=your_api_secret

4. Run Locally

To start the bot locally and test it, run the following command:

node tradingBot.js

5. Deploy to Heroku

Step 1: Create a Heroku App

Make sure you’re logged into your Heroku account:

heroku login

Create a new Heroku app:

heroku create trading-bot-app

Step 2: Add Environment Variables on Heroku

To securely store your MEXC API keys on Heroku, set the environment variables using the Heroku CLI:

heroku config:set API_KEY=your_api_key
heroku config:set API_SECRET=your_api_secret

Step 3: Deploy to Heroku

Push the code to Heroku:

git push heroku master

Step 4: Monitor Logs

To monitor the bot’s activity in real-time:

heroku logs --tail

Strategy

This bot is built to execute trades based on a simple moving average crossover strategy, but you can customize it further by implementing your own strategies. It also includes risk management features like stop-loss and take-profit based on configurable percentages.

Risk Management

The bot supports stop-loss and take-profit features to manage the risk of each trade. These values can be adjusted to suit your trading preferences.
	•	Stop-Loss: Automatically closes the position when the price drops by a specified percentage from the entry price.
	•	Take-Profit: Automatically closes the position when the price increases by a specified percentage from the entry price.

Contributing
	1.	Fork the repository.
	2.	Create a new branch (git checkout -b feature-name).
	3.	Commit your changes (git commit -am 'Add feature').
	4.	Push to the branch (git push origin feature-name).
	5.	Open a pull request.
