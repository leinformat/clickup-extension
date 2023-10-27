import { teamsData } from "./modules/background/teams.js"
import { getUserData, handlerOptions,renderTeamsData } from './modules/settings/settingsFunctions.js';
import './modules/settings/settingsEventHandlers.js';

// USer Data
getUserData();

// Options
handlerOptions();

// Teams
renderTeamsData(teamsData.teams);