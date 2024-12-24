import {Status} from '../../Enums/Status';

export interface ProfileWithStatusDTO {
  id: string;
  profilePhoto?: string;
  status: Status;

}
