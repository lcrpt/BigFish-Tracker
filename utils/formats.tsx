const dollarUS = Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumSignificantDigits: 3,
});

const formatAmount = (amount: string) => dollarUS.format(parseInt(amount));

export { dollarUS, formatAmount };