const formatDate = (dateString: Date) => {
  const date = new Date(dateString);

  //get month
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    timeZone: 'IST',
  };
  const month = date.toLocaleString('en-IN', options);

  //get day
  const day = date.getUTCDate();

  //format time in 12 hr
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'IST',
  };

  const time = date.toLocaleDateString('en-IN', timeOptions);

  //formatt ed string
  return `${day} ${month} ${time}`;
};

export default formatDate;