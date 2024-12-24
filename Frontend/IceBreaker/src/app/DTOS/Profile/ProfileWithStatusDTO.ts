import {Status} from '../../Enums/Status';

export interface ProfileWithStatusDTO {
  id: string;
  username:string,
  profilePhoto?: string;
  status: Status;

}
