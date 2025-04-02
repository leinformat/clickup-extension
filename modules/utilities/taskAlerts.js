import { getDataFromObject } from "./getData.js";

export const taskAlerts = (data,fieldData) => {
  const alerts = {};
  const { time_spent, time_estimate, custom_fields } = data;
  const qa = fieldData ? getDataFromObject(fieldData,'username') : 'Unassigned';
  const projectType = custom_fields.filter(field => field.name.toLowerCase() === 'project type (internal)');

  
  const validFields = [
    "level of complexity",
    "level of complexity+",
    "level of complexity*",
  ];

  const levelOfComplexity = data.custom_fields
        .filter(field => validFields.includes(field.name.toLowerCase()))
        .some(field => !!field.value );
  
  if (!time_spent) alerts.tacked = !!time_spent;
  if (!time_estimate) alerts.estimated = !!time_estimate;
  if (qa === 'Unassigned') alerts.qa = !qa;

  if (!!projectType.length) alerts.projectType = !projectType.length;
  
  if (!levelOfComplexity) alerts.levelOfComplexity = levelOfComplexity;

  alerts.count = Object.keys(alerts).length;
  return alerts; 
};