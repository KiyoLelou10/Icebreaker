import {Status} from '../../Enums/Status';

export interface AvailableUserDTO {
  id: string;
  userName: string;
  profilePhoto?: string;
  bio?: string;
  status: Status;
}
