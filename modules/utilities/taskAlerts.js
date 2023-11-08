export const taskAlerts = (data) => {
  const alerts = {};
  const { time_spent, time_estimate, points} = data;

  if (!time_spent) alerts.tacked = !!time_spent;
  if (!time_estimate) alerts.estimated = !!time_estimate;
  if (!points) alerts.points = !!points;

  alerts.count = Object.keys(alerts).length;

  return alerts;
};
