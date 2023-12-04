import { getDataFromObject } from "./getData.js";

export const taskAlerts = (data,fieldData) => {
  const alerts = {};
  const { time_spent, time_estimate, points} = data;
  const qa = fieldData ? getDataFromObject(fieldData,'username') : 'Unassigned';
  
  if (!time_spent) alerts.tacked = !!time_spent;
  if (!time_estimate) alerts.estimated = !!time_estimate;
  if (!points) alerts.points = !!points;
  if (qa === 'Unassigned') alerts.qa = !qa;

  alerts.count = Object.keys(alerts).length;
  return alerts; 
};
