export default function FormatMoney() {
  const options = {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  };

  const formatter = new Intl.NumberFormat('en-AU', options);
}
