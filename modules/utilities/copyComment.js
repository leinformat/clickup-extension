import { dateFormat } from './dateFormat.js';
import { getDataFromObject} from './getData.js';
import { copyToSlack, copyEstimation, copyDeliverToQA, revisionQA } from './copyText.js';

export const copyComment = (copyTextkBtn,data,fieldData) =>{
    copyTextkBtn.forEach( item =>{
        item.addEventListener("click",(e)=>{
          // Slack Comment
          if(item.dataset.comment === 'qa-slack'){
            let qaField = getDataFromObject(fieldData,'username');
            qaField == 'QA Team' ? qaField = 'team-qa' : qaField = qaField;
  
            copyToSlack(
              {
                pm:data.creator.username,
                qa:fieldData ? qaField : 'Unassigned',
                url:data.url,
                client:data.project.name,
                subClient:data.list.name
              },
              e.target);
          }
          // Estimation Comment
          else if(item.dataset.comment === 'estimation'){
            let qaField = getDataFromObject(fieldData,'username');
            const qaId = getDataFromObject(fieldData,'id');
            const dueDate = dateFormat(data.due_date,'month-day');
            qaField == 'QA Team' ? qaField = 'QA Team' : qaField = qaField;
  
            copyEstimation(
              {
                pmId:data.creator.id,
                pm:data.creator.username,
                qa:fieldData ? qaField : 'Unassigned',
                qaId,
                dueDate
              },
              e.target);
          }
          // Deliver to QA Comment
          else if(item.dataset.comment === 'deliver-to-qa'){
            let qaField = getDataFromObject(fieldData,'username');
            const qaId = getDataFromObject(fieldData,'id');
            qaField == 'QA Team' ? qaField = 'team-qa' : qaField = qaField;
  
            copyDeliverToQA(
              {
                pmId:data.creator.id,
                pm:data.creator.username,
                qa:fieldData ? qaField : 'Unassigned',
                qaId,
              },
              e.target);
          }
          // Deliver to QA Comment
          else if(item.dataset.comment === 'revision-qa'){
            const implementorName = getDataFromObject(data.assignees,'username');
            const implementorId = getDataFromObject(data.assignees,'id');
            revisionQA(
              {
                pmId:data.creator.id,
                pm:data.creator.username,
                imId: implementorId,
                imName: implementorName,
              },
              e.target);
          }
        });
      });
}