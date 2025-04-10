import { dateFormat } from './dateFormat.js';
import { getDataFromObject} from './getData.js';
import { copyToSlack, copyEstimation, copyDeliverToQA,copyCannotDeliverOnTime, revisionQA } from './copyText.js';

export const copyComment = (copyTextkBtn,data,fieldData,fieldPm) =>{
  const pmName = getDataFromObject(fieldPm,'username');
  const pmId = getDataFromObject(fieldPm,'id');
    copyTextkBtn.forEach( item =>{
        item.addEventListener("click",(e)=>{
          // Slack Comment
          if(item.dataset.comment === 'qa-slack'){
            let qaField = getDataFromObject(fieldData,'username');

            qaField == 'QA Team' ? qaField = 'team-qa' : qaField = qaField; 
  
            copyToSlack(
              {
                pm:pmName,
                qa:fieldData ? qaField : 'Unassigned',
                url:data.url,
                client:data.project.name,
                subClient:data.list.name
              },
              e.target);
          }
          // Estimation Comment
          else if(item.dataset.comment === 'estimation'){
            
            const validFields = [
              "level of complexity",
              "project type (internal)",
              "level of complexity+",
              "level of complexity*",
            ];

            const customFieldsFirst = data.custom_fields.filter(
              (field) =>
                validFields.includes(field.name.toLowerCase())
            );

            const customFields = {
              fields: [],
              groupFields: []
            };
          
            for (const customField of customFieldsFirst) {
              const fieldValue = customField?.value;

              const fieldSelectedOption =
                customField?.type_config &&
                customField?.type_config.options.find(
                  (option) => option.orderindex == fieldValue
                );

              if(customField?.name.toLowerCase().includes('level of complexity')){
                customFields.groupFields.push({
                  fieldName: customField?.name,
                  name: fieldSelectedOption?.name || null,
                  value: fieldValue || null,
                });
              }else{
                customFields.fields.push({
                  fieldName: customField?.name,
                  name: fieldSelectedOption?.name || null,
                  value: fieldValue || null,
                });
              }             
            }
            
            const qaData = fieldData;
            const dueDate = dateFormat(data.due_date,'month-day');

            copyEstimation(
              {
                pmId:pmId,
                pm:pmName,
                qa: qaData || [],
                dueDate,
                customFields,
                data
              },
              e.target);
          }
          // Deliver to QA Comment
          else if(item.dataset.comment === 'deliver-to-qa'){
            const qaData = fieldData;
  
            copyDeliverToQA(
              {
                pmId:pmId,
                pm:pmName,
                qa:qaData || []
              },
              e.target);
          }
          // Cannot Deliver on Time Comment
          else if(item.dataset.comment === 'cannot-deliver-on-time'){
            const qaData = fieldData;
            const dueDate = dateFormat(data.due_date,'month-day');
            copyCannotDeliverOnTime(
              {
                pmId:pmId,
                pm:pmName,
                dueDate,
                qa:qaData || []
              },
              e.target);
          }
          // Deliver to QA Comment
          else if(item.dataset.comment === 'revision-qa'){
            const implementorName = getDataFromObject(data.assignees,'username');
            const implementorId = getDataFromObject(data.assignees,'id');
            revisionQA(
              {
                pmId:pmId,
                pm:pmName,
                imId: implementorId,
                imName: implementorName,
              },
              e.target);
          }
        });
      });
}